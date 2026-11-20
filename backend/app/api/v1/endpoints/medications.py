"""
Medication Interaction Checker Endpoints (Module 04 Foundation)
"""

import uuid
from typing import List
from fastapi import APIRouter, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.database.session import get_db
from backend.app.schemas.medications import (
    MedicationConcept,
    MedicationSearchResponse,
    MedicationCheckRequest,
    DetectedInteractionInfo,
    MedicationCheckResponse,
)

router = APIRouter()

# Curated reference concepts for common diabetes & cardiovascular medications
CORE_MEDICATION_CONCEPTS = [
    MedicationConcept(name="Metformin", rxcui="6809", synonym="Glucophage", drug_type="Ingredient", clinical_class="Biguanide"),
    MedicationConcept(name="Glimepiride", rxcui="25789", synonym="Amaryl", drug_type="Ingredient", clinical_class="Sulfonylurea"),
    MedicationConcept(name="Sitagliptin", rxcui="593411", synonym="Januvia", drug_type="Ingredient", clinical_class="DPP-4 Inhibitor"),
    MedicationConcept(name="Empagliflozin", rxcui="1545653", synonym="Jardiance", drug_type="Ingredient", clinical_class="SGLT2 Inhibitor"),
    MedicationConcept(name="Atorvastatin", rxcui="83367", synonym="Lipitor", drug_type="Ingredient", clinical_class="HMG-CoA Reductase Inhibitor"),
    MedicationConcept(name="Amlodipine", rxcui="17767", synonym="Norvasc", drug_type="Ingredient", clinical_class="Calcium Channel Blocker"),
    MedicationConcept(name="Telmisartan", rxcui="73056", synonym="Micardis", drug_type="Ingredient", clinical_class="Angiotensin II Receptor Blocker"),
    MedicationConcept(name="Aspirin", rxcui="1191", synonym="Ecosprin", drug_type="Ingredient", clinical_class="Antiplatelet / Salicylate"),
    MedicationConcept(name="Iodinated Radiocontrast", rxcui="6038", synonym="Radiopaque Contrast", drug_type="Ingredient", clinical_class="Diagnostic Agent"),
    MedicationConcept(name="Warfarin", rxcui="11289", synonym="Coumadin", drug_type="Ingredient", clinical_class="Vitamin K Antagonist"),
]

# Curated high-priority interactions
CURATED_INTERACTIONS = [
    {
        "pair": {"Metformin", "Iodinated Radiocontrast"},
        "severity": "SEVERE",
        "description": "Administration of intravascular iodinated radiocontrast in patients taking metformin may cause contrast-induced nephropathy leading to metformin accumulation and lactic acidosis.",
        "source": "FDA Boxed Warning & ACR Contrast Manual",
        "guidance": "Withhold metformin prior to or at time of iodinated contrast procedure and re-evaluate renal function after 48 hours.",
    },
    {
        "pair": {"Aspirin", "Warfarin"},
        "severity": "SEVERE",
        "description": "Concurrent use of aspirin with warfarin significantly potentiates the risk of major hemorrhage due to combined antiplatelet and anticoagulant effects.",
        "source": "ONC High-Priority Drug Interaction List & CHEST Guidelines",
        "guidance": "Co-administration requires strict clinical justification and intensive INR monitoring.",
    },
    {
        "pair": {"Glimepiride", "Aspirin"},
        "severity": "MODERATE",
        "description": "Salicylates may displace sulfonylureas from plasma protein binding sites and inhibit renal excretion, potentially enhancing hypoglycemia.",
        "source": "Clinical Pharmacology Drug Interaction Compendium",
        "guidance": "Monitor blood glucose levels frequently when initiating or titrating aspirin.",
    },
]


@router.get("/medications/search", response_model=MedicationSearchResponse, tags=["Module 04: Medication Checker"])
async def search_medications(q: str = "") -> MedicationSearchResponse:
    """Searches medication catalog with brand/generic normalization."""
    q_lower = q.strip().lower()
    if not q_lower:
        return MedicationSearchResponse(query=q, results=[])

    matches = [
        med for med in CORE_MEDICATION_CONCEPTS
        if q_lower in med.name.lower() or (med.synonym and q_lower in med.synonym.lower())
    ]
    return MedicationSearchResponse(query=q, results=matches)


@router.post("/medications/check", response_model=MedicationCheckResponse, tags=["Module 04: Medication Checker"])
async def check_medication_interactions(
    request: MedicationCheckRequest,
    db: AsyncSession = Depends(get_db),
    x_session_token: str = Header(None, alias="X-Session-Token"),
) -> MedicationCheckResponse:
    """Checks pairwise interactions across queried medications against curated evidence tables."""
    med_names = [m.name for m in request.medications]
    detected: List[DetectedInteractionInfo] = []
    has_severe = False

    # Check pairwise combinations
    for i in range(len(med_names)):
        for j in range(i + 1, len(med_names)):
            pair_set = {med_names[i], med_names[j]}
            for item in CURATED_INTERACTIONS:
                if item["pair"] == pair_set:
                    if item["severity"] in ["SEVERE", "CONTRAINDICATED"]:
                        has_severe = True
                    detected.append(
                        DetectedInteractionInfo(
                            drug_a=med_names[i],
                            drug_b=med_names[j],
                            severity=item["severity"],
                            clinical_description=item["description"],
                            evidence_source=item["source"],
                            management_guidance=item.get("guidance"),
                        )
                    )

    return MedicationCheckResponse(
        check_id=str(uuid.uuid4()),
        total_medications=len(med_names),
        interaction_count=len(detected),
        has_severe_warning=has_severe,
        interactions=detected,
    )
