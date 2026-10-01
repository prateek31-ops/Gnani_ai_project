"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.database import engine, Base
from app.routes import notes
from app.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Ensure upload directory exists
    os.makedirs(settings.upload_dir, exist_ok=True)

    # Mount static files AFTER ensuring the directory exists
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

    yield
    # Shutdown logic can go here


# Ensure upload directory exists before app creation (needed for StaticFiles)
os.makedirs(settings.upload_dir, exist_ok=True)

app = FastAPI(title="Audio Notes Platform API", lifespan=lifespan)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(notes.router)

# Serve static files (uploads)
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")


@app.get("/")
async def root():
    """Root endpoint health check."""
    return {"message": "Welcome to the Audio Notes Platform API"}
