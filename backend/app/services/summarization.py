import asyncio
from groq import Groq
from app.config import settings
import logging

logger = logging.getLogger(__name__)

async def summarize_text(text: str) -> str:
    """
    Summarizes text using Groq API (Llama 3).
    Uses mock implementation if MOCK_SERVICES is true.
    """
    if not text:
        return ""

    if settings.mock_services:
        await asyncio.sleep(2)
        return "This is a mock summary of the transcript. It captures the key points discussed in the audio."
    
    if not settings.groq_api_key:
        raise ValueError("GROQ_API_KEY is not set.")
    
    def call_groq():
        logger.info("Calling Groq API for summarization...")
        client = Groq(api_key=settings.groq_api_key)
        
        completion = client.chat.completions.create(
            model="qwen/qwen3.8-27b", # Using available Groq text model
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert transcriber. Provide a clear, well-structured, and concise summary of the following audio transcript. Extract the key takeaways."
                },
                {
                    "role": "user",
                    "content": text
                }
            ],
            temperature=0.3,
            max_tokens=1024,
            top_p=1,
            stream=False,
        )
        return completion.choices[0].message.content

    # Run in executor to not block the event loop
    loop = asyncio.get_event_loop()
    summary = await loop.run_in_executor(None, call_groq)
    
    return summary
