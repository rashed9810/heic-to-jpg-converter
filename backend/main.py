import time
import shutil
import asyncio
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, BackgroundTasks, Depends, Query
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.docs import get_swagger_ui_html
from starlette.responses import RedirectResponse
from typing import Optional, List
from datetime import datetime
import logging

# Import local modules
from config import settings
from models import ConversionOptions, ConversionResponse, ErrorResponse, HealthResponse
from utils import convert_heic_to_jpg, generate_unique_filename, clean_temp_files, is_valid_heic_file

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="A modern API for converting HEIC/HEIF images to JPG format",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    # Validate file size
    file_size = 0
    chunk_size = 1024 * 1024  # 1MB
    content = b""

    while True:
        chunk = await file.read(chunk_size)
        if not chunk:
            break
        content += chunk
        file_size += len(chunk)

        if file_size > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE / (1024 * 1024):.1f} MB"
            )

    # Reset file position
    await file.seek(0)

    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file format. Allowed formats: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    try:
        # Generate unique filenames
        input_filename = generate_unique_filename(file_ext)
        output_filename = generate_unique_filename(".jpg")

        input_path = settings.TEMP_DIR / input_filename
        output_path = settings.TEMP_DIR / output_filename

        # Save uploaded file
        with open(input_path, "wb") as buffer:
            buffer.write(content)

        # Validate HEIC file
        if not is_valid_heic_file(input_path):
            raise HTTPException(
                status_code=400,
                detail="Invalid HEIC/HEIF file format"
            )

        # Convert HEIC to JPG
        original_size, converted_size, conversion_time = convert_heic_to_jpg(
            input_path=input_path,
            output_path=output_path,
            quality=quality,
            resize=resize,
            width=width,
            height=height,
            maintain_aspect_ratio=maintain_aspect_ratio,
            rotate=rotate,
        )

        # Schedule cleanup of input file
        background_tasks.add_task(lambda: input_path.unlink(missing_ok=True))

        # Generate download URL
        download_url = f"{settings.API_V1_STR}/download/{output_filename}"

        # Return conversion details
        return ConversionResponse(
            filename=f"{Path(file.filename).stem}.jpg",
            original_size=original_size,
            converted_size=converted_size,
            conversion_time=conversion_time,
            download_url=download_url,
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise

    except Exception as e:
        logger.error(f"Error during conversion: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error during conversion: {str(e)}"
        )

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

@app.on_event("startup")
async def startup_event():
    """Run startup tasks"""
    # Create temp directory if it doesn't exist
    settings.TEMP_DIR.mkdir(exist_ok=True)

    # Start background cleanup task
    asyncio.create_task(cleanup_old_files())

    logger.info(f"Started {settings.PROJECT_NAME}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
