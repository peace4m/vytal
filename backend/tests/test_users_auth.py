"""
User Authentication and Profile Synchronization Unit Tests
"""

import pytest
import jwt
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.core.config import settings
from backend.app.database.session import init_db


@pytest.fixture(autouse=True)
async def setup_test_db():
    await init_db()


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
async def test_get_profile_unauthorized():
    """Unauthenticated request must be rejected with 401."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get("/api/v1/users/me")
        assert response.status_code == 401
        assert "Authentication credentials were not provided" in response.json()["detail"]


@pytest.mark.asyncio
async def test_get_profile_authenticated():
    """Valid JWT automatically provisions local user and returns profile."""
    import uuid
    uid = f"user-{uuid.uuid4().hex[:6]}"
    token = generate_test_token(uid, f"{uid}@example.com")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        response = await ac.get(
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
async def test_update_user_language_preferences():
    """Updating preferred language synchronizes across platforms."""
    import uuid
    uid = f"user-lang-{uuid.uuid4().hex[:6]}"
    token = generate_test_token(uid, f"{uid}@example.com")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # First query to create
        await ac.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})

        # Update language to Hindi ('hi')
        patch_res = await ac.patch(
            "/api/v1/users/me/preferences",
            headers={"Authorization": f"Bearer {token}"},
            json={"preferred_language": "hi"}
        )
        assert patch_res.status_code == 200
        assert patch_res.json()["preferred_language"] == "hi"

        # Verify persistence on subsequent fetch
        get_res = await ac.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
        assert get_res.json()["preferred_language"] == "hi"


@pytest.mark.asyncio
async def test_delete_user_account():
    """Account deletion deactivates user and prohibits subsequent access."""
    import uuid
    unique_uid = f"user-del-{uuid.uuid4().hex[:6]}"
    token = generate_test_token(unique_uid, f"{unique_uid}@example.com")
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Delete account
        del_res = await ac.delete(
            "/api/v1/users/me/account",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert del_res.status_code == 200

        # Subsequent profile request returns 403 Forbidden
        post_del = await ac.get(
            "/api/v1/users/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert post_del.status_code == 403
