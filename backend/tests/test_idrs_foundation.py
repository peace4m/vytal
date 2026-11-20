"""
Test IDRS Calculation Foundation (Mohan et al. 2005)
"""

import pytest

pytestmark = pytest.mark.asyncio


async def test_idrs_low_risk_case(async_client):
    # Case: Young, normal waist, vigorous exercise, no family history
    payload = {
        "age": 28,
        "gender": "male",
        "waist_circumference_cm": 82.0,
        "physical_activity_tier": "vigorous",
        "family_history_tier": "none",
    }
    res = await async_client.post("/api/v1/idrs/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["total_score"] == 0
    assert data["risk_category"] == "low"
    assert data["breakdown"]["age_points"] == 0
    assert data["breakdown"]["waist_points"] == 0


async def test_idrs_high_risk_case(async_client):
    # Case: Age >= 50 (30), Waist >= 100cm (20), Sedentary (30), Both parents (20) -> Score 100
    payload = {
        "age": 55,
        "gender": "male",
        "waist_circumference_cm": 104.0,
        "physical_activity_tier": "sedentary",
        "family_history_tier": "both_parents",
    }
    res = await async_client.post("/api/v1/idrs/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["total_score"] == 100
    assert data["risk_category"] == "high"


async def test_idrs_cutoff_60_high_risk(async_client):
    # Case: Age 45 (20), Waist 95cm male (10), Moderate exercise (20), One parent (10) -> Score 60
    payload = {
        "age": 45,
        "gender": "male",
        "waist_circumference_cm": 95.0,
        "physical_activity_tier": "moderate",
        "family_history_tier": "one_parent",
    }
    res = await async_client.post("/api/v1/idrs/calculate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["total_score"] == 60
    assert data["risk_category"] == "high"
    assert "72.5%" in data["clinical_context"]["sensitivity"]
