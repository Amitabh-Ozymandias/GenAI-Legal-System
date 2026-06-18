from dotenv import load_dotenv
import os
import logging

load_dotenv()

_model = None

def get_model():
    global _model
    if _model is None:
        import google.generativeai as genai
        logger = logging.getLogger("uvicorn")
        logger.info("[LAZY LOAD] Gemini model loaded lazily on first request")
        
        API_KEY = os.getenv("GEMINI_API_KEY")
        if not API_KEY:
            raise ValueError("GEMINI_API_KEY not found in .env")
        
        genai.configure(api_key=API_KEY)
        _model = genai.GenerativeModel(
            model_name="gemini-2.5-flash"
        )
    return _model