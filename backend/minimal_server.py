"""
Enhanced FastAPI server for HEIC to JPG conversion.
This version uses Pillow for image processing and handles HEIC files by converting them to JPG.
"""

import uuid
import time
import shutil
import logging
import asyncio
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional
from contextlib import asynccontextmanager

# FastAPI imports
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, BackgroundTasks, Query
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from starlette.responses import RedirectResponse
from pydantic import BaseModel, Field

# Pillow for image processing
from PIL import Image

# Import pillow-heif for HEIC support
import pillow_heif

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Models
class ConversionOptions(BaseModel):
    """Options for image conversion"""
    quality: Optional[int] = Field(default=95, ge=1, le=100, description="JPEG quality (1-100)")
    resize: Optional[bool] = Field(default=False, description="Whether to resize the image")
    width: Optional[int] = Field(default=None, ge=1, description="Target width in pixels")
    height: Optional[int] = Field(default=None, ge=1, description="Target height in pixels")
    maintain_aspect_ratio: Optional[bool] = Field(default=True, description="Maintain aspect ratio when resizing")
    rotate: Optional[int] = Field(default=None, description="Rotation angle in degrees")

class ConversionResponse(BaseModel):
    """Response for successful conversion"""
    filename: str
    original_size: int
    converted_size: int
    conversion_time: float
    download_url: str

class ErrorResponse(BaseModel):
    """Response for error"""
    detail: str

class HealthResponse(BaseModel):
    """Response for health check"""
    status: str
    version: str
    timestamp: datetime

# Configuration
class Settings:
    PROJECT_NAME = "HEIC to JPG Converter API"
    API_V1_STR = "/api/v1"
    TEMP_DIR = Path("temp")
    MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB
    ALLOWED_EXTENSIONS = [".heic", ".heif"]
    AUTO_CLEANUP = True
    FILE_RETENTION_MINUTES = 30

settings = Settings()

# Define lifespan context manager
@asynccontextmanager
async def lifespan(_: FastAPI):
    # Create temp directory if it doesn't exist
    settings.TEMP_DIR.mkdir(exist_ok=True)

    # Start background cleanup task
    cleanup_task = asyncio.create_task(cleanup_old_files())

    logger.info(f"Started {settings.PROJECT_NAME}")

    yield

    # Cancel the cleanup task when shutting down
    cleanup_task.cancel()
    try:
        await cleanup_task
    except asyncio.CancelledError:
        logger.info("Cleanup task cancelled")

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="A modern API for converting HEIC/HEIF images to JPG format",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create temp directory if it doesn't exist
settings.TEMP_DIR.mkdir(exist_ok=True)

# Utility functions
def generate_unique_filename(extension: str = ".jpg") -> str:
    """Generate a unique filename with the given extension"""
    return f"{uuid.uuid4()}{extension}"

def clean_temp_files(retention_minutes: int = 30) -> int:
    """Clean up temporary files older than the specified retention period"""
    deleted_count = 0
    cutoff_time = datetime.now() - timedelta(minutes=retention_minutes)

    for file_path in settings.TEMP_DIR.glob("*"):
        if file_path.is_file() and not file_path.name.startswith('.'):
            # Check file modification time
            mod_time = datetime.fromtimestamp(file_path.stat().st_mtime)
            if mod_time < cutoff_time:
                try:
                    file_path.unlink()
                    deleted_count += 1
                except Exception as e:
                    logger.error(f"Error deleting file {file_path}: {str(e)}")

    return deleted_count

# Background task to clean up old files
async def cleanup_old_files():
    while True:
        try:
            if settings.AUTO_CLEANUP:
                deleted_count = clean_temp_files(settings.FILE_RETENTION_MINUTES)
                if deleted_count > 0:
                    logger.info(f"Cleaned up {deleted_count} old files")
        except Exception as e:
            logger.error(f"Error during cleanup: {str(e)}")

        # Sleep for 10 minutes
        await asyncio.sleep(600)

# Custom OpenAPI docs
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - API Documentation",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css",
    )

@app.get("/", include_in_schema=False)
async def root():
    return RedirectResponse(url="/docs")

