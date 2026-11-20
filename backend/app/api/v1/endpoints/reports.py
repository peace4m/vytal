"""
Report Explainer API Endpoints (Module 01 Foundation)
"""

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database.session import get_db
from backend.app.schemas.reports import (
    ReportUploadResponse,
    ReportConfirmRequest,
    ReportConfirmResponse,
    LabExplanationItem,
)

router = APIRouter()


@router.post("/reports/confirm", response_model=ReportConfirmResponse, tags=["Module 01: Report Explainer"])
async def confirm_report_observations(
    request: ReportConfirmRequest,
    db: AsyncSession = Depends(get_db),
    x_session_token: str = Header(None, alias="X-Session-Token"),
) -> ReportConfirmResponse:
    """Confirms user-verified laboratory observations and generates plain-language explanations."""
    explanations = []
    for item in request.confirmed_items:
        val_str = item.observed_value_str or (f"{item.observed_value} {item.unit}" if item.observed_value else "Recorded")
        explanations.append(
            LabExplanationItem(
                analyte_name=item.analyte_name,
                observed_value_str=val_str,
                status=item.status_flag,
                explanation=f"Recorded value for {item.analyte_name} is marked as {item.status_flag}.",
                safety_note="Laboratory reference ranges can vary by assay and facility. Discuss results with your physician.",
            )
        )

    return ReportConfirmResponse(
        report_id=request.report_id,
        is_user_confirmed=True,
        explanations=explanations,
    )
