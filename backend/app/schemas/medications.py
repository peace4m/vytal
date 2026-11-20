"""
Medication Interaction Checker Schemas (Module 04)
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class MedicationConcept(BaseModel):
    rxcui: Optional[str] = None
    name: str
    synonym: Optional[str] = None
    drug_type: Optional[str] = None
    clinical_class: Optional[str] = None


class MedicationSearchResponse(BaseModel):
    query: str
    results: List[MedicationConcept]


class MedicationCheckItemInput(BaseModel):
    name: str
    rxcui: Optional[str] = None


class MedicationCheckRequest(BaseModel):
    medications: List[MedicationCheckItemInput] = Field(
        min_length=2,
        description="List of at least two medications to check for interactions",
    )


class DetectedInteractionInfo(BaseModel):
    drug_a: str
    drug_b: str
    severity: str
    clinical_description: str
    evidence_source: str
    management_guidance: Optional[str] = None


class MedicationCheckResponse(BaseModel):
    check_id: str
    total_medications: int
    interaction_count: int
    has_severe_warning: bool
    interactions: List[DetectedInteractionInfo]
    mandatory_disclaimer: str = (
        "No interaction was found for unspecified combinations. This does not establish that "
        "the combination is safe. Never stop, start, or adjust medications without consulting "
        "your prescribing healthcare provider."
    )
