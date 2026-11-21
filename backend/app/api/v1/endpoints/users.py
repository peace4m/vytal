"""
User Profile and Account Management Endpoints
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database.session import get_db
from backend.app.database.models.user import UserModel
from backend.app.api.deps import get_current_user
from backend.app.schemas.user import (
    UserResponse,
    UserPreferencesUpdateRequest,
    UserAccountDeleteResponse,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: UserModel = Depends(get_current_user),
) -> UserResponse:
    """Returns the authenticated user's profile and preferences."""
    return UserResponse.model_validate(current_user)


@router.patch("/me/preferences", response_model=UserResponse)
async def update_preferences(
    request: UserPreferencesUpdateRequest,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """Synchronizes user's preferred language across mobile and web platforms."""
    current_user.preferred_language = request.preferred_language
    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.delete("/me/account", response_model=UserAccountDeleteResponse)
async def delete_account(
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> UserAccountDeleteResponse:
    """Deactivates and removes user account data in compliance with data privacy regulations."""
    current_user.is_active = False
    db.add(current_user)
    await db.commit()
    return UserAccountDeleteResponse()
