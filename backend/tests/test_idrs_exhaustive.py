"""
Exhaustive Boundary Test Suite for Module 02: IDRS
Validates all score partitions, risk thresholds, and metadata from Mohan et al. (JAPI 2005).
"""

import pytest

pytestmark = pytest.mark.asyncio


@pytest.mark.parametrize(
    "age,expected_points",
    [
        (18, 0),
        (34, 0),
        (35, 20),
        (42, 20),
        (49, 20),
        (50, 30),
        (65, 30),
    ],
)
async def test_idrs_age_boundaries(async_client, age, expected_points):
    payload = {
        "age": age,
        "gender": "male",
        "waist_circumference_cm": 85.0,
        "physical_activity_tier": "vigorous",
        "family_history_tier": "none",
    }
    res = await async_client.post("/api/v1/idrs/calculate", json=payload)
    assert res.status_code == 200
    assert res.json()["breakdown"]["age_points"] == expected_points


@pytest.mark.parametrize(
    "gender,waist,expected_points",
    [
        # Female cutoffs: <80 (0), 80-89 (10), >=90 (20)
        ("female", 78.0, 0),
        ("female", 80.0, 10),
        ("female", 85.0, 10),
        ("female", 89.0, 10),
        ("female", 90.0, 20),
        ("female", 105.0, 20),
        # Male cutoffs: <90 (0), 90-99 (10), >=100 (20)
        ("male", 88.0, 0),
        ("male", 90.0, 10),
        ("male", 95.0, 10),
        ("male", 99.0, 10),
        ("male", 100.0, 20),
        ("male", 112.0, 20),
    ],
)
async def test_idrs_waist_boundaries(async_client, gender, waist, expected_points):
    payload = {
        "age": 25,
        "gender": gender,
        "waist_circumference_cm": waist,
        "physical_activity_tier": "vigorous",
        "family_history_tier": "none",
    }
    res = await async_client.post("/api/v1/idrs/calculate", json=payload)
    assert res.status_code == 200
    assert res.json()["breakdown"]["waist_points"] == expected_points


@pytest.mark.parametrize(
    "activity,expected_points",
    [
        ("vigorous", 0),
        ("moderate", 20),
        ("sedentary", 30),
    ],
)
async def test_idrs_physical_activity_tiers(async_client, activity, expected_points):
    payload = {
        "age": 25,
        "gender": "male",
        "waist_circumference_cm": 80.0,
        "physical_activity_tier": activity,
        "family_history_tier": "none",
    }
    res = await async_client.post("/api/v1/idrs/calculate", json=payload)
    assert res.status_code == 200
    assert res.json()["breakdown"]["activity_points"] == expected_points


@pytest.mark.parametrize(
    "family_history,expected_points",
    [
        ("none", 0),
        ("one_parent", 10),
        ("both_parents", 20),
    ],
)
async def test_idrs_family_history_tiers(async_client, family_history, expected_points):
    payload = {
        "age": 25,
        "gender": "male",
        "waist_circumference_cm": 80.0,
        "physical_activity_tier": "vigorous",
        "family_history_tier": family_history,
    }
    res = await async_client.post("/api/v1/idrs/calculate", json=payload)
    assert res.status_code == 200
    assert res.json()["breakdown"]["family_history_points"] == expected_points


async def test_idrs_multilingual_recommendations(async_client):
    payload = {
        "age": 55,
        "gender": "female",
        "waist_circumference_cm": 95.0,
        "physical_activity_tier": "sedentary",
        "family_history_tier": "both_parents",
    }
    # Hindi
    res_hi = await async_client.post("/api/v1/idrs/calculate?lang=hi", json=payload)
    assert res_hi.status_code == 200
    assert "उच्च जोखिम" in res_hi.json()["clinical_context"]["risk_label"]

    # Odia
    res_or = await async_client.post("/api/v1/idrs/calculate?lang=or", json=payload)
    assert res_or.status_code == 200
    assert "ଉଚ୍ଚ ବିପଦ" in res_or.json()["clinical_context"]["risk_label"]


async def test_idrs_metadata_endpoint(async_client):
    res = await async_client.get("/api/v1/idrs/metadata")
    assert res.status_code == 200
    data = res.json()
    assert data["pmid"] == "16334622"
    assert "V. Mohan" in data["authors"]
    assert data["optimal_cutoff"] == ">= 60"
    assert len(data["parameters"]) == 4
