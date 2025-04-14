from pydantic_settings import BaseSettings
from pathlib import Path
import os

# Base directory
BASE_DIR = Path(__file__).resolve().parent

class Settings(BaseSettings):
    """Application settings"""
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "HEIC to JPG Converter API"
    
    # CORS settings
    CORS_ORIGINS: list = ["*"]
    
    # File settings
    TEMP_DIR: Path = BASE_DIR / "temp"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50 MB
    ALLOWED_EXTENSIONS: list = [".heic", ".heif"]
    
    # Image settings
    JPG_QUALITY: int = 95  # 0-100
    
    # Cleanup settings
    AUTO_CLEANUP: bool = True
    FILE_RETENTION_MINUTES: int = 30
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# Create settings instance
settings = Settings()

# Ensure temp directory exists
os.makedirs(settings.TEMP_DIR, exist_ok=True)
