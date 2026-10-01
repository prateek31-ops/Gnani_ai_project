import os
import aiofiles
from fastapi import UploadFile, HTTPException
from app.config import settings
import uuid

async def save_upload_file(upload_file: UploadFile) -> tuple[str, str]:
    """
    Saves an uploaded file to the configured upload directory.
    Returns a tuple of (file_path, original_filename).
    """
    if not os.path.exists(settings.upload_dir):
        os.makedirs(settings.upload_dir, exist_ok=True)

    original_filename = upload_file.filename or "unknown.audio"
    ext = os.path.splitext(original_filename)[1].lower()
    
    if ext not in settings.allowed_extensions_list:
        raise HTTPException(status_code=400, detail=f"File extension {ext} not allowed.")
    
    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(settings.upload_dir, unique_filename)
    
    # Read the file to determine size and save
    contents = await upload_file.read()
    file_size_mb = len(contents) / (1024 * 1024)
    if file_size_mb > settings.max_file_size_mb:
        raise HTTPException(status_code=400, detail=f"File size exceeds {settings.max_file_size_mb}MB limit.")
    
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(contents)
        
    return file_path, original_filename
