"""
VYTAL User Schemas
Pydantic models for user profile and preference synchronization.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str = Field(..., description="Unique user identifier from Supabase Auth")
    email: str = Field(..., description="User email address")
    preferred_language: str = Field(default="en", description="Persisted language preference")
    is_active: bool = Field(default=True, description="Account active status")
    created_at: Optional[datetime] = None


class UserPreferencesUpdateRequest(BaseModel):
    preferred_language: str = Field(
        ...,
        description="Updated language preference code (e.g. en, hi, or)",
        min_length=2,
        max_length=10,
    )


class UserAccountDeleteResponse(BaseModel):
    status: str = "success"
    message: str = "User account has been deleted in accordance with data privacy guidelines."
