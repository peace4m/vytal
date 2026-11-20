"""
Report Explainer Schemas (Module 01)
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class ExtractedLabItem(BaseModel):
    temp_id: str
    analyte_name: str
    observed_value: Optional[float] = None
    observed_value_str: str
    unit: Optional[str] = None
    lab_reference_range: Optional[str] = None
    ref_range_low: Optional[float] = None
    ref_range_high: Optional[float] = None
    status_flag: str = "NORMAL"
    extraction_confidence: float = Field(ge=0.0, le=1.0, default=1.0)


class ReportUploadResponse(BaseModel):
    report_id: str
    laboratory_name: Optional[str] = None
    report_date: Optional[str] = None
    extracted_items: List[ExtractedLabItem]
    disclaimer: str = "Verify all extracted values against your original report before confirming."


class ConfirmedLabItem(BaseModel):
    analyte_name: str
    observed_value: Optional[float] = None
    observed_value_str: Optional[str] = None
    unit: Optional[str] = None
    lab_reference_range: Optional[str] = None
    status_flag: str = "NORMAL"


class ReportConfirmRequest(BaseModel):
    report_id: str
    confirmed_items: List[ConfirmedLabItem]


class LabExplanationItem(BaseModel):
    analyte_name: str
    observed_value_str: str
    status: str
    explanation: str
    safety_note: str


class ReportConfirmResponse(BaseModel):
    report_id: str
    is_user_confirmed: bool
    explanations: List[LabExplanationItem]
