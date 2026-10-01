from sqlalchemy import Column, String, Integer, Float, Text, Enum, DateTime
from sqlalchemy.sql import func
import uuid
import enum
from app.database import Base

class NoteStatus(str, enum.Enum):
    pending = "pending"
    uploading = "uploading"
    transcribing = "transcribing"
    summarizing = "summarizing"
    completed = "completed"
    failed = "failed"

class AudioNote(Base):
    """SQLAlchemy model for Audio Notes."""
    __tablename__ = "audio_notes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    original_filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    duration = Column(Float, nullable=True)
    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    status = Column(Enum(NoteStatus), default=NoteStatus.pending, nullable=False)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
