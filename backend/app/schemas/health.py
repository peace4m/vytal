"""
Health Check & System Status Schemas
"""

from datetime import datetime
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(default="healthy", description="Operational status: healthy, degraded, or unhealthy")
    version: str = Field(description="VYTAL application version")
    environment: str = Field(description="Active runtime environment")
    database_connected: bool = Field(description="True if database connectivity is established")
    timestamp: datetime = Field(description="Current server UTC timestamp")
