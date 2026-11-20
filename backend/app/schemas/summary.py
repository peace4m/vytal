"""
Health Summary Schemas (Module 05)
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class HealthSynthesisItem(BaseModel):
    category: str
    severity: str
    title: str
    details: str
    boundary_notice: Optional[str] = None


class HealthSummaryGenerateResponse(BaseModel):
    summary_id: str
    generated_at: datetime
    highest_acuity: str
    synthesis_items: List[HealthSynthesisItem]
    pdf_export_url: str
