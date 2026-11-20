"""
Exhaustive Clinical Triage Rule Engine Tests (Module 03)
Verifies deterministic red-flag priority, non-downgrade invariants, and multilingual outputs.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.schemas.triage import TriageEvaluateRequest
from backend.app.services.symptom_triage.engine import TriageEngine


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.mark.anyio
async def test_triage_questions_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/triage/questions?lang=en")
        assert response.status_code == 200
        data = response.json()
        assert "primary_symptoms" in data
        assert len(data["primary_symptoms"]) >= 6
        assert "adaptive_follow_ups" in data
        assert "chest_pain" in data["adaptive_follow_ups"]


@pytest.mark.anyio
async def test_triage_rules_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/triage/rules")
        assert response.status_code == 200
        data = response.json()
        assert data["total_rules"] >= 8
        rule_ids = [r["rule_id"] for r in data["rules"]]
        assert "RULE-EMERG-ACS-001" in rule_ids
        assert "RULE-EMERG-STRK-002" in rule_ids
        assert "RULE-EMERG-RESP-003" in rule_ids
        assert "RULE-URG-DKA-007" in rule_ids
        assert "RULE-ROUT-METAB-008" in rule_ids


@pytest.mark.anyio
async def test_acs_red_flag_trigger():
    req = TriageEvaluateRequest(
        primary_symptoms=["chest_pain"],
        symptom_attributes={
            "chest_pain_nature": "crushing_pressure",
            "radiates_to_jaw_or_left_arm": True,
            "associated_sweating_or_dyspnea": True,
        },
    )
    res = TriageEngine.evaluate(req, lang="en")
    assert res.primary_acuity == "EMERGENCY"
    assert res.emergency_override_triggered is True
    assert any(r.rule_id == "RULE-EMERG-ACS-001" for r in res.triggered_rules)
    assert "108 / 112" in res.action_required


@pytest.mark.anyio
async def test_stroke_red_flag_trigger():
    req = TriageEvaluateRequest(
        primary_symptoms=["facial_droop_or_weakness"],
        symptom_attributes={
            "unilateral_weakness": True,
            "speech_difficulty_or_slurring": True,
        },
    )
    res = TriageEngine.evaluate(req, lang="en")
    assert res.primary_acuity == "EMERGENCY"
    assert res.emergency_override_triggered is True
    assert any(r.rule_id == "RULE-EMERG-STRK-002" for r in res.triggered_rules)
    assert "STROKE" in res.action_required.upper() or "108" in res.action_required


@pytest.mark.anyio
async def test_severe_respiratory_red_flag_trigger():
    req = TriageEvaluateRequest(
        primary_symptoms=["severe_shortness_of_breath"],
        symptom_attributes={
            "inability_to_speak_full_sentences": True,
            "bluish_lips_or_cyanosis": True,
        },
    )
    res = TriageEngine.evaluate(req, lang="en")
    assert res.primary_acuity == "EMERGENCY"
    assert res.emergency_override_triggered is True
    assert any(r.rule_id == "RULE-EMERG-RESP-003" for r in res.triggered_rules)


@pytest.mark.anyio
async def test_anaphylaxis_red_flag_trigger():
    req = TriageEvaluateRequest(
        primary_symptoms=["acute_allergic_reaction"],
        symptom_attributes={
            "throat_tightness_or_swallowing_difficulty": True,
            "recent_allergen_or_medication_exposure": True,
        },
    )
    res = TriageEngine.evaluate(req, lang="en")
    assert res.primary_acuity == "EMERGENCY"
    assert res.emergency_override_triggered is True
    assert any(r.rule_id == "RULE-EMERG-ANAPH-004" for r in res.triggered_rules)


@pytest.mark.anyio
async def test_thunderclap_headache_trigger():
    req = TriageEvaluateRequest(
        primary_symptoms=["thunderclap_headache"],
        symptom_attributes={"thunderclap_onset": True},
    )
    res = TriageEngine.evaluate(req, lang="en")
    assert res.primary_acuity == "EMERGENCY"
    assert any(r.rule_id == "RULE-EMERG-NEURO-005" for r in res.triggered_rules)


@pytest.mark.anyio
async def test_sepsis_red_flag_trigger():
    req = TriageEvaluateRequest(
        primary_symptoms=["fever_with_rigors_or_confusion"],
        symptom_attributes={"has_fever_infection": True, "altered_confusion": True},
    )
    res = TriageEngine.evaluate(req, lang="en")
    assert res.primary_acuity == "EMERGENCY"
    assert any(r.rule_id == "RULE-EMERG-SEPS-006" for r in res.triggered_rules)


@pytest.mark.anyio
async def test_dka_high_acuity_trigger():
    req = TriageEvaluateRequest(
        primary_symptoms=["excessive_thirst_and_vomiting"],
        symptom_attributes={
            "known_diabetes_history": True,
            "persistent_vomiting_fluids": True,
            "fruity_breath_odor": True,
        },
    )
    res = TriageEngine.evaluate(req, lang="en")
    assert res.primary_acuity == "HIGH_ACUITY"
    assert res.emergency_override_triggered is False
    assert any(r.rule_id == "RULE-URG-DKA-007" for r in res.triggered_rules)


@pytest.mark.anyio
async def test_routine_primary_care_consultation():
    req = TriageEvaluateRequest(
        primary_symptoms=["mild_fatigue_or_gradual_symptoms"],
        symptom_attributes={},
    )
    res = TriageEngine.evaluate(req, lang="en")
    assert res.primary_acuity == "ROUTINE_CLINICAL"
    assert res.emergency_override_triggered is False
    assert any(r.rule_id == "RULE-ROUT-METAB-008" for r in res.triggered_rules)
    assert "MANDATORY SAFETY-NET" in res.safety_netting


@pytest.mark.anyio
async def test_safety_invariant_emergency_never_downgraded():
    """Ensures presence of mild chronic symptoms alongside emergency symptom NEVER downgrades acuity."""
    req = TriageEvaluateRequest(
        primary_symptoms=["mild_fatigue_or_gradual_symptoms", "chest_pain"],
        symptom_attributes={"chest_pain_nature": "crushing_pressure"},
    )
    res = TriageEngine.evaluate(req, lang="en")
    assert res.primary_acuity == "EMERGENCY"
    assert res.emergency_override_triggered is True
    assert any(r.rule_id == "RULE-EMERG-ACS-001" for r in res.triggered_rules)


@pytest.mark.anyio
async def test_multilingual_triage_outputs():
    req = TriageEvaluateRequest(
        primary_symptoms=["chest_pain"],
        symptom_attributes={"chest_pain_nature": "crushing_pressure"},
    )
    # Hindi
    res_hi = TriageEngine.evaluate(req, lang="hi")
    assert "आपातकालीन" in res_hi.action_required

    # Odia
    res_or = TriageEngine.evaluate(req, lang="or")
    assert "ଜରୁରୀକାଳୀନ" in res_or.action_required
