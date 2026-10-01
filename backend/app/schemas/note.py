from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
import uuid
from app.models.note import NoteStatus

class AudioNoteBase(BaseModel):
    title: str
    original_filename: str
    file_size: int

class AudioNoteCreate(AudioNoteBase):
    pass

class AudioNoteResponse(AudioNoteBase):
    id: str
    file_path: str
    duration: Optional[float] = None
    transcript: Optional[str] = None
    summary: Optional[str] = None
    status: NoteStatus
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
