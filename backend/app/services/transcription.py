import asyncio
import httpx
from app.config import settings
import logging
from pydub import AudioSegment
import tempfile
import os

logger = logging.getLogger(__name__)

async def transcribe_chunk(client: httpx.AsyncClient, chunk_path: str, headers: dict) -> str:
    """Helper function to transcribe a single chunk of audio."""
    for attempt in range(6):  # up to 6 attempts
        with open(chunk_path, "rb") as f:
            files = {"audio_file": (os.path.basename(chunk_path), f, "audio/wav")}
            data = {"language_code": "en-IN"}
            
            try:
                response = await client.post(
                    settings.gnani_api_url, 
                    headers=headers, 
                    data=data,
                    files=files
                )
            except httpx.RequestError as e:
                wait_time = 3 * (2 ** attempt)
                logger.warning(f"Network error communicating with Gnani API ({str(e)}). Retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)
                continue
            
            if response.status_code == 429:
                wait_time = 3 * (2 ** attempt)  # 3s, 6s, 12s...
                logger.warning(f"Gnani API Rate Limited (429). Retrying in {wait_time}s...")
                await asyncio.sleep(wait_time)
                continue
            
            if response.status_code != 200:
                logger.error(f"Gnani ASR API Error: {response.status_code} - {response.text}")
                # Try to gracefully return empty string instead of failing whole process if one chunk fails
                return ""
                
            result = response.json()
            
            if "transcript" in result:
                return result["transcript"]
            elif "text" in result:
                return result["text"]
            elif "transcription" in result:
                return result["transcription"]
            elif "data" in result and isinstance(result["data"], str):
                return result["data"]
            
            return ""
    
    logger.error("Gnani ASR API: Exceeded maximum retries for chunk.")
    return ""

async def transcribe_audio(file_path: str) -> str:
    """
    Transcribes audio using Gnani ASR API.
    Splits audio into 25-second chunks to respect API limits.
    """
    if settings.mock_services:
        await asyncio.sleep(3)
        return "This is a mock transcription of the uploaded audio file. It simulates the ASR process for demonstration purposes."
    
    if not settings.gnani_api_key:
        raise ValueError("GNANI_API_KEY is not set.")
    
    headers = {
        "X-API-Key-ID": settings.gnani_api_key
    }
    
    logger.info(f"Loading audio file {file_path} for chunking...")
    
    # Load and chunk audio (run in executor to avoid blocking event loop)
    loop = asyncio.get_event_loop()
    audio = await loop.run_in_executor(None, AudioSegment.from_file, file_path)
    
    # Gnani limit is 30s, so we'll chunk by 25s (25000 ms)
    chunk_length_ms = 25 * 1000 
    chunks = [audio[i:i + chunk_length_ms] for i in range(0, len(audio), chunk_length_ms)]
    
    logger.info(f"Split audio into {len(chunks)} chunks. Starting transcription.")
    
    full_transcript = []
    
    with tempfile.TemporaryDirectory() as tmpdirname:
        async with httpx.AsyncClient(timeout=60.0) as client:
            # We can do this sequentially to avoid rate limiting
            for idx, chunk in enumerate(chunks):
                chunk_path = os.path.join(tmpdirname, f"chunk_{idx}.wav")
                # Export chunk to a temp file
                await loop.run_in_executor(None, lambda: chunk.export(chunk_path, format="wav"))
                
                logger.info(f"Transcribing chunk {idx+1}/{len(chunks)}...")
                text = await transcribe_chunk(client, chunk_path, headers)
                if text:
                    full_transcript.append(text.strip())
                    
    return " ".join(full_transcript)
