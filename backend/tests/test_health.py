"""
Test Health & Root Endpoints
"""

import pytest

pytestmark = pytest.mark.asyncio


async def test_root_endpoint(async_client):
    response = await async_client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "VYTAL"
    assert "Your Health, Decoded." in data["tagline"]
    assert data["status"] == "operational"


async def test_health_endpoint(async_client):
    response = await async_client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database_connected"] is True
    assert "version" in data
