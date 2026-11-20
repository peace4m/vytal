"""
Medication Catalog and Brand/Generic Normalization (Module 04)
Contains 40+ essential diabetes, cardiovascular, antibiotic, NSAID, and psychotropic medications.
Maps generic active ingredients, RxCUIs, and common Indian and global brand names.
"""

from typing import List, Optional, Dict
from dataclasses import dataclass


@dataclass
class MedicationConceptRecord:
    rxcui: str
    name: str  # Generic active ingredient
    synonym: Optional[str]  # Common brand or alternative
    indian_brands: List[str]  # Common Indian pharmaceutical brand names
    drug_class: str
    drug_type: str = "Ingredient"


CORE_MEDICATION_CATALOG: List[MedicationConceptRecord] = [
    # --- Diabetes Medications ---
    MedicationConceptRecord(
        rxcui="6809",
        name="Metformin",
        synonym="Glucophage",
        indian_brands=["Glycomet", "Cetapin", "Obimet", "Formin", "Gluformin"],
        drug_class="Biguanide",
    ),
    MedicationConceptRecord(
        rxcui="25789",
        name="Glimepiride",
        synonym="Amaryl",
        indian_brands=["Zoryl", "Glimisave", "Glimy", "Euglim"],
        drug_class="Sulfonylurea",
    ),
    MedicationConceptRecord(
        rxcui="4815",
        name="Gliclazide",
        synonym="Diamicron",
        indian_brands=["Reclimet", "Glycinorm", "Glizid", "Diaglip"],
        drug_class="Sulfonylurea",
    ),
    MedicationConceptRecord(
        rxcui="593411",
        name="Sitagliptin",
        synonym="Januvia",
        indian_brands=["Januvia", "Istavel", "Sitara"],
        drug_class="DPP-4 Inhibitor",
    ),
    MedicationConceptRecord(
        rxcui="1545653",
        name="Empagliflozin",
        synonym="Jardiance",
        indian_brands=["Jardiance", "Gibtulio", "Empa"],
        drug_class="SGLT2 Inhibitor",
    ),
    MedicationConceptRecord(
        rxcui="1488564",
        name="Dapagliflozin",
        synonym="Farxiga / Forxiga",
        indian_brands=["Forxiga", "Oxra", "Dapadac", "Dapanorm"],
        drug_class="SGLT2 Inhibitor",
    ),
    MedicationConceptRecord(
        rxcui="5856",
        name="Human Insulin",
        synonym="Humulin / Novolin",
        indian_brands=["Human Mixtard", "Insulatard", "Actrapid", "Wosulin"],
        drug_class="Insulin",
    ),
    MedicationConceptRecord(
        rxcui="274783",
        name="Insulin Glargine",
        synonym="Lantus",
        indian_brands=["Lantus", "Basalog", "Glaritus"],
        drug_class="Long-Acting Insulin Analog",
    ),
    MedicationConceptRecord(
        rxcui="33738",
        name="Pioglitazone",
        synonym="Actos",
        indian_brands=["Pioz", "Piosafe", "Glizone"],
        drug_class="Thiazolidinedione",
    ),

    # --- Cardiovascular & Antihypertensive Medications ---
    MedicationConceptRecord(
        rxcui="83367",
        name="Atorvastatin",
        synonym="Lipitor",
        indian_brands=["Atorva", "Storvas", "Lipikind", "Tonact"],
        drug_class="HMG-CoA Reductase Inhibitor (Statin)",
    ),
    MedicationConceptRecord(
        rxcui="301542",
        name="Rosuvastatin",
        synonym="Crestor",
        indian_brands=["Rosuvas", "Rozavel", "Rosave", "Turbovas"],
        drug_class="HMG-CoA Reductase Inhibitor (Statin)",
    ),
    MedicationConceptRecord(
        rxcui="17767",
        name="Amlodipine",
        synonym="Norvasc",
        indian_brands=["Amlong", "Stamlo", "Amlopin", "Amlodac"],
        drug_class="Dihydropyridine Calcium Channel Blocker",
    ),
    MedicationConceptRecord(
        rxcui="73056",
        name="Telmisartan",
        synonym="Micardis",
        indian_brands=["Telma", "Telmikind", "Telsartan", "Cresar"],
        drug_class="Angiotensin II Receptor Blocker (ARB)",
    ),
    MedicationConceptRecord(
        rxcui="35296",
        name="Ramipril",
        synonym="Altace",
        indian_brands=["Cardace", "Hopace", "Ramirace"],
        drug_class="ACE Inhibitor",
    ),
    MedicationConceptRecord(
        rxcui="52175",
        name="Losartan",
        synonym="Cozaar",
        indian_brands=["Losacar", "Repace", "Tozaar"],
        drug_class="Angiotensin II Receptor Blocker (ARB)",
    ),
    MedicationConceptRecord(
        rxcui="6918",
        name="Metoprolol",
        synonym="Lopressor / Toprol-XL",
        indian_brands=["Betaloc", "Metolar", "Starpress", "Met-XL"],
        drug_class="Beta-1 Selective Adrenergic Blocker",
    ),
    MedicationConceptRecord(
        rxcui="9997",
        name="Spironolactone",
        synonym="Aldactone",
        indian_brands=["Aldactone", "Spilac"],
        drug_class="Aldosterone Receptor Antagonist (K-Sparing)",
    ),
    MedicationConceptRecord(
        rxcui="4603",
        name="Furosemide",
        synonym="Lasix",
        indian_brands=["Lasix", "Frusenex"],
        drug_class="Loop Diuretic",
    ),
    MedicationConceptRecord(
        rxcui="5487",
        name="Hydrochlorothiazide",
        synonym="Microzide",
        indian_brands=["Aquazide", "Hydrazide"],
        drug_class="Thiazide Diuretic",
    ),

    # --- Antiplatelet & Anticoagulant Medications ---
    MedicationConceptRecord(
        rxcui="1191",
        name="Aspirin",
        synonym="Ecosprin / Bayer",
        indian_brands=["Ecosprin", "Disprin", "Delisprin", "ASA"],
        drug_class="Antiplatelet / Salicylate",
    ),
    MedicationConceptRecord(
        rxcui="32968",
        name="Clopidogrel",
        synonym="Plavix",
        indian_brands=["Clopilet", "Deplatt", "Ceruvit", "Clavix"],
        drug_class="P2Y12 Platelet Inhibitor",
    ),
    MedicationConceptRecord(
        rxcui="11289",
        name="Warfarin",
        synonym="Coumadin",
        indian_brands=["Warf", "Coumadin"],
        drug_class="Vitamin K Antagonist",
    ),
    MedicationConceptRecord(
        rxcui="1364430",
        name="Apixaban",
        synonym="Eliquis",
        indian_brands=["Eliquis", "Apigat", "Afixar"],
        drug_class="Direct Factor Xa Inhibitor (DOAC)",
    ),
    MedicationConceptRecord(
        rxcui="1114195",
        name="Rivaroxaban",
        synonym="Xarelto",
        indian_brands=["Xarelto", "Rivaros", "Ixarola"],
        drug_class="Direct Factor Xa Inhibitor (DOAC)",
    ),

    # --- Analgesics & Anti-Inflammatory (NSAIDs) ---
    MedicationConceptRecord(
        rxcui="5640",
        name="Ibuprofen",
        synonym="Advil / Motrin",
        indian_brands=["Brufen", "Combiflam", "Ibugesic"],
        drug_class="NSAID",
    ),
    MedicationConceptRecord(
        rxcui="3355",
        name="Diclofenac",
        synonym="Voltaren",
        indian_brands=["Voveran", "Dynapar", "Dicloran"],
        drug_class="NSAID",
    ),
    MedicationConceptRecord(
        rxcui="7258",
        name="Naproxen",
        synonym="Aleve / Naprosyn",
        indian_brands=["Naprosyn", "Xenobid"],
        drug_class="NSAID",
    ),
    MedicationConceptRecord(
        rxcui="161",
        name="Paracetamol",
        synonym="Acetaminophen / Tylenol",
        indian_brands=["Dolo-650", "Calpol", "Crocin", "Pacimol"],
        drug_class="Analgesic / Antipyretic",
    ),
    MedicationConceptRecord(
        rxcui="10689",
        name="Tramadol",
        synonym="Ultram",
        indian_brands=["Tramazac", "Domadol", "Contramal"],
        drug_class="Opioid Analgesic / SNRI Activity",
    ),

    # --- Gastrointestinal / PPIs ---
    MedicationConceptRecord(
        rxcui="7646",
        name="Omeprazole",
        synonym="Prilosec",
        indian_brands=["Omez", "Omee", "Ocid", "Propranol"],
        drug_class="Proton Pump Inhibitor (CYP2C19 Inhibitor)",
    ),
    MedicationConceptRecord(
        rxcui="40790",
        name="Pantoprazole",
        synonym="Protonix",
        indian_brands=["Pan-40", "Pantocid", "Pantodac", "Pan-D"],
        drug_class="Proton Pump Inhibitor",
    ),

    # --- Antimicrobials ---
    MedicationConceptRecord(
        rxcui="2551",
        name="Ciprofloxacin",
        synonym="Cipro",
        indian_brands=["Ciplox", "Cifran", "Ciprobid"],
        drug_class="Fluoroquinolone Antibiotic (CYP1A2 Inhibitor)",
    ),
    MedicationConceptRecord(
        rxcui="18631",
        name="Azithromycin",
        synonym="Zithromax",
        indian_brands=["Azithral", "Azee", "Zady"],
        drug_class="Macrolide Antibiotic",
    ),
    MedicationConceptRecord(
        rxcui="2598",
        name="Clarithromycin",
        synonym="Biaxin",
        indian_brands=["Claribid", "Crixan"],
        drug_class="Macrolide Antibiotic (Potent CYP3A4 Inhibitor)",
    ),
    MedicationConceptRecord(
        rxcui="4450",
        name="Fluconazole",
        synonym="Diflucan",
        indian_brands=["Forcan", "Syscan", "Fluka"],
        drug_class="Triazole Antifungal (CYP2C9/CYP3A4 Inhibitor)",
    ),

    # --- Psychotropics & Neurological ---
    MedicationConceptRecord(
        rxcui="4493",
        name="Fluoxetine",
        synonym="Prozac",
        indian_brands=["Fludac", "Prodep"],
        drug_class="SSRI Antidepressant",
    ),
    MedicationConceptRecord(
        rxcui="321988",
        name="Escitalopram",
        synonym="Lexapro",
        indian_brands=["Nexito", "Cipralex", "Stalopex"],
        drug_class="SSRI Antidepressant",
    ),

    # --- Diagnostic & Special Agents ---
    MedicationConceptRecord(
        rxcui="6038",
        name="Iodinated Radiocontrast",
        synonym="Radiopaque Contrast Media",
        indian_brands=["Omnipaque", "Ultravist", "Visipaque"],
        drug_class="Intravenous Radiopaque Diagnostic Agent",
    ),
    MedicationConceptRecord(
        rxcui="6851",
        name="Methotrexate",
        synonym="Trexall",
        indian_brands=["Folitrax", "Imutrex"],
        drug_class="Antimetabolite / Immunosuppressant",
    ),
]


