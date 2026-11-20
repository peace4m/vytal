"""
Exhaustive Multi-Module Health Summary Tests (Module 05)
Tests cross-module data aggregation, non-diagnostic synthesis,
and ReportLab PDF brief generation.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.services.health_summary.engine import HealthSummaryEngine
from backend.app.services.health_summary.pdf_generator import generate_health_summary_pdf


@pytest.fixture
def anyio_backend():
    return "asyncio"


def test_health_summary_baseline_synthesis():
    summary = HealthSummaryEngine.synthesize(raw_data={}, lang="en")
    assert summary.highest_acuity == "ROUTINE"
    assert summary.module_01_report.has_data is False
    assert summary.module_02_idrs.has_data is False
    assert summary.module_03_triage.has_data is False
    assert summary.module_04_medications.has_data is False
    assert len(summary.cross_module_insights) >= 1
    assert "VYTAL is an educational" in summary.mandatory_safety_disclaimer


def test_cross_module_correlation_glucose_and_idrs():
    raw_data = {
        "observations": [
            {
                "analyte_name": "Fasting Blood Glucose",
                "observed_value_str": "142",
                "unit": "mg/dL",
                "printed_reference_range": "70 - 99",
                "status": "HIGH",
            }
        ],
        "idrs": {
            "total_score": 70,
            "risk_category": "high",
            "score_breakdown": {"age_points": 30, "waist_points": 20},
        },
    }
    summary = HealthSummaryEngine.synthesize(raw_data=raw_data, lang="en")
    assert summary.highest_acuity == "MODERATE"
    assert summary.module_01_report.has_data is True
    assert summary.module_02_idrs.has_data is True
    # Verify correlated metabolic insight was generated
    assert any("Elevated Glucose Observation with High IDRS Profile" in item.title for item in summary.cross_module_insights)
    assert any("ICMR Guidelines" in (item.evidence_source or "") for item in summary.cross_module_insights)


def test_cross_module_emergency_override():
    raw_data = {
        "triage": {
            "primary_acuity": "EMERGENCY",
            "emergency_override_triggered": True,
            "recommended_action": "CALL 108 IMMEDIATELY",
            "safety_netting_advice": "Rest quietly.",
        }
    }
    summary = HealthSummaryEngine.synthesize(raw_data=raw_data, lang="en")
    assert summary.highest_acuity == "EMERGENCY"
    assert any("Emergency Red-Flag Protocol Activated" in item.title for item in summary.cross_module_insights)


def test_pdf_brief_generation_valid_stream():
    summary = HealthSummaryEngine.synthesize(
        raw_data={
            "observations": [
                {
                    "analyte_name": "HbA1c",
                    "observed_value_str": "7.8",
                    "unit": "%",
                    "printed_reference_range": "< 5.7",
                    "status": "HIGH",
                }
            ],
            "idrs": {
                "total_score": 60,
                "risk_category": "high",
            },
        },
        lang="en",
    )
    pdf_bytes = generate_health_summary_pdf(summary, session_id="test-session-12345")
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 1000
    # PDF specification magic bytes
    assert pdf_bytes.startswith(b"%PDF-")


@pytest.mark.anyio
async def test_summary_api_endpoints():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # POST /summary/generate
        gen_res = await client.post("/api/v1/summary/generate?lang=en")
        assert gen_res.status_code == 200
        data = gen_res.json()
        assert "summary_id" in data
        assert "highest_acuity" in data
        assert "cross_module_insights" in data
        assert "/api/v1/summary/export-pdf" in data["pdf_export_url"]

        # GET /summary/export-pdf
        pdf_res = await client.get("/api/v1/summary/export-pdf?lang=en")
        assert pdf_res.status_code == 200
        assert pdf_res.headers["content-type"] == "application/pdf"
        assert pdf_res.content.startswith(b"%PDF-")
