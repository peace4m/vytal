"""
API Dependencies Module
Provides authentication, user context, and database session injection.
"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.database.session import get_db
from backend.app.database.models.user import UserModel

security = HTTPBearer(auto_error=False)


def decode_supabase_token(token: str) -> dict:
    """
    Decodes and validates a Supabase JWT token.
    Falls back to payload extraction if secret is not yet configured in local development.
    """
    secret = settings.SUPABASE_JWT_SECRET or settings.APP_SECRET_KEY
    try:
        if settings.SUPABASE_JWT_SECRET:
            # Full cryptographically verified token
            payload = jwt.decode(
                token,
                secret,
                algorithms=["HS256"],
                audience=settings.SUPABASE_AUDIENCE,
                options={"verify_aud": True},
            )
        else:
            # Development / Sandbox mode before Supabase secret is populated
            payload = jwt.decode(
                token,
                options={"verify_signature": False},
            )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired. Please log in again.",
        )
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid authentication token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
        )


async def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> UserModel:
    """
    Dependency that enforces an authenticated user session.
    Extracts Bearer token, validates against Supabase, and ensures local user existence.
    """
    if not auth or not auth.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_supabase_token(auth.credentials)
    user_id = payload.get("sub")
    email = payload.get("email") or f"{user_id}@vytal.user"

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token does not contain a valid user identity.",
        )

    # Lookup or provision local user record
    stmt = select(UserModel).where(UserModel.id == user_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        user = UserModel(
            id=user_id,
            email=email,
            preferred_language=payload.get("user_metadata", {}).get("preferred_language", "en"),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This user account has been deactivated.",
        )

    return user


async def get_optional_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> Optional[UserModel]:
    """
    Dependency that returns the authenticated user if Bearer token is provided,
    or None if operating in anonymous guest mode.
    """
    if not auth or not auth.credentials:
        return None

    try:
        return await get_current_user(auth, db)
    except HTTPException:
        return None
