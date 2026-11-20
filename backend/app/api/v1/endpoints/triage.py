"""
Symptom Triage Endpoints (Module 03)
Deterministic rule evaluation engine with absolute emergency red-flag priority and multilingual support.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database.session import get_db
from backend.app.database.models.session import SessionModel
from backend.app.schemas.triage import (
    TriageEvaluateRequest,
    TriageEvaluateResponse,
    TriggeredRuleInfo,
)
from backend.app.services.symptom_triage.engine import TriageEngine
from backend.app.services.symptom_triage.rules_register import CLINICAL_RULES_REGISTRY
from backend.app.services.symptom_triage.questionnaire import (
    PRIMARY_SYMPTOMS_CATALOG,
    ADAPTIVE_FOLLOW_UPS,
)

router = APIRouter()


@router.get("/triage/questions", tags=["Module 03: Symptom Triage"])
async def get_triage_questionnaire(
    lang: str = Query("en", description="Language code: en, hi, or"),
) -> Dict[str, Any]:
    """Returns structured multilingual symptom catalog and adaptive follow-up questions."""
    return {
        "language": lang,
        "primary_symptoms": PRIMARY_SYMPTOMS_CATALOG,
        "adaptive_follow_ups": ADAPTIVE_FOLLOW_UPS,
    }


@router.get("/triage/rules", tags=["Module 03: Symptom Triage"])
async def get_clinical_rules_register() -> Dict[str, Any]:
    """Returns the authoritative, auditable clinical rules register and bibliographic evidence."""
    rules_out = []
    for r in CLINICAL_RULES_REGISTRY.values():
        rules_out.append({
            "rule_id": r.rule_id,
            "rule_name": r.rule_name,
            "priority_tier": r.priority_tier,
            "category": r.category,
            "version": r.version,
            "effective_date": r.effective_date,
            "review_status": r.review_status,
            "evidence": {
                "title": r.evidence.title,
                "organization": r.evidence.organization,
                "year": r.evidence.year,
                "guideline_id": r.evidence.guideline_id,
                "url": r.evidence.url,
            },
            "clinical_rationale": {
                "en": r.clinical_rationale.en,
                "hi": r.clinical_rationale.hi,
                "or": r.clinical_rationale.or_,
            },
        })
    return {"total_rules": len(rules_out), "rules": rules_out}


@router.post("/triage/evaluate", response_model=TriageEvaluateResponse, tags=["Module 03: Symptom Triage"])
async def evaluate_symptoms(
    request: TriageEvaluateRequest,
    lang: str = Query("en", description="Language: en, hi, or"),
    db: AsyncSession = Depends(get_db),
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token"),
) -> TriageEvaluateResponse:
    """
    Evaluates symptoms deterministically, giving absolute priority to emergency red flags.
    Emergency red-flag matches immediately override lower acuity and cannot be downgraded.
    """
    response = TriageEngine.evaluate(request, lang=lang)

    # If valid session exists, persist assessment and execution log
    if x_session_token:
        try:
            session = await db.get(SessionModel, x_session_token)
            if session:
                await TriageEngine.persist_assessment(
                    db=db,
                    session_id=x_session_token,
                    request=request,
                    response=response,
                )
        except Exception:
            # Audit logging failure should not break critical triage delivery
            pass

    return response