@app.get("/api/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Check the health of the API"""
    return {
        "status": "ok",
        "version": "1.0.0",
        "timestamp": datetime.now(),
    }

@app.post(
    f"{settings.API_V1_STR}/convert",
    response_model=ConversionResponse,
    responses={
        400: {"model": ErrorResponse},
        413: {"model": ErrorResponse},
        415: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
    tags=["Conversion"],
)
async def convert_image(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    quality: Optional[int] = Form(95, ge=1, le=100),
    resize: Optional[bool] = Form(False),
    width: Optional[int] = Form(None, ge=1),
    height: Optional[int] = Form(None, ge=1),
    maintain_aspect_ratio: Optional[bool] = Form(True),
    rotate: Optional[int] = Form(None),
):
    """Convert HEIC/HEIF image to JPG format"""
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file format. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    try:
        # Start timing
        start_time = time.time()

        # Generate unique filenames
        input_filename = generate_unique_filename(file_ext)
        output_filename = generate_unique_filename(".jpg")

        input_path = settings.TEMP_DIR / input_filename
        output_path = settings.TEMP_DIR / output_filename

        # Save uploaded file
        content = await file.read()
        with open(input_path, "wb") as buffer:
            buffer.write(content)

        # Convert HEIC to JPG using pillow-heif and Pillow
        try:
            # Register HEIF opener with Pillow
            pillow_heif.register_heif_opener()

            # Now we can open HEIC files directly with Pillow
            with Image.open(input_path) as img:
                # Convert to RGB mode if needed (HEIC might be in other color modes)
                if img.mode != 'RGB':
                    img = img.convert('RGB')

                # Apply rotation if specified
                if rotate is not None:
                    try:
                        if rotate == 90:
                            img = img.transpose(Image.ROTATE_90)
                        elif rotate == 180:
                            img = img.transpose(Image.ROTATE_180)
                        elif rotate == 270:
                            img = img.transpose(Image.ROTATE_270)
                    except AttributeError:
                        # For newer Pillow versions
                        if rotate == 90:
                            img = img.transpose(Image.Transpose.ROTATE_90)
                        elif rotate == 180:
                            img = img.transpose(Image.Transpose.ROTATE_180)
                        elif rotate == 270:
                            img = img.transpose(Image.Transpose.ROTATE_270)

                # Apply resize if specified
                if resize and (width is not None or height is not None):
                    original_width, original_height = img.size
                    new_width = width or original_width
                    new_height = height or original_height

                    if maintain_aspect_ratio:
                        if width and not height:
                            # Calculate height to maintain aspect ratio
                            new_height = int(original_height * (new_width / original_width))
                        elif height and not width:
                            # Calculate width to maintain aspect ratio
                            new_width = int(original_width * (new_height / original_height))

                    # Use LANCZOS resampling (different constant name in different Pillow versions)
                    try:
                        img = img.resize((new_width, new_height), Image.LANCZOS)
                    except AttributeError:
                        # For older Pillow versions
                        try:
                            img = img.resize((new_width, new_height), Image.ANTIALIAS)
                        except AttributeError:
                            # For newer Pillow versions where ANTIALIAS is also removed
                            img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)

                # Save as JPG with specified quality
                img.save(output_path, "JPEG", quality=quality, optimize=True)
                logger.info(f"Successfully converted {file.filename} to JPG using pillow-heif")
        except Exception as img_error:
            # If pillow-heif conversion fails, try alternative method
            logger.warning(f"pillow-heif conversion failed: {str(img_error)}. Trying alternative method...")

            try:
                # Try using direct heif reading
                heif_file = pillow_heif.open_heif(input_path)

                # Convert to PIL Image
                img = Image.frombytes(
                    heif_file.mode,
                    heif_file.size,
                    heif_file.data,
                    'raw',
                    heif_file.mode,
                    heif_file.stride,
                )

                # Apply the same processing as above
                if img.mode != 'RGB':
                    img = img.convert('RGB')

                # Save as JPG
                img.save(output_path, "JPEG", quality=quality, optimize=True)
                logger.info(f"Successfully converted {file.filename} to JPG using alternative method")
            except Exception as alt_error:
                # If all conversion methods fail, log the error
                logger.error(f"All conversion methods failed: {str(alt_error)}")
                raise HTTPException(status_code=500, detail=f"Failed to convert HEIC to JPG: {str(alt_error)}")

        # Get file sizes
        original_size = input_path.stat().st_size
        converted_size = output_path.stat().st_size

        # Calculate conversion time
        conversion_time = time.time() - start_time

        # Schedule cleanup of input file
        background_tasks.add_task(lambda: input_path.unlink(missing_ok=True))

        # Generate download URL
        download_url = f"{settings.API_V1_STR}/download/{output_filename}"

        # Log success
        logger.info(f"Successfully converted {file.filename} to JPG")

        # Return conversion details
        return ConversionResponse(
            filename=f"{Path(file.filename).stem}.jpg",
            original_size=original_size,
            converted_size=converted_size,
            conversion_time=conversion_time,
            download_url=download_url,
        )

    except Exception as e:
        logger.error(f"Error during conversion: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error during conversion: {str(e)}")

@app.get(
    f"{settings.API_V1_STR}/download/{{filename}}",
    tags=["Conversion"],
)
async def download_image(filename: str, custom_filename: Optional[str] = Query(None)):
    """Download a converted image"""
    file_path = settings.TEMP_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found or has expired"
        )

    return FileResponse(
        path=str(file_path),
        media_type="image/jpeg",
        filename=custom_filename or filename,
    )

# Startup tasks are now handled by the lifespan context manager

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
