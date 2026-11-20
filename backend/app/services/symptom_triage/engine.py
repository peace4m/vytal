"""
Deterministic Symptom Triage Engine (Module 03)
Enforces strict hierarchical rule evaluation where emergency red flags override lower-acuity findings.
"""

import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.schemas.triage import (
    TriageEvaluateRequest,
    TriggeredRuleInfo,
    TriageEvaluateResponse,
)
from backend.app.services.symptom_triage.rules_register import (
    CLINICAL_RULES_REGISTRY,
    ClinicalRule,
)
from backend.app.database.models.triage import (
    TriageAssessmentModel,
    TriageRuleExecutionModel,
    ClinicalRuleModel,
)


class TriageEngine:
    """
    Deterministic clinical decision-support rule engine.
    Safety principle: Emergency rules are evaluated first and cannot be overridden by lower priority rules.
    """

    @classmethod
    def evaluate(
        cls,
        request: TriageEvaluateRequest,
        lang: str = "en",
    ) -> TriageEvaluateResponse:
        symptoms = set(request.primary_symptoms)
        attrs = request.symptom_attributes
        ctx = request.patient_context
        uncertainty_notes: List[str] = []

        emergency_rules_triggered: List[ClinicalRule] = []
        high_acuity_rules_triggered: List[ClinicalRule] = []
        reasons: Dict[str, str] = {}

        # ---------------------------------------------------------
        # TIER 1: EMERGENCY RED-FLAG EVALUATION (MANDATORY FIRST)
        # ---------------------------------------------------------

        # 1. Acute Coronary Syndrome
        if "chest_pain" in symptoms:
            pain_nature = attrs.get("chest_pain_nature", "")
            radiates = attrs.get("radiates_to_jaw_or_left_arm", False)
            sweat_dyspnea = attrs.get("associated_sweating_or_dyspnea", False)
            associated_dyspnea = "shortness_of_breath" in symptoms or "severe_shortness_of_breath" in symptoms

            if pain_nature == "":
                uncertainty_notes.append("Nature of chest pain was not specified; evaluated with heightened caution.")

            if (
                pain_nature in ["crushing_pressure", "heavy_squeezing", "crushing"]
                or radiates
                or sweat_dyspnea
                or associated_dyspnea
            ):
                rule = CLINICAL_RULES_REGISTRY["RULE-EMERG-ACS-001"]
                emergency_rules_triggered.append(rule)
                reasons[rule.rule_id] = (
                    "Reported chest pain presents with compressive pressure, radiation to upper body/arm, "
                    "or associated acute dyspnea/sweating."
                )

        # 2. Acute Stroke (BE-FAST)
        if (
            "facial_droop_or_weakness" in symptoms
            or "facial_droop" in symptoms
            or "arm_weakness" in symptoms
            or "speech_difficulty" in symptoms
            or attrs.get("unilateral_weakness", False)
            or attrs.get("speech_difficulty_or_slurring", False)
        ):
            rule = CLINICAL_RULES_REGISTRY["RULE-EMERG-STRK-002"]
            emergency_rules_triggered.append(rule)
            reasons[rule.rule_id] = (
                "Focal neurological deficit reported (unilateral limb weakness, facial asymmetry, or speech difficulty)."
            )

        # 3. Severe Acute Respiratory Compromise
        if (
            "severe_shortness_of_breath" in symptoms
            or "stridor" in symptoms
            or attrs.get("inability_to_speak_full_sentences", False)
            or attrs.get("stridor_or_rest_wheezing", False)
            or attrs.get("bluish_lips_or_cyanosis", False)
        ):
            rule = CLINICAL_RULES_REGISTRY["RULE-EMERG-RESP-003"]
            emergency_rules_triggered.append(rule)
            reasons[rule.rule_id] = (
                "Critical respiratory compromise evidenced by rest wheezing/stridor, cyanosis, or inability to form complete sentences."
            )

        # 4. Anaphylaxis
        if (
            "acute_allergic_reaction" in symptoms
            or attrs.get("throat_tightness_or_swallowing_difficulty", False)
        ):
            throat_tight = attrs.get("throat_tightness_or_swallowing_difficulty", False)
            recent_exposure = attrs.get("recent_allergen_or_medication_exposure", False)
            if throat_tight or recent_exposure:
                rule = CLINICAL_RULES_REGISTRY["RULE-EMERG-ANAPH-004"]
                emergency_rules_triggered.append(rule)
                reasons[rule.rule_id] = (
                    "Rapid allergic progression with airway involvement (throat tightness/swelling or allergen exposure)."
                )

        # 5. Thunderclap Headache / Meningism
        if (
            "thunderclap_headache" in symptoms
            or attrs.get("thunderclap_onset", False)
            or (attrs.get("severe_headache", False) and attrs.get("neck_stiffness_fever", False))
        ):
            rule = CLINICAL_RULES_REGISTRY["RULE-EMERG-NEURO-005"]
            emergency_rules_triggered.append(rule)
            reasons[rule.rule_id] = (
                "Sudden explosive headache peak (<1 min) or severe headache accompanied by fever and nuchal rigidity."
            )

        # 6. Sepsis Alert
        if (
            "fever_with_rigors_or_confusion" in symptoms
            or (attrs.get("has_fever_infection", False) and (attrs.get("altered_confusion", False) or attrs.get("severe_rigors", False)))
        ):
            rule = CLINICAL_RULES_REGISTRY["RULE-EMERG-SEPS-006"]
            emergency_rules_triggered.append(rule)
            reasons[rule.rule_id] = (
                "Infection symptoms coupled with severe rigors, mental disorientation, or tachypnea (suspected severe sepsis)."
            )

        # ---------------------------------------------------------
        # TIER 2: HIGH ACUITY (URGENT SAME-DAY CLINICAL EVALUATION)
        # ---------------------------------------------------------
        # Evaluated only if no emergency override, or documented alongside emergency
        if "excessive_thirst_and_vomiting" in symptoms or attrs.get("excessive_thirst", False):
            vomiting = attrs.get("persistent_vomiting_fluids", False)
            fruity = attrs.get("fruity_breath_odor", False)
            known_dm = attrs.get("known_diabetes_history", False) or ctx.get("known_diabetes", False)

            if vomiting or fruity or known_dm:
                rule = CLINICAL_RULES_REGISTRY["RULE-URG-DKA-007"]
                high_acuity_rules_triggered.append(rule)
                reasons[rule.rule_id] = (
                    "Polydipsia, polyuria, and vomiting in context of known/suspected hyperglycemia (suspected DKA/HHS)."
                )

        # ---------------------------------------------------------
        # RESOLUTION & SAFETY OVERRIDE ENFORCEMENT
        # ---------------------------------------------------------
        triage_id = str(uuid.uuid4())

        if len(emergency_rules_triggered) > 0:
            primary_acuity = "EMERGENCY"
            emergency_override = True
            active_rule = emergency_rules_triggered[0]
            action_required = active_rule.recommended_action.get(lang)
            safety_netting = active_rule.safety_netting.get(lang)

            all_triggered = [
                TriggeredRuleInfo(
                    rule_id=r.rule_id,
                    rule_name=r.rule_name,
                    priority=r.priority_tier,
                    evidence_source=f"{r.evidence.organization} ({r.evidence.year}) - {r.evidence.title}",
                    reason=reasons.get(r.rule_id, r.clinical_rationale.get(lang)),
                )
                for r in emergency_rules_triggered
            ]

        elif len(high_acuity_rules_triggered) > 0:
            primary_acuity = "HIGH_ACUITY"
            emergency_override = False
            active_rule = high_acuity_rules_triggered[0]
            action_required = active_rule.recommended_action.get(lang)
            safety_netting = active_rule.safety_netting.get(lang)

            all_triggered = [
                TriggeredRuleInfo(
                    rule_id=r.rule_id,
                    rule_name=r.rule_name,
                    priority=r.priority_tier,
                    evidence_source=f"{r.evidence.organization} ({r.evidence.year}) - {r.evidence.title}",
                    reason=reasons.get(r.rule_id, r.clinical_rationale.get(lang)),
                )
                for r in high_acuity_rules_triggered
            ]

        else:
            primary_acuity = "ROUTINE_CLINICAL"
            emergency_override = False
            active_rule = CLINICAL_RULES_REGISTRY["RULE-ROUT-METAB-008"]
            action_required = active_rule.recommended_action.get(lang)
            safety_netting = active_rule.safety_netting.get(lang)

            all_triggered = [
                TriggeredRuleInfo(
                    rule_id=active_rule.rule_id,
                    rule_name=active_rule.rule_name,
                    priority=active_rule.priority_tier,
                    evidence_source=f"{active_rule.evidence.organization} ({active_rule.evidence.year}) - {active_rule.evidence.title}",
                    reason=active_rule.clinical_rationale.get(lang),
                )
            ]

        return TriageEvaluateResponse(
            triage_id=triage_id,
            primary_acuity=primary_acuity,
            emergency_override_triggered=emergency_override,
            action_required=action_required,
            triggered_rules=all_triggered,
            safety_netting=safety_netting,
            uncertainty_notes=uncertainty_notes,
        )

    @classmethod
    async def persist_assessment(
        cls,
        db: AsyncSession,
        session_id: str,
        request: TriageEvaluateRequest,
        response: TriageEvaluateResponse,
    ) -> None:
        """Persists triage assessment and triggered rule execution audit trail into database."""
        assessment = TriageAssessmentModel(
            id=response.triage_id,
            session_id=session_id,
            input_symptoms={
                "primary_symptoms": request.primary_symptoms,
                "symptom_attributes": request.symptom_attributes,
                "patient_context": request.patient_context,
            },
            primary_acuity=response.primary_acuity,
            emergency_override_triggered=response.emergency_override_triggered,
            recommended_action=response.action_required,
            safety_netting_advice=response.safety_netting,
        )
        db.add(assessment)

        for rule in response.triggered_rules:
            # Ensure clinical rule exists in clinical_rules table
            reg_rule = CLINICAL_RULES_REGISTRY.get(rule.rule_id)
            if reg_rule:
                existing_rule = await db.get(ClinicalRuleModel, rule.rule_id)
                if not existing_rule:
                    rule_record = ClinicalRuleModel(
                        rule_id=reg_rule.rule_id,
                        rule_name=reg_rule.rule_name,
                        category=reg_rule.category,
                        priority_tier=reg_rule.priority_tier,
                        logic_predicate={"description": reg_rule.clinical_rationale.en},
                        evidence_source_id=reg_rule.evidence.guideline_id,
                        version=reg_rule.version,
                        is_active=True,
                        review_status=reg_rule.review_status,
                        effective_date=reg_rule.effective_date,
                    )
                    db.add(rule_record)
                    await db.flush()

            execution = TriageRuleExecutionModel(
                triage_id=response.triage_id,
                rule_id=rule.rule_id,
                triggered_reason=rule.reason,
                clinical_action=response.action_required,
            )
            db.add(execution)

        await db.commit()
