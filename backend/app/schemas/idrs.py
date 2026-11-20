"""
Indian Diabetes Risk Score Schemas (Module 02)
"""

from pydantic import BaseModel, Field


class IDRSCalculateRequest(BaseModel):
    age: int = Field(ge=1, le=120, description="Age in completed years")
    gender: str = Field(pattern="^(male|female)$", description="'male' or 'female'")
    waist_circumference_cm: float = Field(
        ge=30.0,
        le=250.0,
        description="Waist circumference in centimeters measured midway between lowest rib and iliac crest",
    )
    physical_activity_tier: str = Field(
        pattern="^(vigorous|moderate|sedentary)$",
        description="'vigorous' (exercise + manual labor), 'moderate' (either one), or 'sedentary' (no exercise + desk)",
    )
    family_history_tier: str = Field(
        pattern="^(none|one_parent|both_parents)$",
        description="'none' (neither parent), 'one_parent' (either parent), or 'both_parents'",
    )


class IDRSScoreBreakdown(BaseModel):
    age_input: int
    age_tier: str
    age_points: int
    gender: str
    waist_circumference_cm: float
    waist_tier: str
    waist_points: int
    physical_activity_tier: str
    activity_description: str
    activity_points: int
    family_history_tier: str
    family_history_description: str
    family_history_points: int


class IDRSClinicalContext(BaseModel):
    risk_label: str
    interpretation: str
    sensitivity: str
    specificity: str
    recommendation: str
    bibliographic_citation: str


class IDRSCalculateResponse(BaseModel):
    assessment_id: str
    breakdown: IDRSScoreBreakdown
    total_score: int
    risk_category: str
    clinical_context: IDRSClinicalContext
