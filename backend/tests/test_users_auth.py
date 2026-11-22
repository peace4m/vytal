"""
User Authentication and Profile Synchronization Unit Tests
"""

import uuid
import pytest
import jwt
from backend.app.core.config import settings


def generate_test_token(user_id: str = "test-supabase-user-123", email: str = "patient@vytal.health") -> str:
    """Generates a test JWT mimicking Supabase Auth payload."""
    payload = {
        "sub": user_id,
        "email": email,
        "aud": settings.SUPABASE_AUDIENCE,
        "user_metadata": {
            "preferred_language": "en"
        }
    }
    return jwt.encode(payload, settings.APP_SECRET_KEY, algorithm="HS256")


@pytest.mark.asyncio
async def test_get_profile_unauthorized(async_client):
    """Unauthenticated request must be rejected with 401."""
    response = await async_client.get("/api/v1/users/me")
    assert response.status_code == 401
    assert "Authentication credentials were not provided" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_profile_authenticated(async_client):
    """Valid JWT automatically provisions local user and returns profile."""
    uid = f"user-{uuid.uuid4().hex[:6]}"
    token = generate_test_token(uid, f"{uid}@example.com")
    response = await async_client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == uid
    assert data["email"] == f"{uid}@example.com"
    assert data["preferred_language"] == "en"
    assert data["is_active"] is True


@pytest.mark.asyncio
async def test_update_user_language_preferences(async_client):
    """Updating preferred language synchronizes across platforms."""
    uid = f"user-lang-{uuid.uuid4().hex[:6]}"
    token = generate_test_token(uid, f"{uid}@example.com")
    # First query to create
    await async_client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})

    # Update language to Hindi ('hi')
    patch_res = await async_client.patch(
        "/api/v1/users/me/preferences",
        headers={"Authorization": f"Bearer {token}"},
        json={"preferred_language": "hi"}
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["preferred_language"] == "hi"

    # Verify persistence on subsequent fetch
    get_res = await async_client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
    assert get_res.json()["preferred_language"] == "hi"


@pytest.mark.asyncio
async def test_delete_user_account(async_client):
    """Account deletion deactivates user and prohibits subsequent access."""
    unique_uid = f"user-del-{uuid.uuid4().hex[:6]}"
    token = generate_test_token(unique_uid, f"{unique_uid}@example.com")
    # Delete account
    del_res = await async_client.delete(
        "/api/v1/users/me/account",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert del_res.status_code == 200

    # Subsequent profile request returns 403 Forbidden
    post_del = await async_client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert post_del.status_code == 403
