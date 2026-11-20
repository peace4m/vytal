"""
Report Explainer Service Coordinator (Module 01)
Coordinates document parsing, user confirmation, and multilingual explanation delivery.
"""

import uuid
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.schemas.reports import (
    ReportUploadResponse,
    ReportConfirmRequest,
    ReportConfirmResponse,
    LabExplanationItem,
    ExtractedLabItem,
    ConfirmedLabItem,
)
from backend.app.database.models.report import LabReportModel, LabObservationModel
from backend.app.database.models.session import SessionModel
from backend.app.services.report_explainer.parser import LabReportParser
from backend.app.services.report_explainer.glossary import get_biomarker_explanation


class ReportExplainerService:

    @classmethod
    async def process_pdf_upload(
        cls,
        pdf_bytes: bytes,
        session_token: Optional[str],
        db: AsyncSession,
    ) -> ReportUploadResponse:
        """Parses PDF bytes in-memory and returns extracted items for review."""
        lab_name, report_date, extracted_items = LabReportParser.parse_pdf_bytes(pdf_bytes)
        report_id = str(uuid.uuid4())

        # If a session exists, register the pending report shell
        if session_token:
            stmt = select(SessionModel).where(SessionModel.session_token == session_token)
            res = await db.execute(stmt)
            sess = res.scalar_one_or_none()
            if sess:
                report_obj = LabReportModel(
                    id=report_id,
                    session_id=sess.id,
                    laboratory_name=lab_name,
                    report_date_str=report_date,
                    is_user_confirmed=False,
                )
                db.add(report_obj)
                await db.flush()

        return ReportUploadResponse(
            report_id=report_id,
            laboratory_name=lab_name,
            report_date=report_date,
            extracted_items=extracted_items,
            disclaimer="Verify all extracted values against your original report before confirming.",
        )

    @classmethod
    async def process_manual_entry(
        cls,
        items: List[ConfirmedLabItem],
        session_token: Optional[str],
        db: AsyncSession,
    ) -> ReportUploadResponse:
        """Processes manually inputted laboratory test items into candidate items."""
        report_id = str(uuid.uuid4())
        extracted_items = []

        for item in items:
            val_str = item.observed_value_str or (f"{item.observed_value} {item.unit}" if item.observed_value else "")
            extracted_items.append(
                ExtractedLabItem(
                    temp_id=f"item-{uuid.uuid4().hex[:8]}",
                    analyte_name=item.analyte_name,
                    observed_value=item.observed_value,
                    observed_value_str=val_str,
                    unit=item.unit,
                    lab_reference_range=item.lab_reference_range,
                    status_flag=item.status_flag or "NORMAL",
                    extraction_confidence=1.0,
                )
            )

        if session_token:
            stmt = select(SessionModel).where(SessionModel.session_token == session_token)
            res = await db.execute(stmt)
            sess = res.scalar_one_or_none()
            if sess:
                report_obj = LabReportModel(
                    id=report_id,
                    session_id=sess.id,
                    laboratory_name="Manual Entry",
                    is_user_confirmed=False,
                )
                db.add(report_obj)
                await db.flush()

        return ReportUploadResponse(
            report_id=report_id,
            laboratory_name="Manual Entry",
            extracted_items=extracted_items,
            disclaimer="Review your entered values before generating explanations.",
        )

    @classmethod
    async def confirm_observations(
        cls,
        request: ReportConfirmRequest,
        session_token: Optional[str],
        lang: str,
        db: AsyncSession,
    ) -> ReportConfirmResponse:
        """Stores confirmed observations in DB and generates multilingual explanations."""
        explanations: List[LabExplanationItem] = []

        # Find or create report model if session is valid
        report_obj = None
        if session_token:
            stmt = select(LabReportModel).where(LabReportModel.id == request.report_id)
            res = await db.execute(stmt)
            report_obj = res.scalar_one_or_none()
            if report_obj:
                report_obj.is_user_confirmed = True

        for item in request.confirmed_items:
            # Generate explanation in user's requested language
            exp_data = get_biomarker_explanation(
                analyte_name=item.analyte_name,
                status_flag=item.status_flag,
                lang=lang,
            )

            val_str = item.observed_value_str or (f"{item.observed_value} {item.unit}".strip() if item.observed_value else "Recorded")

            explanations.append(
                LabExplanationItem(
                    analyte_name=item.analyte_name,
                    observed_value_str=val_str,
                    status=item.status_flag,
                    explanation=exp_data["explanation"],
                    safety_note=exp_data["safety_note"],
                )
            )

            if report_obj:
                obs = LabObservationModel(
                    report_id=report_obj.id,
                    analyte_name=item.analyte_name,
                    observed_value=item.observed_value,
                    observed_value_str=val_str,
                    unit=item.unit,
                    lab_reference_range=item.lab_reference_range,
                    status_flag=item.status_flag,
                    user_verified=True,
                )
                db.add(obs)

        if report_obj:
            await db.flush()

        return ReportConfirmResponse(
            report_id=request.report_id,
            is_user_confirmed=True,
            explanations=explanations,
        )
