"""
Indian Diabetes Risk Score Endpoints (Module 02 Foundation)
Strictly implements Mohan et al. (JAPI 2005; 53:759-763).
"""

import uuid
from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database.session import get_db
from backend.app.schemas.idrs import (
    IDRSCalculateRequest,
    IDRSScoreBreakdown,
    IDRSClinicalContext,
    IDRSCalculateResponse,
)

router = APIRouter()


@router.post("/idrs/calculate", response_model=IDRSCalculateResponse, tags=["Module 02: IDRS"])
async def calculate_idrs(
    request: IDRSCalculateRequest,
    db: AsyncSession = Depends(get_db),
    x_session_token: str = Header(None, alias="X-Session-Token"),
) -> IDRSCalculateResponse:
    """Calculates the Indian Diabetes Risk Score with strict evidence-based point mapping."""
    # 1. Age Points
    if request.age < 35:
        age_points = 0
        age_tier = "< 35 years"
    elif request.age <= 49:
        age_points = 20
        age_tier = "35-49 years"
    else:
        age_points = 30
        age_tier = ">= 50 years"

    # 2. Waist Circumference Points
    if request.gender == "female":
        if request.waist_circumference_cm < 80.0:
            waist_points = 0
            waist_tier = "< 80 cm"
        elif request.waist_circumference_cm <= 89.0:
            waist_points = 10
            waist_tier = "80-89 cm"
        else:
            waist_points = 20
            waist_tier = ">= 90 cm"
    else:  # male
        if request.waist_circumference_cm < 90.0:
            waist_points = 0
            waist_tier = "< 90 cm"
        elif request.waist_circumference_cm <= 99.0:
            waist_points = 10
            waist_tier = "90-99 cm"
        else:
            waist_points = 20
            waist_tier = ">= 100 cm"

    # 3. Physical Activity Points
    if request.physical_activity_tier == "vigorous":
        activity_points = 0
        activity_desc = "Regular exercise AND strenuous occupational work"
    elif request.physical_activity_tier == "moderate":
        activity_points = 20
        activity_desc = "Regular exercise OR strenuous occupational work"
    else:
        activity_points = 30
        activity_desc = "No exercise AND sedentary occupational work"

    # 4. Family History Points
    if request.family_history_tier == "none":
        family_points = 0
        family_desc = "No family history (neither parent diagnosed)"
    elif request.family_history_tier == "one_parent":
        family_points = 10
        family_desc = "One parent diagnosed with diabetes"
    else:
        family_points = 20
        family_desc = "Both parents diagnosed with diabetes"

    total_score = age_points + waist_points + activity_points + family_points

    if total_score < 30:
        risk_category = "low"
        risk_label = "Low Risk (< 30 points)"
        interpretation = "Low probability of undiagnosed diabetes based on CURES criteria."
    elif total_score <= 50:
        risk_category = "moderate"
        risk_label = "Moderate Risk (30-50 points)"
        interpretation = "Moderate probability of undiagnosed diabetes. Lifestyle modifications recommended."
    else:
        risk_category = "high"
        risk_label = "High Risk (>= 60 points)"
        interpretation = "High probability of undiagnosed diabetes. Fasting blood glucose or HbA1c test strongly recommended."

    return IDRSCalculateResponse(
        assessment_id=str(uuid.uuid4()),
        breakdown=IDRSScoreBreakdown(
            age_input=request.age,
            age_tier=age_tier,
            age_points=age_points,
            gender=request.gender,
            waist_circumference_cm=request.waist_circumference_cm,
            waist_tier=waist_tier,
            waist_points=waist_points,
            physical_activity_tier=request.physical_activity_tier,
            activity_description=activity_desc,
            activity_points=activity_points,
            family_history_tier=request.family_history_tier,
            family_history_description=family_desc,
            family_history_points=family_points,
        ),
        total_score=total_score,
        risk_category=risk_category,
        clinical_context=IDRSClinicalContext(
            risk_label=risk_label,
            interpretation=interpretation,
            sensitivity="72.5%",
            specificity="60.1%",
            recommendation="Discuss this screening score with your primary healthcare provider.",
            bibliographic_citation="Mohan V, Deepa R, Deepa M, Somannavar S, Datta M. J Assoc Physicians India. 2005 Sep;53:759-63.",
        ),
    )
