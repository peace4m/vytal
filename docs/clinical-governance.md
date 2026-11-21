# VYTAL Clinical Governance & Intended-Use Documentation

**Document Version:** 1.0  
**Effective Date:** November 2026  
**Regulatory Review Status:** **PREPARED FOR QUALIFIED REGULATORY CONSULTANT & LEGAL REVIEW.**  
*Disclaimer: This document specifies the intended operational parameters, clinical literature basis, limitations, and foreseeable risks of the software modules. It does not constitute an independent legal declaration of medical-device exemption.*

---

## 1. Regulatory Context & Overview

Project VYTAL provides explainable, patient-facing decision support and clinical data translation across five discrete computational modules. To support comprehensive evaluation under Software as a Medical Device (SaMD) frameworks (including US FDA CDS Guidance, EU Medical Device Regulation 2017/745, and Indian CDSCO Medical Device Rules 2017), each module is documented below with its:
1. Intended User & Operating Context.
2. Clinical Functionality & Algorithm Class.
3. Intended Literature & Evidence Basis.
4. Known Clinical Limitations.
5. Foreseeable Misuse & Clinical Risks.
6. Mitigations & Mandatory Safety Controls.

---

## 2. Module Intended-Use Statements

### Module 01: LabLens (Laboratory Report Explanation)
* **Intended User:** Adult patients, caregivers, and non-specialist clinicians seeking plain-language explanations of printed laboratory test reports.
* **Functionality:** Extracts analyte names, observed values, measurement units, and printed reference intervals from digital or scanned PDF documents using in-memory parsing. Requires mandatory human verification of extracted values before displaying contextual, literature-backed explanations.
* **Evidence Basis:** Standard clinical chemistry reference ranges and clinical laboratory consensus definitions (CLSI standards).
* **Clinical Limitations:**
  * Extraction relies on optical and structural parsing; non-standard report layouts, hand-written annotations, and damaged scans may result in unparsed or misidentified analytes.
  * Does not account for patient-specific pathophysiological factors (e.g., acute dehydration, pregnancy, circadian fluctuations) unless explicitly supplied.
* **Foreseeable Risks:**
  * Patient misinterpreting a critical panic value (e.g., severe hypoglycemia or hyperkalemia) as non-urgent.
  * Transcription errors during manual confirmation.
* **Mandatory Safety Mitigations:**
  * Mandatory editable confirmation grid before any explanation is generated.
  * Prominent panic-value emergency alerts with instructions to contact the testing laboratory or emergency physician immediately.
  * Explicit disclaimer that report explanations do not constitute a clinical diagnosis.

---

### Module 02: RiskPulse (Cardiometabolic Risk Screening — IDRS)
* **Intended User:** South Asian adults (age 20+) screening for asymptomatic risk of undiagnosed type 2 diabetes.
* **Functionality:** Evaluates the 4-parameter Indian Diabetes Risk Score (IDRS) based on self-reported age, gender-adjusted waist circumference, occupational physical activity, and family history of diabetes. Calculates a deterministic score between 0 and 100.
* **Evidence Basis:** Validated clinical study: Mohan et al., *"A Simplified Indian Diabetes Risk Score for Screening for Undiagnosed Diabetic Subjects in South India (IDRS)"*, *Journal of the Association of Physicians of India* (JAPI), 2005; 53:759–763.
* **Performance Disclosures:** Sensitivity of 72.5% and Specificity of 60.1% at the validated high-risk cut-off score $\ge 60$.
* **Clinical Limitations:**
  * Specifically calibrated for South Asian phenotypes; cannot be generalized to non-Asian populations without re-calibration.
  * Measures statistical probability of undiagnosed dysglycemia, not definitive blood glucose state.
* **Foreseeable Risks:**
  * False reassurance in patients with a low score (<30) who may have other cardiometabolic risk factors.
  * Undue anxiety in patients scoring in the high-risk bracket ($\ge 60$).
* **Mandatory Safety Mitigations:**
  * Mandatory disclosure of sensitivity and specificity metrics alongside the calculated score.
  * Explicit recommendation that high-risk individuals confirm status via standard venous fasting plasma glucose (FPG) or laboratory HbA1c testing.

---

### Module 03: SymptomSense (Deterministic Symptom Triage)
* **Intended User:** Non-clinical individuals experiencing new or changing symptoms seeking structured guidance on appropriate healthcare setting acuity (Emergency Department, Urgent Care, Routine Primary Care, or Self-Care).
* **Functionality:** Executes a deterministic, rule-based clinical decision tree. Prioritizes red-flag symptoms (such as acute central crushing chest pain, signs of stroke, severe respiratory distress, anaphylaxis, or acute maternal complications) and executes strict early short-circuiting to immediate emergency escalation.
* **Evidence Basis:**
  * National Institute for Health and Care Excellence (NICE) Clinical Knowledge Summaries (CKS).
  * World Health Organization Emergency Triage Assessment and Treatment (WHO ETAT) guidelines.
  * American Heart Association / American College of Cardiology (AHA/ACC) acute chest pain pathways.
