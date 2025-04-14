import os
import uuid
import time
import pyheif
from PIL import Image, ImageOps
from pathlib import Path
from typing import Tuple, Optional
from datetime import datetime, timedelta
from config import settings

def is_valid_heic_file(file_path: Path) -> bool:
    """Check if the file is a valid HEIC/HEIF file"""
    try:
        # Try to read the file with pyheif
        pyheif.read(str(file_path))
        return True
    except Exception:
        return False

def convert_heic_to_jpg(
    input_path: Path, 
    output_path: Path, 
    quality: int = 95,
    resize: bool = False,
    width: Optional[int] = None,
    height: Optional[int] = None,
    maintain_aspect_ratio: bool = True,
    rotate: Optional[int] = None
) -> Tuple[int, int, float]:
    """
    Convert HEIC/HEIF file to JPG
    
    Args:
        input_path: Path to input HEIC file
        output_path: Path to output JPG file
        quality: JPEG quality (1-100)
        resize: Whether to resize the image
        width: Target width in pixels
        height: Target height in pixels
        maintain_aspect_ratio: Maintain aspect ratio when resizing
        rotate: Rotation angle in degrees
        
    Returns:
        Tuple of (original_size, converted_size, conversion_time)
    """
    start_time = time.time()
    
    # Get original file size
    original_size = input_path.stat().st_size
    
    # Read HEIC file
    heif_file = pyheif.read(str(input_path))
    
    # Convert to PIL Image
    image = Image.frombytes(
        heif_file.mode, 
        heif_file.size, 
        heif_file.data,
        "raw",
        heif_file.mode,
        heif_file.stride,
    )
    
    # Apply rotation if specified
    if rotate is not None:
        image = image.rotate(rotate, expand=True)
    
    # Resize if requested
    if resize and (width or height):
        if maintain_aspect_ratio:
            # Calculate dimensions while maintaining aspect ratio
            if width and height:
                # Use the smaller scale to ensure the image fits within the bounds
                orig_width, orig_height = image.size
                width_ratio = width / orig_width
                height_ratio = height / orig_height
                ratio = min(width_ratio, height_ratio)
                new_width = int(orig_width * ratio)
                new_height = int(orig_height * ratio)
                image = image.resize((new_width, new_height), Image.LANCZOS)
            elif width:
                # Resize by width, maintain aspect ratio
                orig_width, orig_height = image.size
                ratio = width / orig_width
                new_height = int(orig_height * ratio)
                image = image.resize((width, new_height), Image.LANCZOS)
            elif height:
                # Resize by height, maintain aspect ratio
                orig_width, orig_height = image.size
                ratio = height / orig_height
                new_width = int(orig_width * ratio)
                image = image.resize((new_width, height), Image.LANCZOS)
        else:
            # Resize without maintaining aspect ratio
            target_width = width if width else image.width
            target_height = height if height else image.height
            image = image.resize((target_width, target_height), Image.LANCZOS)
    
    # Save as JPG
    image.save(output_path, format="JPEG", quality=quality)
    
    # Get converted file size
    converted_size = output_path.stat().st_size
    
    # Calculate conversion time
    conversion_time = time.time() - start_time
    
    return original_size, converted_size, conversion_time

def generate_unique_filename(extension: str = ".jpg") -> str:
    """Generate a unique filename with the given extension"""
    return f"{uuid.uuid4()}{extension}"

def clean_temp_files(retention_minutes: int = 30) -> int:
    """
    Clean up temporary files older than the specified retention period
    
    Args:
        retention_minutes: File retention period in minutes
        
    Returns:
        Number of files deleted
    """
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
                except Exception:
                    pass
    
    return deleted_count
