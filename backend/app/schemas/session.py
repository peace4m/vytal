"""
Session Management Schemas
"""

from datetime import datetime
from pydantic import BaseModel, Field


class SessionCreateRequest(BaseModel):
    preferred_language: str = Field(default="en", pattern="^(en|hi|or)$")


class SessionResponse(BaseModel):
    session_token: str
    created_at: datetime
    expires_at: datetime
    preferred_language: str
    is_active: bool


class SessionPurgeResponse(BaseModel):
    status: str = "purged"
    message: str
