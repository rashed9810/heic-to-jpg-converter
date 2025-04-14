from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

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
