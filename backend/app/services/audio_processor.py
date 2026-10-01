import re
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.note import AudioNote, NoteStatus
from app.services.transcription import transcribe_audio
from app.services.summarization import summarize_text
from app.database import AsyncSessionLocal
import logging

logger = logging.getLogger(__name__)

def format_transcript(text: str) -> str:
    if not text:
        return text
    
    # Heuristic: split on double spaces or long pauses, add periods there
    text = re.sub(r' {2,}', '. ', text)
    
    # Clean up extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Capitalize 'i' -> 'I'
    text = re.sub(r'\bi\b', 'I', text)
    
    # Capitalize first letter of the text
    if text:
        text = text[0].upper() + text[1:]
        
    # Capitalize the first letter after every sentence-ending punctuation
    def capitalize_match(match):
        return match.group(1) + match.group(2).upper()
        
    text = re.sub(r'([.!?]\s+)([a-z])', capitalize_match, text)
    
    return text

async def process_audio_note(note_id: str):
    async with AsyncSessionLocal() as db:
        note = await db.get(AudioNote, note_id)
        if not note:
            logger.error(f"Note {note_id} not found.")
            return

        try:
            note.status = NoteStatus.transcribing
            await db.commit()
            
            transcript = await transcribe_audio(note.file_path)
            transcript = format_transcript(transcript)
            note.transcript = transcript
            
            note.status = NoteStatus.summarizing
            await db.commit()
            
            summary = await summarize_text(transcript)
            note.summary = summary
            
            note.status = NoteStatus.completed
            await db.commit()
            
        except Exception as e:
            logger.exception(f"Error processing note {note_id}: {e}")
            note.status = NoteStatus.failed
            note.error_message = str(e)
            await db.commit()
