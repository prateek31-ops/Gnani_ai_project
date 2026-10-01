from pydantic_settings import BaseSettings
import os
from typing import List

class Settings(BaseSettings):
    """Application settings and environment variables."""
    database_url: str = "sqlite+aiosqlite:///./audio_notes.db"
    mock_services: bool = True
    gnani_api_key: str = ""
    gnani_api_url: str = "https://api.vachana.ai/stt/v3"
    groq_api_key: str = ""
    upload_dir: str = "./uploads"
    max_file_size_mb: int = 50
    allowed_extensions: str = ".mp3,.wav,.ogg,.m4a,.flac,.webm,.mp4"

    @property
    def allowed_extensions_list(self) -> List[str]:
        return [ext.strip() for ext in self.allowed_extensions.split(",")]

    class Config:
        env_file = ".env"

settings = Settings()
