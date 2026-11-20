"""
Health Summary Schemas (Module 05)
Consolidated multi-module clinical brief schemas.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field


class HealthSynthesisItem(BaseModel):
    category: str
    severity: str  # CRITICAL, WARNING, INFORMATIONAL, ROUTINE
    title: str
    details: str
    evidence_source: Optional[str] = None
    boundary_notice: Optional[str] = None


class Module01Summary(BaseModel):
    has_data: bool = False
    confirmed_observations_count: int = 0
    observations: List[Dict[str, Any]] = Field(default_factory=list)


class Module02Summary(BaseModel):
    has_data: bool = False
    total_score: Optional[int] = None
    risk_category: Optional[str] = None
    breakdown: Optional[Dict[str, Any]] = None
    citation: Optional[str] = None


class Module03Summary(BaseModel):
    has_data: bool = False
    primary_acuity: Optional[str] = None
    emergency_override_triggered: bool = False
    action_required: Optional[str] = None
    triggered_rules: List[Dict[str, Any]] = Field(default_factory=list)
    safety_netting: Optional[str] = None


class Module04Summary(BaseModel):
    has_data: bool = False
    total_medications: int = 0
    interaction_count: int = 0
    has_severe_warning: bool = False
    medications_checked: List[str] = Field(default_factory=list)
    interactions: List[Dict[str, Any]] = Field(default_factory=list)
    mandatory_disclaimer: Optional[str] = None


class HealthSummaryGenerateResponse(BaseModel):
    summary_id: str
    generated_at: datetime
    highest_acuity: str
    module_01_report: Module01Summary
    module_02_idrs: Module02Summary
    module_03_triage: Module03Summary
    module_04_medications: Module04Summary
    cross_module_insights: List[HealthSynthesisItem]
    synthesis_items: List[HealthSynthesisItem]  # Backward compatibility
    pdf_export_url: str
    mandatory_safety_disclaimer: str
