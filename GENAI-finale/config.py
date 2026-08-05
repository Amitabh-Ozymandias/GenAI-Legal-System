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
        for model_name in ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-2.0-flash"]:
            try:
                _model = genai.GenerativeModel(model_name=model_name)
                logger.info(f"[LAZY LOAD] Loaded Gemini model: {model_name}")
                break
            except Exception:
                continue
        if _model is None:
            _model = genai.GenerativeModel(model_name="gemini-2.5-flash")
    return _model