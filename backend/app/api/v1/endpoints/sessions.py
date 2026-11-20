"""
Session Management Endpoints
"""

import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database.session import get_db
from backend.app.database.models.session import SessionModel
from backend.app.schemas.session import (
    SessionCreateRequest,
    SessionResponse,
    SessionPurgeResponse,
)

router = APIRouter()


@router.post("/sessions/new", response_model=SessionResponse, status_code=status.HTTP_201_CREATED, tags=["Sessions"])
async def create_session(
    request: SessionCreateRequest,
    db: AsyncSession = Depends(get_db),
) -> SessionResponse:
    """Generates an anonymous, privacy-preserving cryptographic session token."""
    token = str(uuid.uuid4())
    session_obj = SessionModel(
        session_token=token,
        preferred_language=request.preferred_language,
    )
    db.add(session_obj)
    await db.flush()
    await db.refresh(session_obj)

    return SessionResponse(
        session_token=session_obj.session_token,
        created_at=session_obj.created_at,
        expires_at=session_obj.expires_at,
        preferred_language=session_obj.preferred_language,
        is_active=session_obj.is_active,
    )


@router.get("/sessions/{token}", response_model=SessionResponse, tags=["Sessions"])
async def get_session(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> SessionResponse:
    """Retrieves session status and verifies validity."""
    stmt = select(SessionModel).where(SessionModel.session_token == token, SessionModel.is_active == True)
    result = await db.execute(stmt)
    session_obj = result.scalar_one_or_none()

    if not session_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found or has expired.",
        )

    # Check expiration (safely handle naive and aware datetimes across SQLite and PostgreSQL)
    expires_at = session_obj.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if expires_at < datetime.now(timezone.utc):
        session_obj.is_active = False
        await db.flush()
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail="Session has expired. Please initiate a new session.",
        )

    return SessionResponse(
        session_token=session_obj.session_token,
        created_at=session_obj.created_at,
        expires_at=session_obj.expires_at,
        preferred_language=session_obj.preferred_language,
        is_active=session_obj.is_active,
    )


@router.delete("/sessions/{token}", response_model=SessionPurgeResponse, tags=["Sessions"])
async def purge_session_data(
    token: str,
    db: AsyncSession = Depends(get_db),
) -> SessionPurgeResponse:
    """Immediate privacy purge: permanently wipes all observations, scores, and records for this session."""
    stmt = delete(SessionModel).where(SessionModel.session_token == token)
    result = await db.execute(stmt)

    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found.",
        )

    return SessionPurgeResponse(
        status="purged",
        message="All session data and confirmed observations have been permanently deleted.",
    )
