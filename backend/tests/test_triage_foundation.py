"""
Test Symptom Triage Emergency Red-Flag Short-Circuiting
"""

import pytest

pytestmark = pytest.mark.asyncio


async def test_chest_pain_emergency_red_flag_triggers(async_client):
    payload = {
        "primary_symptoms": ["chest_pain", "shortness_of_breath"],
        "symptom_attributes": {
            "chest_pain_nature": "crushing_pressure",
            "radiates_to_jaw_or_left_arm": True,
        },
    }
    res = await async_client.post("/api/v1/triage/evaluate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["primary_acuity"] == "EMERGENCY"
    assert data["emergency_override_triggered"] is True
    assert "EMERGENCY" in data["action_required"]
    assert any(rule["rule_id"] == "RULE-EMERG-ACS-001" for rule in data["triggered_rules"])


async def test_stroke_be_fast_emergency_red_flag(async_client):
    payload = {
        "primary_symptoms": ["facial_droop", "speech_difficulty"],
        "symptom_attributes": {},
    }
    res = await async_client.post("/api/v1/triage/evaluate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["primary_acuity"] == "EMERGENCY"
    assert data["emergency_override_triggered"] is True
    assert any(rule["rule_id"] == "RULE-EMERG-STRK-002" for rule in data["triggered_rules"])


async def test_routine_symptom_no_emergency(async_client):
    payload = {
        "primary_symptoms": ["mild_fatigue"],
        "symptom_attributes": {},
    }
    res = await async_client.post("/api/v1/triage/evaluate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["primary_acuity"] == "ROUTINE_CLINICAL"
    assert data["emergency_override_triggered"] is False
    assert any(rule["rule_id"] == "RULE-ROUT-METAB-008" for rule in data["triggered_rules"])