def normalize_medication_query(query: str) -> List[Dict[str, Any]]:
    """
    Searches the medication catalog matching against generic name, synonyms, or Indian brand names.
    Returns normalized concept records.
    """
    q = query.strip().lower()
    if not q:
        return []

    results = []
    for med in CORE_MEDICATION_CATALOG:
        match_found = False
        # Check generic name
        if q in med.name.lower():
            match_found = True
        # Check standard synonym
        elif med.synonym and q in med.synonym.lower():
            match_found = True
        # Check Indian brands
        else:
            for b in med.indian_brands:
                if q in b.lower():
                    match_found = True
                    break

        if match_found:
            results.append({
                "rxcui": med.rxcui,
                "name": med.name,
                "synonym": f"{med.synonym} / {', '.join(med.indian_brands[:3])}",
                "drug_class": med.drug_class,
                "drug_type": med.drug_type,
            })

    return results


def resolve_to_canonical_ingredient(name_or_brand: str) -> Optional[MedicationConceptRecord]:
    """Resolves an input string (brand or generic) to the canonical concept record."""
    q = name_or_brand.strip().lower()
    for med in CORE_MEDICATION_CATALOG:
        if q == med.name.lower():
            return med
        if med.synonym and q in med.synonym.lower():
            return med
        for b in med.indian_brands:
            if q == b.lower():
                return med
    return None
