"""
Medication Interaction Checker Endpoints (Module 04)
Supports generic/brand normalization (including Indian trade names),
evidence-based pairwise interaction lookup, and mandatory negative disclaimers.
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, Header, Query
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database.session import get_db
from backend.app.database.models.session import SessionModel
from backend.app.database.models.medication import (
    MedicationCheckModel,
    MedicationCheckItemModel,
    DetectedInteractionModel,
)
from backend.app.schemas.medications import (
    MedicationConcept,
    MedicationSearchResponse,
    MedicationCheckRequest,
    DetectedInteractionInfo,
    MedicationCheckResponse,
)
from backend.app.services.medication_checker.catalog import (
    CORE_MEDICATION_CATALOG,
    normalize_medication_query,
    resolve_to_canonical_ingredient,
)
from backend.app.services.medication_checker.interactions import (
    MedicationInteractionEvaluator,
    MANDATORY_NON_INTERFERENCE_CLAUSE,
)

router = APIRouter()


@router.get("/medications/search", response_model=MedicationSearchResponse, tags=["Module 04: Medication Checker"])
async def search_medications(
    q: str = Query("", description="Medication search term (generic, brand, or Indian trade name)"),
) -> MedicationSearchResponse:
    """Searches medication catalog with brand/generic normalization."""
    matches = normalize_medication_query(q)
    return MedicationSearchResponse(
        query=q,
        results=[
            MedicationConcept(
                rxcui=m["rxcui"],
                name=m["name"],
                synonym=m["synonym"],
                drug_type=m["drug_type"],
                clinical_class=m["drug_class"],
            )
            for m in matches
        ],
    )


@router.get("/medications/catalog", tags=["Module 04: Medication Checker"])
async def get_medication_catalog() -> Dict[str, Any]:
    """Returns catalog summary and therapeutic class distributions."""
    classes: Dict[str, int] = {}
    for med in CORE_MEDICATION_CATALOG:
        classes[med.drug_class] = classes.get(med.drug_class, 0) + 1

    return {
        "total_catalog_size": len(CORE_MEDICATION_CATALOG),
        "classes_represented": classes,
        "sample_medications": [
            {
                "rxcui": med.rxcui,
                "name": med.name,
                "common_synonym": med.synonym,
                "indian_brands": med.indian_brands,
                "drug_class": med.drug_class,
            }
            for med in CORE_MEDICATION_CATALOG[:15]
        ],
    }


@router.post("/medications/check", response_model=MedicationCheckResponse, tags=["Module 04: Medication Checker"])
async def check_medication_interactions(
    request: MedicationCheckRequest,
    lang: str = Query("en", description="Language: en, hi, or"),
    db: AsyncSession = Depends(get_db),
    x_session_token: Optional[str] = Header(None, alias="X-Session-Token"),
) -> MedicationCheckResponse:
    """
    Checks pairwise interactions across queried medications against curated evidence tables.
    Always includes the mandatory negative finding disclaimer and prescription non-interference notice.
    """
    response = MedicationInteractionEvaluator.evaluate(request.medications, lang=lang)

    # If session provided, persist check results into database
    if x_session_token:
        try:
            session = await db.get(SessionModel, x_session_token)
            if session:
                check_model = MedicationCheckModel(
                    id=response.check_id,
                    session_id=x_session_token,
                    drug_count=response.total_medications,
                    interaction_count=response.interaction_count,
                    has_contraindication=response.has_severe_warning,
                )
                db.add(check_model)

                for item in request.medications:
                    canonical = resolve_to_canonical_ingredient(item.name)
                    item_model = MedicationCheckItemModel(
                        check_id=response.check_id,
                        input_name=item.name,
                        rxcui=canonical.rxcui if canonical else item.rxcui,
                        normalized_name=canonical.name if canonical else item.name,
                        drug_class=canonical.drug_class if canonical else None,
                        normalization_status="MATCHED" if canonical else "UNMATCHED",
                    )
                    db.add(item_model)

                for detected in response.interactions:
                    det_model = DetectedInteractionModel(
                        check_id=response.check_id,
                        drug_a_name=detected.drug_a,
                        drug_b_name=detected.drug_b,
                        severity=detected.severity,
                        clinical_description=detected.clinical_description,
                        evidence_source=detected.evidence_source,
                        management_advice=detected.management_guidance,
                    )
                    db.add(det_model)

                await db.commit()
        except Exception:
            # Audit logging should not crash the core interaction check response
            pass

    return response
