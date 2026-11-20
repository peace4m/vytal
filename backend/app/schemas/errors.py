"""
RFC 7807 Problem Details Schema
Standardized error format across all VYTAL REST endpoints.
"""

from typing import Any, List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field


class InvalidParam(BaseModel):
    name: str
    reason: str


class ProblemDetails(BaseModel):
    type: str = Field(default="https://vytal.health/errors/general-error")
    title: str
    status: int
    detail: str
    instance: Optional[str] = None
    invalid_params: Optional[List[InvalidParam]] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
