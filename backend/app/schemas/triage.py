"""
Symptom Triage Schemas (Module 03)
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class TriageEvaluateRequest(BaseModel):
    primary_symptoms: List[str] = Field(description="List of selected primary symptom keys")
    symptom_attributes: Dict[str, Any] = Field(
        default_factory=dict,
        description="Attributes such as onset, severity, radiation, duration",
    )
    patient_context: Dict[str, Any] = Field(
        default_factory=dict,
        description="Non-identifiable contextual variables e.g. age, known chronic conditions",
    )


class TriggeredRuleInfo(BaseModel):
    rule_id: str
    rule_name: str
    priority: str
    evidence_source: str
    reason: str


class TriageEvaluateResponse(BaseModel):
    triage_id: str
    primary_acuity: str
    emergency_override_triggered: bool
    action_required: str
    triggered_rules: List[TriggeredRuleInfo]
    safety_netting: str
    uncertainty_notes: List[str] = Field(default_factory=list)
