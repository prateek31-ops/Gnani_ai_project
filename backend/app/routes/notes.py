from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from typing import List
import os

from app.database import get_db
from app.models.note import AudioNote, NoteStatus
from app.schemas.note import AudioNoteResponse
from app.utils.file_handler import save_upload_file
from app.services.audio_processor import process_audio_note

router = APIRouter(prefix="/api/notes", tags=["Notes"])

@router.post("/upload", response_model=AudioNoteResponse)
async def upload_note(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Uploads an audio file and starts background processing."""
    try:
        file_path, original_filename = await save_upload_file(file)
        
        file_size = os.path.getsize(file_path)
        title = os.path.splitext(original_filename)[0]

        # Create DB record
        new_note = AudioNote(
            title=title,
            original_filename=original_filename,
            file_path=file_path,
            file_size=file_size,
            status=NoteStatus.pending
        )
        db.add(new_note)
        await db.commit()
        await db.refresh(new_note)

        # Trigger background processing
        background_tasks.add_task(process_audio_note, new_note.id)

        return new_note
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("", response_model=List[AudioNoteResponse])
async def list_notes(db: AsyncSession = Depends(get_db)):
    """Lists all audio notes sorted by creation date."""
    result = await db.execute(select(AudioNote).order_by(desc(AudioNote.created_at)))
    return result.scalars().all()

@router.get("/{note_id}", response_model=AudioNoteResponse)
async def get_note(note_id: str, db: AsyncSession = Depends(get_db)):
    """Gets a specific audio note by ID."""
    note = await db.get(AudioNote, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.delete("/{note_id}")
async def delete_note(note_id: str, db: AsyncSession = Depends(get_db)):
    """Deletes an audio note and its associated file."""
    note = await db.get(AudioNote, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Remove file from disk
    if os.path.exists(note.file_path):
        try:
            os.remove(note.file_path)
        except OSError as e:
            pass # Log this in a real app
            
    await db.delete(note)
    await db.commit()
    return {"message": "Note deleted successfully"}
