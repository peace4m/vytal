"""
Multi-Module Cross-Domain Health Summary Synthesis Engine (Module 05)
Consolidates findings across Modules 01 through 04 into a prioritized clinical brief.
Enforces non-diagnostic educational boundaries and evidence traceability.
"""

import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.app.schemas.summary import (
    HealthSynthesisItem,
    Module01Summary,
    Module02Summary,
    Module03Summary,
    Module04Summary,
    HealthSummaryGenerateResponse,
)
from backend.app.database.models.report import LabObservationModel, LabReportModel
from backend.app.database.models.idrs import IDRSAssessmentModel
from backend.app.database.models.triage import TriageAssessmentModel, TriageRuleExecutionModel
from backend.app.database.models.medication import (
    MedicationCheckModel,
    MedicationCheckItemModel,
    DetectedInteractionModel,
)


class HealthSummaryEngine:
    """Synthesizes clinical decision-support data across all active modules."""

    @classmethod
    async def aggregate_session_data(
        cls,
        db: AsyncSession,
        session_id: str,
    ) -> Dict[str, Any]:
        """Queries the latest active findings for the session across database models."""
        # 1. Module 01: Confirmed Lab Observations
        obs_stmt = (
            select(LabObservationModel)
            .join(LabReportModel)
            .where(LabReportModel.session_id == session_id)
        )
        obs_result = await db.execute(obs_stmt)
        observations = obs_result.scalars().all()

        # 2. Module 02: Latest IDRS Assessment
        idrs_stmt = (
            select(IDRSAssessmentModel)
            .where(IDRSAssessmentModel.session_id == session_id)
            .order_by(IDRSAssessmentModel.created_at.desc())
            .limit(1)
        )
        idrs_result = await db.execute(idrs_stmt)
        latest_idrs = idrs_result.scalar_one_or_none()

        # 3. Module 03: Latest Triage Assessment
        triage_stmt = (
            select(TriageAssessmentModel)
            .where(TriageAssessmentModel.session_id == session_id)
            .order_by(TriageAssessmentModel.created_at.desc())
            .limit(1)
        )
        triage_result = await db.execute(triage_stmt)
        latest_triage = triage_result.scalar_one_or_none()

        # 4. Module 04: Latest Medication Check
        med_stmt = (
            select(MedicationCheckModel)
            .where(MedicationCheckModel.session_id == session_id)
            .order_by(MedicationCheckModel.created_at.desc())
            .limit(1)
        )
        med_result = await db.execute(med_stmt)
        latest_med_check = med_result.scalar_one_or_none()

        return {
            "observations": observations,
            "idrs": latest_idrs,
            "triage": latest_triage,
            "med_check": latest_med_check,
        }

    @classmethod
    def synthesize(
        cls,
        raw_data: Optional[Dict[str, Any]] = None,
        lang: str = "en",
    ) -> HealthSummaryGenerateResponse:
        """
        Synthesizes modular findings into prioritized executive summary brief.
        Works seamlessly with either live DB records or fallback defaults.
        """
        raw = raw_data or {}
        summary_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)

        # -------------------------------------------------------------------
        # Module 01 Summary
        # -------------------------------------------------------------------
        obs_list = raw.get("observations", [])
        m1_obs_dicts = []
        has_abnormal_glucose = False
        has_abnormal_creatinine = False
        has_abnormal_lipid = False

        for obs in obs_list:
            analyte = getattr(obs, "analyte_name", obs.get("analyte_name", "") if isinstance(obs, dict) else "")
            val = getattr(obs, "observed_value_str", obs.get("observed_value_str", "") if isinstance(obs, dict) else "")
            unit = getattr(obs, "unit", obs.get("unit", "") if isinstance(obs, dict) else "")
            ref = getattr(obs, "lab_reference_range", getattr(obs, "printed_reference_range", obs.get("printed_reference_range", "") if isinstance(obs, dict) else ""))
            status = getattr(obs, "status_flag", getattr(obs, "status", obs.get("status", "NORMAL") if isinstance(obs, dict) else "NORMAL"))

            if "glucose" in analyte.lower() and status in ("HIGH", "ABNORMAL"):
                has_abnormal_glucose = True
            if "creatinine" in analyte.lower() and status in ("HIGH", "ABNORMAL"):
                has_abnormal_creatinine = True
            if "cholesterol" in analyte.lower() and status in ("HIGH", "ABNORMAL"):
                has_abnormal_lipid = True

            m1_obs_dicts.append({
                "analyte_name": analyte,
                "value": val,
                "unit": unit,
                "reference_range": ref,
                "status": status,
            })

        mod01 = Module01Summary(
            has_data=len(m1_obs_dicts) > 0,
            confirmed_observations_count=len(m1_obs_dicts),
            observations=m1_obs_dicts,
        )

        # -------------------------------------------------------------------
        # Module 02 Summary
        # -------------------------------------------------------------------
        idrs_obj = raw.get("idrs")
        has_high_idrs = False
        if idrs_obj:
            tot = idrs_obj.total_score if hasattr(idrs_obj, "total_score") else idrs_obj.get("total_score")
            cat = idrs_obj.risk_category if hasattr(idrs_obj, "risk_category") else idrs_obj.get("risk_category")
            bdown = idrs_obj.score_breakdown if hasattr(idrs_obj, "score_breakdown") else idrs_obj.get("score_breakdown", {})
            has_high_idrs = tot is not None and tot >= 60

            mod02 = Module02Summary(
                has_data=True,
                total_score=tot,
                risk_category=cat,
                breakdown=bdown,
                citation="Mohan V et al. J Assoc Physicians India (JAPI) 2005; 53:759-763",
            )
        else:
            mod02 = Module02Summary(has_data=False)

        # -------------------------------------------------------------------
        # Module 03 Summary
        # -------------------------------------------------------------------
        triage_obj = raw.get("triage")
        is_emergency = False
        if triage_obj:
            acuity = triage_obj.primary_acuity if hasattr(triage_obj, "primary_acuity") else triage_obj.get("primary_acuity")
            override = triage_obj.emergency_override_triggered if hasattr(triage_obj, "emergency_override_triggered") else triage_obj.get("emergency_override_triggered", False)
            act = triage_obj.recommended_action if hasattr(triage_obj, "recommended_action") else triage_obj.get("recommended_action")
            safety = triage_obj.safety_netting_advice if hasattr(triage_obj, "safety_netting_advice") else triage_obj.get("safety_netting_advice")
            is_emergency = override or acuity == "EMERGENCY"

            mod03 = Module03Summary(
                has_data=True,
                primary_acuity=acuity,
                emergency_override_triggered=override,
                action_required=act,
                triggered_rules=[],
                safety_netting=safety,
            )
        else:
            mod03 = Module03Summary(has_data=False)

        # -------------------------------------------------------------------
        # Module 04 Summary
        # -------------------------------------------------------------------
        med_obj = raw.get("med_check")
        has_severe_ddi = False
        if med_obj:
            d_count = med_obj.drug_count if hasattr(med_obj, "drug_count") else med_obj.get("drug_count", 0)
            i_count = med_obj.interaction_count if hasattr(med_obj, "interaction_count") else med_obj.get("interaction_count", 0)
            sev = med_obj.has_contraindication if hasattr(med_obj, "has_contraindication") else med_obj.get("has_contraindication", False)
            has_severe_ddi = sev

            mod04 = Module04Summary(
                has_data=True,
                total_medications=d_count,
                interaction_count=i_count,
                has_severe_warning=sev,
                medications_checked=[],
                interactions=[],
                mandatory_disclaimer=(
                    "No interaction was found for unspecified combinations in the available dataset. "
                    "This does NOT establish that the combination is safe."
                ),
            )
        else:
            mod04 = Module04Summary(has_data=False)

        # -------------------------------------------------------------------
        # Highest Acuity Calculation
        # -------------------------------------------------------------------
        if is_emergency:
            highest_acuity = "EMERGENCY"
        elif has_severe_ddi:
            highest_acuity = "HIGH_ACUITY"
        elif has_high_idrs or has_abnormal_glucose or has_abnormal_creatinine:
            highest_acuity = "MODERATE"
        else:
            highest_acuity = "ROUTINE"

        # -------------------------------------------------------------------
        # Cross-Module Correlated Synthesis (Cautious & Non-Diagnostic)
        # -------------------------------------------------------------------
        insights: List[HealthSynthesisItem] = []

        # 1. Correlation: Raised Glucose + High IDRS
        if has_abnormal_glucose and has_high_idrs:
            insights.append(
                HealthSynthesisItem(
                    category="Metabolic / Glycemic Risk Correlation",
                    severity="WARNING",
                    title="Elevated Glucose Observation with High IDRS Profile",
                    details=(
                        "An elevated blood glucose finding from confirmed laboratory records coincides with a high "
                        "risk score (>=60) on the Indian Diabetes Risk Score assessment. This combination warrants "
                        "a formal outpatient evaluation by a physician for diagnostic fasting plasma glucose, "
                        "oral glucose tolerance, or HbA1c testing."
                    ),
                    evidence_source="ICMR Guidelines for Management of Type 2 Diabetes & Mohan et al. (JAPI 2005)",
                    boundary_notice="Educational observation. Neither score nor individual lab test constitutes a medical diagnosis.",
                )
            )
        elif has_high_idrs:
            insights.append(
                HealthSynthesisItem(
                    category="Preventive Screening Profile",
                    severity="INFORMATIONAL",
                    title="Elevated Indian Diabetes Risk Score (>=60)",
                    details=(
                        "The calculated Indian Diabetes Risk Score indicates an elevated probability for diabetes "
                        "or pre-diabetes in South Asian adults (sensitivity ~72.5%). Primary care consultation and "
                        "lifestyle modifications regarding physical activity and nutrition are recommended."
                    ),
                    evidence_source="Mohan V et al. J Assoc Physicians India (JAPI) 2005; 53:759-763",
                    boundary_notice="Screening tool for awareness only; does not establish presence of pathology.",
                )
            )

        # 2. Emergency Override Notice
        if is_emergency:
            insights.append(
                HealthSynthesisItem(
                    category="Acute Clinical Priority",
                    severity="CRITICAL",
                    title="Emergency Red-Flag Protocol Activated",
                    details=(
                        "The symptom triage assessment detected potential life-threatening emergency criteria. "
                        "All non-emergency findings are subordinated. Immediate emergency evaluation is required."
                    ),
                    evidence_source="NICE CG95 / AHA Guidelines / WHO ETAT",
                    boundary_notice="Emergency safety protocol overrides all lower priority information.",
                )
            )

        # 3. Severe Medication Warning
        if has_severe_ddi:
            insights.append(
                HealthSynthesisItem(
                    category="Pharmacotherapy Safety",
                    severity="CRITICAL",
                    title="High-Priority Drug Interaction Identified",
                    details=(
                        "At least one severe or contraindicated drug interaction pair was identified in the queried "
                        "regimen. Co-administration requires clinical physician review and monitoring."
                    ),
                    evidence_source="FDA Boxed Warnings & ONC High-Priority Drug Interaction Registry",
                    boundary_notice="Never stop or alter prescription medication without direct medical supervision.",
                )
            )

        # 4. Standard Health Optimization & Baseline Insight
        if len(insights) == 0:
            insights.append(
                HealthSynthesisItem(
                    category="General Health Brief",
                    severity="INFORMATIONAL",
                    title="Integrated Health Overview & Routine Monitoring",
                    details=(
                        "All evaluated parameters fall within standard elective or routine thresholds. Continue regular "
                        "preventive health check-ups and maintain an active lifestyle with balanced nutrition."
                    ),
                    evidence_source="WHO Global Strategy on Diet, Physical Activity and Health",
                    boundary_notice="This educational brief does not substitute for regular clinical check-ups.",
                )
            )

        # Mandatory Safety Disclaimer
        mandatory_disclaimer = (
            "VYTAL is an educational and research decision-support prototype. It does not provide medical diagnoses, "
            "treatment plans, or clinical validation. Every result must be interpreted in conjunction with qualified "
            "healthcare professionals. Never alter or discontinue prescribed medication based on this tool."
        )

        return HealthSummaryGenerateResponse(
            summary_id=summary_id,
            generated_at=now,
            highest_acuity=highest_acuity,
            module_01_report=mod01,
            module_02_idrs=mod02,
            module_03_triage=mod03,
            module_04_medications=mod04,
            cross_module_insights=insights,
            synthesis_items=insights,
            pdf_export_url=f"/api/v1/summary/export-pdf?summary_id={summary_id}",
            mandatory_safety_disclaimer=mandatory_disclaimer,
        )
