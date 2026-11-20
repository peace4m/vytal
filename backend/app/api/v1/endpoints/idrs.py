"""
Indian Diabetes Risk Score Endpoints (Module 02)
Strictly implements Mohan et al. (JAPI 2005; 53:759-763).
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.database.session import get_db
from backend.app.schemas.idrs import (
    IDRSCalculateRequest,
    IDRSCalculateResponse,
)
from backend.app.services.idrs.service import IDRSService

router = APIRouter()


@router.post("/idrs/calculate", response_model=IDRSCalculateResponse, tags=["Module 02: IDRS"])
async def calculate_idrs(
    request: IDRSCalculateRequest,
    lang: str = Query("en", pattern="^(en|hi|or)$"),
    db: AsyncSession = Depends(get_db),
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token"),
) -> IDRSCalculateResponse:
    """Calculates the Indian Diabetes Risk Score with strict evidence-based point mapping."""
    return await IDRSService.calculate_score(
        request=request,
        session_token=x_session_token,
        lang=lang,
        db=db,
    )


@router.get("/idrs/metadata", tags=["Module 02: IDRS"])
async def get_idrs_metadata() -> Dict[str, Any]:
    """Returns published methodology provenance, parameter boundaries, and bibliographic citations."""
    return {
        "title": "A simplified Indian Diabetes Risk Score for screening for undiagnosed diabetic subjects",
        "authors": ["V. Mohan", "R. Deepa", "M. Deepa", "S. Somannavar", "M. Datta"],
        "journal": "Journal of the Association of Physicians of India (JAPI)",
        "volume": 53,
        "year": 2005,
        "pages": "759-763",
        "pmid": "16334622",
        "cohort": "Chennai Urban Rural Epidemiology Study (CURES)",
        "optimal_cutoff": ">= 60",
        "sensitivity": "72.5%",
        "specificity": "60.1%",
        "max_score": 100,
        "parameters": [
            {
                "name": "Age",
                "rules": [
                    {"category": "< 35 years", "points": 0},
                    {"category": "35-49 years", "points": 20},
                    {"category": ">= 50 years", "points": 30},
                ],
            },
            {
                "name": "Abdominal Obesity (Waist Circumference)",
                "rules": [
                    {"category": "Female < 80 cm / Male < 90 cm", "points": 0},
                    {"category": "Female 80-89 cm / Male 90-99 cm", "points": 10},
                    {"category": "Female >= 90 cm / Male >= 100 cm", "points": 20},
                ],
            },
            {
                "name": "Physical Activity",
                "rules": [
                    {"category": "Regular vigorous exercise AND strenuous manual work", "points": 0},
                    {"category": "Regular exercise OR strenuous manual work", "points": 20},
                    {"category": "No exercise AND sedentary occupational work", "points": 30},
                ],
            },
            {
                "name": "Family History of Diabetes",
                "rules": [
                    {"category": "No family history (neither parent diagnosed)", "points": 0},
                    {"category": "One parent diagnosed with diabetes", "points": 10},
                    {"category": "Both parents diagnosed with diabetes", "points": 20},
                ],
            },
        ],
    }
