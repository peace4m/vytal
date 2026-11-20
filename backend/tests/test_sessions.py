"""
Test Anonymous Session Management & Privacy Purge
"""

import pytest

pytestmark = pytest.mark.asyncio


async def test_session_lifecycle(async_client):
    # 1. Create a new anonymous session
    create_res = await async_client.post("/api/v1/sessions/new", json={"preferred_language": "en"})
    assert create_res.status_code == 201
    session_data = create_res.json()
    token = session_data["session_token"]
    assert token is not None
    assert session_data["is_active"] is True
    assert session_data["preferred_language"] == "en"

    # 2. Retrieve session status
    get_res = await async_client.get(f"/api/v1/sessions/{token}")
    assert get_res.status_code == 200
    assert get_res.json()["session_token"] == token

    # 3. Purge session data (Privacy deletion)
    delete_res = await async_client.delete(f"/api/v1/sessions/{token}")
    assert delete_res.status_code == 200
    assert delete_res.json()["status"] == "purged"

    # 4. Confirm session no longer exists
    recheck_res = await async_client.get(f"/api/v1/sessions/{token}")
    assert recheck_res.status_code == 404
