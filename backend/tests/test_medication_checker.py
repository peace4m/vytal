"""
Exhaustive Medication Checker Tests (Module 04)
Tests brand/generic normalization (Indian & US), severe interaction detection,
negative finding disclaimers, and multilingual explanations.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.schemas.medications import (
    MedicationCheckItemInput,
    MedicationCheckRequest,
)
from backend.app.services.medication_checker.catalog import (
    normalize_medication_query,
    resolve_to_canonical_ingredient,
)
from backend.app.services.medication_checker.interactions import (
    MedicationInteractionEvaluator,
    MANDATORY_NEGATIVE_FINDING_DISCLAIMER,
)


@pytest.fixture
def anyio_backend():
    return "asyncio"


def test_brand_to_generic_normalization():
    # Indian brand: Glycomet -> Metformin
    res = normalize_medication_query("glycomet")
    assert len(res) >= 1
    assert res[0]["name"] == "Metformin"
    assert res[0]["rxcui"] == "6809"

    # Indian brand: Ecosprin -> Aspirin
    res_asp = normalize_medication_query("ecosprin")
    assert any(m["name"] == "Aspirin" for m in res_asp)

    # Indian brand: Pan-40 -> Pantoprazole
    res_pan = normalize_medication_query("pan-40")
    assert any(m["name"] == "Pantoprazole" for m in res_pan)

    # Canonical resolver
    med = resolve_to_canonical_ingredient("Zoryl")
    assert med is not None
    assert med.name == "Glimepiride"


def test_severe_contraindicated_metformin_contrast():
    items = [
        MedicationCheckItemInput(name="Metformin"),
        MedicationCheckItemInput(name="Iodinated Radiocontrast"),
    ]
    res = MedicationInteractionEvaluator.evaluate(items, lang="en")
    assert res.interaction_count >= 1
    assert res.has_severe_warning is True
    int_item = res.interactions[0]
    assert int_item.severity == "CONTRAINDICATED"
    assert "lactic acidosis" in int_item.clinical_description.lower()
    assert "ACR" in int_item.evidence_source
    assert "Contrast Manual" in int_item.evidence_source


def test_severe_bleeding_aspirin_warfarin():
    items = [
        MedicationCheckItemInput(name="Ecosprin"),  # Brand input
        MedicationCheckItemInput(name="Warfarin"),
    ]
    res = MedicationInteractionEvaluator.evaluate(items, lang="en")
    assert res.interaction_count >= 1
    assert res.has_severe_warning is True
    assert any(i.severity == "SEVERE" for i in res.interactions)


def test_clopidogrel_omeprazole_interaction():
    items = [
        MedicationCheckItemInput(name="Clopidogrel"),
        MedicationCheckItemInput(name="Omeprazole"),
    ]
    res = MedicationInteractionEvaluator.evaluate(items, lang="en")
    assert res.interaction_count == 1
    assert res.interactions[0].severity == "SEVERE"
    assert "pantoprazole" in res.interactions[0].management_guidance.lower()


def test_hyperkalemia_ramipril_spironolactone():
    items = [
        MedicationCheckItemInput(name="Ramipril"),
        MedicationCheckItemInput(name="Spironolactone"),
    ]
    res = MedicationInteractionEvaluator.evaluate(items, lang="en")
    assert res.interaction_count == 1
    assert res.interactions[0].severity == "SEVERE"
    assert "hyperkalemia" in res.interactions[0].clinical_description.lower()


def test_serotonin_syndrome_tramadol_escitalopram():
    items = [
        MedicationCheckItemInput(name="Tramadol"),
        MedicationCheckItemInput(name="Escitalopram"),
    ]
    res = MedicationInteractionEvaluator.evaluate(items, lang="en")
    assert res.interaction_count == 1
    assert res.interactions[0].severity == "SEVERE"
    assert "serotonin syndrome" in res.interactions[0].clinical_description.lower()


def test_mandatory_negative_finding_disclaimer_for_benign_combination():
    # Paracetamol + Metformin: no critical pairwise interaction in dataset
    items = [
        MedicationCheckItemInput(name="Metformin"),
        MedicationCheckItemInput(name="Paracetamol"),
    ]
    res = MedicationInteractionEvaluator.evaluate(items, lang="en")
    assert res.interaction_count == 0
    assert res.has_severe_warning is False
    # Check mandatory disclaimer presence
    assert "No interaction was found in the available dataset" in res.mandatory_disclaimer
    assert "does NOT establish that the combination is safe" in res.mandatory_disclaimer


def test_multilingual_medication_descriptions():
    items = [
        MedicationCheckItemInput(name="Metformin"),
        MedicationCheckItemInput(name="Iodinated Radiocontrast"),
    ]
    # Hindi
    res_hi = MedicationInteractionEvaluator.evaluate(items, lang="hi")
    assert "लैक्टिक एसिडोसिस" in res_hi.interactions[0].clinical_description
    assert "उपलब्ध डेटाबेस" in res_hi.mandatory_disclaimer

    # Odia
    res_or = MedicationInteractionEvaluator.evaluate(items, lang="or")
    assert "ଲାକ୍ଟିକ୍ ଏସିଡୋସିସ୍" in res_or.interactions[0].clinical_description
    assert "ଉପଲବ୍ଧ ତଥ୍ୟାବଳୀରେ" in res_or.mandatory_disclaimer


@pytest.mark.anyio
async def test_medication_api_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Search
        s_res = await client.get("/api/v1/medications/search?q=telma")
        assert s_res.status_code == 200
        assert any(m["name"] == "Telmisartan" for m in s_res.json()["results"])

        # Catalog
        cat_res = await client.get("/api/v1/medications/catalog")
        assert cat_res.status_code == 200
        assert cat_res.json()["total_catalog_size"] >= 30

        # Check API
        check_res = await client.post(
            "/api/v1/medications/check?lang=en",
            json={
                "medications": [
                    {"name": "Glimepiride"},
                    {"name": "Aspirin"},
                ]
            },
        )
        assert check_res.status_code == 200
        data = check_res.json()
        assert data["interaction_count"] >= 1
        assert "Aspirin can potentiate" in data["interactions"][0]["clinical_description"]