* **Clinical Limitations:**
  * Cannot perform physical examination, auscultation, or palpation.
  * Relies entirely on patient-selected symptom categories; atypical symptom presentations (e.g., silent myocardial infarction in elderly or diabetic individuals) may evade rule triggers.
* **Foreseeable Risks:**
  * Patient underestimating symptom severity or selecting incorrect symptom terms, leading to delayed emergency presentation.
* **Mandatory Safety Mitigations:**
  * Persistent, prominent red emergency banner with one-click emergency call guidance (108 / 112).
  * Immediate red-flag short-circuiting: If any emergency criterion is met, lower-acuity recommendations are completely suppressed.
  * Safety-netting instructions ("Worsening Advice") displayed on every outcome screen.

---

### Module 04: MedWise (Medication Interaction Checker)
* **Intended User:** Individuals taking multiple prescribed or over-the-counter medications seeking information on documented drug-drug interactions.
* **Functionality:** Normalizes user-entered brand and generic drug names to canonical RxNorm Concept Unique Identifiers (RxCUIs). Cross-references paired combinations against curated clinical interaction databases (including the ONC High-Priority Drug-Drug Interaction dataset).
* **Evidence Basis:**
  * U.S. National Library of Medicine (NLM) RxNorm API.
  * Office of the National Coordinator for Health IT (ONC) High-Priority DDI List.
  * Indian Pharmacopoeia and National Formulary of India drug class mappings.
* **Clinical Limitations:**
  * Does not account for exact patient dosage, renal clearance ($eGFR$), hepatic function, or time-of-day administration spacing.
  * Does not cover unindexed herbal supplements, traditional Ayurvedic/Siddha/Unani formulations, or newly approved chemical entities.
* **Foreseeable Risks:**
  * Patient abruptly discontinuing critical prescribed medications (e.g., anti-epileptics or beta-blockers) upon reading an interaction alert without consulting their prescriber.
  * False confidence that an unlisted combination is completely safe ("Negative Finding Fallacy").
* **Mandatory Safety Mitigations:**
  * Prominent negative finding disclaimer: Absence of an alert does not prove safety.
  * Unambiguous instruction: *"Never modify, discontinue, or alter prescribed medication dosages without direct guidance from your prescribing physician or clinical pharmacist."*

---

### Module 05: Vytal360 (Integrated Personal Health Summary)
* **Intended User:** Patients and healthcare providers desiring a unified, consolidated synthesis of findings generated across LabLens, RiskPulse, SymptomSense, and MedWise.
* **Functionality:** Aggregates verified observations, evaluates cross-module clinical correlations (e.g., elevated fasting glucose combined with high IDRS risk score), assigns overall priority tiers, and generates downloadable clinical PDF briefs via ReportLab.
* **Evidence Basis:** Cross-module clinical correlation matrix authored according to primary care clinical guidelines.
* **Clinical Limitations:**
  * Summary quality directly depends on the completeness and accuracy of user-confirmed data in earlier modules.
* **Foreseeable Risks:**
  * Provider over-relying on automated brief without reviewing original laboratory source documents.
* **Mandatory Safety Mitigations:**
  * Vector PDF brief contains prominent header and footer disclaimers.
  * Every finding cites the underlying evidence source and module verification state.

---

## 3. Machine Learning Subsystem Separation

* **Subsystem:** Early Diabetes Risk Prediction Model (`/ml`)
* **Strict Positioning:** **RESEARCH ONLY — NOT FOR CLINICAL DECISION-MAKING.**
* **Technical Isolation:** Evaluated on the Sylhet Hospital cohort ($n=520$, UCI ID: 529). Model outputs, ROC-AUC comparisons, and SHAP/Gini feature importance visualizers are strictly confined to the `/research-dashboard` route. They are decoupled from the deterministic clinical scoring modules to prevent unvalidated predictive scores from influencing patient decision-making.

---

## 4. Professional Review Sign-Off Tracker

| Review Area | Target Reviewer Profile | Status | Sign-Off Date | Documentation Artifact |
| :--- | :--- | :--- | :--- | :--- |
| **Clinical Decision Logic** | Licensed Physician / Internal Medicine Specialist | Scheduled | Pending | Formal review letter |
| **Regulatory Classification** | Medical Device Regulatory Consultant (CDSCO / SaMD) | Scheduled | Pending | Regulatory assessment report |
| **Medication Data Accuracy** | Clinical Pharmacologist / Doctor of Pharmacy (PharmD) | Scheduled | Pending | Formulary review document |
| **Legal Disclaimers** | Qualified Healthcare Technology Attorney | Scheduled | Pending | Formal terms approval |
