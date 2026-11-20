"""
Symptom Triage Endpoints (Module 03 Foundation)
Implements deterministic rule evaluation with emergency red-flag override.
"""

import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database.session import get_db
from backend.app.schemas.triage import (
    TriageEvaluateRequest,
    TriggeredRuleInfo,
    TriageEvaluateResponse,
)

router = APIRouter()


@router.post("/triage/evaluate", response_model=TriageEvaluateResponse, tags=["Module 03: Symptom Triage"])
async def evaluate_symptoms(
    request: TriageEvaluateRequest,
    db: AsyncSession = Depends(get_db),
    x_session_token: str = Header(None, alias="X-Session-Token"),
) -> TriageEvaluateResponse:
    """Evaluates symptoms deterministically, giving absolute priority to emergency red flags."""
    triggered_rules: List[TriggeredRuleInfo] = []
    emergency_override = False
    primary_acuity = "ROUTINE_CLINICAL"
    action_required = "Schedule a consultation with your primary care doctor for non-urgent review."
    safety_netting = "If your symptoms worsen, change, or new severe pain occurs, seek urgent medical evaluation."

    symptoms = set(request.primary_symptoms)
    attrs = request.symptom_attributes

    # Check Rule 1: Acute Coronary Syndrome
    if "chest_pain" in symptoms:
        pain_nature = attrs.get("chest_pain_nature", "")
        radiates = attrs.get("radiates_to_jaw_or_left_arm", False)
        shortness_of_breath = "shortness_of_breath" in symptoms or attrs.get("associated_dyspnea", False)

        if pain_nature in ["crushing_pressure", "heavy_squeezing", "crushing"] or radiates or shortness_of_breath:
            emergency_override = True
            primary_acuity = "EMERGENCY"
            action_required = "SEEK IMMEDIATE EMERGENCY MEDICAL CARE / CALL 108 OR 112"
            safety_netting = "Do not drive yourself to hospital. Rest quietly while emergency response is en route."
            triggered_rules.append(
                TriggeredRuleInfo(
                    rule_id="RULE-EMERG-ACS-001",
                    rule_name="Suspected Acute Coronary Syndrome (ACS) Red Flag",
                    priority="EMERGENCY_RED_FLAG",
                    evidence_source="NICE Clinical Guideline CG95 (Chest Pain of Recent Onset) & WHO ETAT",
                    reason="Chest pain with pressure characteristics, radiation, or associated dyspnea warrants immediate exclusion of acute myocardial infarction.",
                )
            )

    # Check Rule 2: Stroke (BE-FAST)
    if any(s in symptoms for s in ["facial_droop", "arm_weakness", "speech_difficulty"]):
        emergency_override = True
        primary_acuity = "EMERGENCY"
        action_required = "SEEK IMMEDIATE EMERGENCY STROKE CARE / CALL 108 OR 112"
        safety_netting = "Note the exact time of onset. Do not administer aspirin or oral food/drink until hospital evaluation."
        triggered_rules.append(
            TriggeredRuleInfo(
                rule_id="RULE-EMERG-STRK-002",
                rule_name="Acute Stroke (BE-FAST) Red Flag",
                priority="EMERGENCY_RED_FLAG",
                evidence_source="AHA/ASA Stroke Guidelines & NICE NG128",
                reason="Acute focal neurological signs (facial droop, arm weakness, or speech impairment) indicate emergent cerebrovascular event.",
            )
        )

    # Check Rule 3: Severe Respiratory Compromise
    if "stridor" in symptoms or attrs.get("inability_to_speak_full_sentences", False):
        emergency_override = True
        primary_acuity = "EMERGENCY"
        action_required = "SEEK IMMEDIATE EMERGENCY MEDICAL CARE"
        safety_netting = "Keep patient sitting upright. Clear any airway obstructions."
        triggered_rules.append(
            TriggeredRuleInfo(
                rule_id="RULE-EMERG-RESP-003",
                rule_name="Acute Severe Respiratory Compromise Red Flag",
                priority="EMERGENCY_RED_FLAG",
                evidence_source="WHO Emergency Triage Assessment and Treatment (ETAT)",
                reason="Stridor or inability to complete sentences indicates critical impending respiratory failure.",
            )
        )

    # If no emergency rule triggered, provide routine recommendation
    if not emergency_override:
        triggered_rules.append(
            TriggeredRuleInfo(
                rule_id="RULE-ROUT-METAB-008",
                rule_name="Routine Non-Emergency Clinical Evaluation",
                priority="ROUTINE",
                evidence_source="NICE Clinical Knowledge Summaries (CKS) Primary Care",
                reason="Reported symptoms do not match acute life-threatening emergency criteria.",
            )
        )

    return TriageEvaluateResponse(
        triage_id=str(uuid.uuid4()),
        primary_acuity=primary_acuity,
        emergency_override_triggered=emergency_override,
        action_required=action_required,
        triggered_rules=triggered_rules,
        safety_netting=safety_netting,
        uncertainty_notes=[] if request.symptom_attributes else ["Full symptom attributes were not provided; evaluation is based on primary selections."],
    )
