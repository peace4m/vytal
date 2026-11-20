"""
Health Summary Endpoints (Module 05)
Synthesizes findings across Modules 01-04 and generates downloadable clinical PDF briefs.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Header, Query, Response, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database.session import get_db
from backend.app.database.models.session import SessionModel
from backend.app.database.models.summary import HealthSummaryModel
from backend.app.schemas.summary import HealthSummaryGenerateResponse
from backend.app.services.health_summary.engine import HealthSummaryEngine
from backend.app.services.health_summary.pdf_generator import generate_health_summary_pdf

router = APIRouter()


@router.post("/summary/generate", response_model=HealthSummaryGenerateResponse, tags=["Module 05: Health Summary"])
async def generate_health_summary(
    lang: str = Query("en", description="Language: en, hi, or"),
    db: AsyncSession = Depends(get_db),
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token"),
) -> HealthSummaryGenerateResponse:
    """
    Consolidates verified findings across Modules 01 through 04 into a prioritized summary brief.
    Identifies cross-module correlations with explicit non-diagnostic boundary notices.
    """
    session_data = {}
    if x_session_token:
        try:
            session = await db.get(SessionModel, x_session_token)
            if session:
                session_data = await HealthSummaryEngine.aggregate_session_data(db, x_session_token)
        except Exception:
            pass

    response = HealthSummaryEngine.synthesize(raw_data=session_data, lang=lang)

    # Persist summary record if session is active
    if x_session_token:
        try:
            summary_record = HealthSummaryModel(
                id=response.summary_id,
                session_id=x_session_token,
                highest_acuity=response.highest_acuity,
                consolidated_findings={
                    "module_01": response.module_01_report.model_dump(),
                    "module_02": response.module_02_idrs.model_dump(),
                    "module_03": response.module_03_triage.model_dump(),
                    "module_04": response.module_04_medications.model_dump(),
                },
                summary_text_en=response.mandatory_safety_disclaimer,
                summary_text_hi=response.mandatory_safety_disclaimer,
                summary_text_or=response.mandatory_safety_disclaimer,
                pdf_download_count=0,
            )
            db.add(summary_record)
            await db.commit()
        except Exception:
            pass

    return response


@router.get("/summary/export-pdf", tags=["Module 05: Health Summary"])
async def export_health_summary_pdf(
    lang: str = Query("en", description="Language: en, hi, or"),
    db: AsyncSession = Depends(get_db),
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token"),
) -> Response:
    """Generates and streams a downloadable, high-fidelity clinical PDF brief."""
    session_data = {}
    if x_session_token:
        try:
            session = await db.get(SessionModel, x_session_token)
            if session:
                session_data = await HealthSummaryEngine.aggregate_session_data(db, x_session_token)
        except Exception:
            pass

    summary_response = HealthSummaryEngine.synthesize(raw_data=session_data, lang=lang)
    pdf_bytes = generate_health_summary_pdf(
        summary_data=summary_response,
        session_id=x_session_token or "GUEST-SESSION",
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=VYTAL_Health_Summary_{summary_response.summary_id[:8]}.pdf",
            "Content-Type": "application/pdf",
        },
    )
