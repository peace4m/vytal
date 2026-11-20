"""
Test Suite for Module 01: Report Explainer
Validates PyMuPDF text extraction, unit and reference range preservation,
manual data entry, and multilingual biomarker explanations (EN, HI, OR).
"""

import io
import pytest
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

pytestmark = pytest.mark.asyncio


def create_synthetic_lab_pdf_bytes() -> bytes:
    """Generates an in-memory synthetic lab report PDF for automated testing."""
    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    p.setFont("Helvetica-Bold", 14)
    p.drawString(100, 750, "Apollo Diagnostics Pathology Report")
    p.setFont("Helvetica", 10)
    p.drawString(100, 735, "Date: 15-Oct-2026")
    p.drawString(100, 720, "Patient ID: SYNTH-10294 (De-identified)")

    p.setFont("Helvetica-Bold", 11)
    p.drawString(100, 680, "Test Name                  Result    Units    Reference Range")
    p.line(100, 675, 500, 675)

    p.setFont("Helvetica", 10)
    p.drawString(100, 655, "Fasting Blood Sugar        126       mg/dL    70 - 100 mg/dL")
    p.drawString(100, 635, "HbA1c                     6.8       %        < 5.7 %")
    p.drawString(100, 615, "Serum Creatinine           1.1       mg/dL    0.6 - 1.2 mg/dL")
    p.drawString(100, 595, "Total Cholesterol          220       mg/dL    < 200 mg/dL")

    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer.getvalue()


async def test_pdf_upload_and_extraction(async_client):
    pdf_bytes = create_synthetic_lab_pdf_bytes()
    files = {"file": ("report.pdf", pdf_bytes, "application/pdf")}

    response = await async_client.post("/api/v1/reports/upload", files=files)
    assert response.status_code == 200
    data = response.json()

    assert data["report_id"] is not None
    assert "Apollo Diagnostics" in data["laboratory_name"]
    items = data["extracted_items"]
    assert len(items) >= 3

    # Check Fasting Blood Sugar extracted accurately
    fbs = next((item for item in items if "Fasting Blood Sugar" in item["analyte_name"]), None)
    assert fbs is not None
    assert fbs["observed_value"] == 126.0
    assert fbs["unit"] == "mg/dL"
    assert fbs["status_flag"] == "HIGH"
    assert "70" in fbs["lab_reference_range"]

    # Check HbA1c extracted accurately
    hba1c = next((item for item in items if "HbA1c" in item["analyte_name"]), None)
    assert hba1c is not None
    assert hba1c["observed_value"] == 6.8
    assert hba1c["status_flag"] == "HIGH"


async def test_manual_entry_intake(async_client):
    payload = [
        {
            "analyte_name": "Hemoglobin (Hb)",
            "observed_value": 14.2,
            "unit": "g/dL",
            "lab_reference_range": "13.0 - 17.0 g/dL",
            "status_flag": "NORMAL",
        }
    ]
    response = await async_client.post("/api/v1/reports/parse-manual", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["extracted_items"]) == 1
    assert data["extracted_items"][0]["analyte_name"] == "Hemoglobin (Hb)"
    assert data["extracted_items"][0]["observed_value"] == 14.2


async def test_multilingual_confirmation_explanations(async_client):
    report_id = "test-report-uuid"
    confirmed_items = [
        {
            "analyte_name": "Fasting Blood Sugar (Glucose)",
            "observed_value": 126.0,
            "unit": "mg/dL",
            "lab_reference_range": "70 - 100 mg/dL",
            "status_flag": "HIGH",
        }
    ]

    # Test English
    res_en = await async_client.post(
        "/api/v1/reports/confirm?lang=en",
        json={"report_id": report_id, "confirmed_items": confirmed_items},
    )
    assert res_en.status_code == 200
    data_en = res_en.json()
    assert "fasting blood glucose is elevated" in data_en["explanations"][0]["explanation"].lower()

    # Test Hindi
    res_hi = await async_client.post(
        "/api/v1/reports/confirm?lang=hi",
        json={"report_id": report_id, "confirmed_items": confirmed_items},
    )
    assert res_hi.status_code == 200
    data_hi = res_hi.json()
    assert "खाली पेट रक्त शर्करा" in data_hi["explanations"][0]["explanation"]

    # Test Odia
    res_or = await async_client.post(
        "/api/v1/reports/confirm?lang=or",
        json={"report_id": report_id, "confirmed_items": confirmed_items},
    )
    assert res_or.status_code == 200
    data_or = res_or.json()
    assert "ଖାଲି ପେଟ ରକ୍ତ ଶର୍କରା" in data_or["explanations"][0]["explanation"]


async def test_reject_non_pdf_file(async_client):
    files = {"file": ("notes.txt", b"Non-PDF text content", "text/plain")}
    response = await async_client.post("/api/v1/reports/upload", files=files)
    assert response.status_code == 400
    assert "Only PDF documents are supported" in response.json()["detail"]
