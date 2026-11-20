"""
Report Explainer API Endpoints (Module 01)
Provides PDF text extraction, manual test intake, mandatory user verification,
and multilingual biomarker explanations in English, Hindi, and Odia.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Header, UploadFile, File, HTTPException, status, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database.session import get_db
from backend.app.database.models.report import LabReportModel, LabObservationModel
from backend.app.schemas.reports import (
    ReportUploadResponse,
    ReportConfirmRequest,
    ReportConfirmResponse,
    ConfirmedLabItem,
)
from backend.app.services.report_explainer.service import ReportExplainerService

router = APIRouter()


@router.post("/reports/upload", response_model=ReportUploadResponse, tags=["Module 01: Report Explainer"])
async def upload_laboratory_report(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token"),
) -> ReportUploadResponse:
    """
    Uploads a laboratory report in PDF format (max 5 MB).
    Extracts text in-memory using PyMuPDF and immediately discards the raw file.
    Returns candidate extracted analytes for mandatory user confirmation.
    """
    # 1. Validate file extension and MIME type
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only PDF documents are supported.",
        )

    # 2. Read bytes in-memory and validate size (< 5MB)
    pdf_bytes = await file.read()
    if len(pdf_bytes) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds the 5 MB threshold limit.",
        )

    # 3. Validate magic bytes (%PDF-)
    if not pdf_bytes.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Corrupted or invalid PDF header format.",
        )

    try:
        return await ReportExplainerService.process_pdf_upload(
            pdf_bytes=pdf_bytes,
            session_token=x_session_token,
            db=db,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unable to process PDF: {str(e)}",
        )


@router.post("/reports/parse-manual", response_model=ReportUploadResponse, tags=["Module 01: Report Explainer"])
async def parse_manual_report_entries(
    items: List[ConfirmedLabItem],
    db: AsyncSession = Depends(get_db),
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token"),
) -> ReportUploadResponse:
    """Intake endpoint for manual laboratory test entries."""
    if not items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one laboratory test item must be provided.",
        )
    return await ReportExplainerService.process_manual_entry(
        items=items,
        session_token=x_session_token,
        db=db,
    )


@router.post("/reports/confirm", response_model=ReportConfirmResponse, tags=["Module 01: Report Explainer"])
async def confirm_report_observations(
    request: ReportConfirmRequest,
    lang: str = Query("en", pattern="^(en|hi|or)$"),
    db: AsyncSession = Depends(get_db),
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token"),
) -> ReportConfirmResponse:
    """
    Mandatory Confirmation Gate:
    User submits verified observations. Generates plain-language biomarker explanations.
    """
    if not request.confirmed_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot confirm report without at least one verified test observation.",
        )

    return await ReportExplainerService.confirm_observations(
        request=request,
        session_token=x_session_token,
        lang=lang,
        db=db,
    )


@router.get("/reports/{report_id}/observations", response_model=List[ConfirmedLabItem], tags=["Module 01: Report Explainer"])
async def get_report_observations(
    report_id: str,
    db: AsyncSession = Depends(get_db),
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token"),
) -> List[ConfirmedLabItem]:
    """Retrieves verified observations for an existing report."""
    stmt = select(LabObservationModel).where(LabObservationModel.report_id == report_id)
    res = await db.execute(stmt)
    records = res.scalars().all()

    return [
        ConfirmedLabItem(
            analyte_name=r.analyte_name,
            observed_value=r.observed_value,
            observed_value_str=r.observed_value_str,
            unit=r.unit,
            lab_reference_range=r.lab_reference_range,
            status_flag=r.status_flag,
        )
        for r in records
    ]
