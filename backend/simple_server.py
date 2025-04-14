"""
Simple FastAPI server for HEIC to JPG conversion.
This is a simplified version that can be used if there are issues with the main server.
"""

import os
import uuid
import shutil
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="HEIC to JPG Converter API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create temp directory if it doesn't exist
TEMP_DIR = Path("temp")
TEMP_DIR.mkdir(exist_ok=True)

@app.get("/")
async def root():
    return {"message": "HEIC to JPG Converter API"}

@app.post("/api/v1/convert")
async def convert_image(file: UploadFile = File(...)):
    # Validate file extension
    if not file.filename.lower().endswith(('.heic', '.heif')):
        raise HTTPException(status_code=400, detail="Only HEIC/HEIF files are supported")
    
    try:
        # Generate unique filenames
        file_id = str(uuid.uuid4())
        input_path = TEMP_DIR / f"{file_id}.heic"
        output_path = TEMP_DIR / f"{file_id}.jpg"
        
        # Save uploaded file
        with open(input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # For testing purposes, just copy the file instead of converting
        # In a real implementation, you would use pyheif and Pillow to convert
        # This is just a placeholder to test the API without dependencies
        shutil.copy(input_path, output_path)
        
        # Return a mock response
        return {
            "filename": f"{Path(file.filename).stem}.jpg",
            "original_size": input_path.stat().st_size,
            "converted_size": output_path.stat().st_size,
            "conversion_time": 0.1,
            "download_url": f"/api/v1/download/{file_id}.jpg",
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during conversion: {str(e)}")
    
    finally:
        # Clean up input file
        if input_path.exists():
            input_path.unlink()

@app.get("/api/v1/download/{filename}")
async def download_image(filename: str):
    file_path = TEMP_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found or has expired")
    
    return FileResponse(
        path=str(file_path),
        media_type="image/jpeg",
        filename=filename,
    )

@app.on_event("startup")
async def startup_event():
    # Clear temp directory on startup
    for file in TEMP_DIR.glob("*"):
        if file.is_file():
            file.unlink()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("simple_server:app", host="0.0.0.0", port=8000, reload=True)
