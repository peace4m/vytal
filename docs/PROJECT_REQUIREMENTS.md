# VYTAL: Comprehensive Project Requirements Document

- **Document Version**: 1.0.0
- **Document Status**: Final / Phase 1 Review
- **Author**: VYTAL Architecture & Medical Informatics Group
- **System Classification**: Healthcare Decision-Support & Informatics Research Platform (Non-Device Software Prototype)

---

## 1. Executive Summary & Project Identity

### 1.1 Brand Identity & Purpose
- **Project Name**: VYTAL
- **Tagline**: *Your Health, Decoded.*
- **Formal Title**: *VYTAL: An Explainable, Multilingual Healthcare Decision-Support Platform Integrating Clinical Rules and Machine Learning.*
- **Core Purpose**: To provide individuals and researchers with a transparent, evidence-based, and multilingual system to interpret medical laboratory reports, assess validated demographic health risks, evaluate acute symptom warning signs, review medication interactions, and consolidate health findings. In parallel, it hosts an independent data science research environment for diabetes-risk predictive modeling and explainability.

### 1.2 Target User Personas
1. **The General Public (Patients & Families)**:
   - Needs: Plain-language translation of complex laboratory reports, clear next-step health literacy, non-alarmist explanation of out-of-range biomarkers, warning signs screening.
   - Demographics: Multilingual speakers (English, Hindi, Odia); diverse digital literacy levels.
2. **Students & Healthcare Informatics Researchers**:
   - Needs: Complete algorithmic transparency, inspectable clinical rules, traceable bibliographic citations, decoupled ML research pipelines, explainable AI visualizations (SHAP), and model documentation (Model Cards).

### 1.3 Core Healthcare Safety Invariants & Negative Scope
VYTAL is deliberately engineered under strict clinical, legal, and ethical boundaries:
- **No Diagnostic Claims**: The platform does not determine disease presence or absence.
- **No Prescriptions or Therapy Alterations**: The platform never advises initiating, altering, titrating, or discontinuing any medication.
- **No Medical Device Substitute**: VYTAL is not a medical device (exempt under FDA Non-Device CDS guidance 2022 and EU MDR Annex VIII) and does not replace qualified clinical consultation.
- **Strict Decoupling**: Machine learning predictions are research artifacts and are **never** permitted to override or inform clinical triage rules or emergency detection.
- **Zero Hallucination Tolerance**: The system never imputes, assumes, or invents missing biomarker values, units, or reference ranges.

---

## 2. Functional Requirements by Module

The five healthcare modules must execute in an unalterable sequence:
1. Module 01: Report Explainer
2. Module 02: Indian Diabetes Risk Score (IDRS)
3. Module 03: Symptom Triage
4. Module 04: Medication Interaction Checker
5. Module 05: Health Summary

### 2.1 Module 01: Report Explainer
- **FR-RE-01 (Multi-Modal Intake)**: The system shall support both PDF document upload (max 5 MB) and manual manual entry of laboratory test results.
- **FR-RE-02 (Text & Data Extraction)**: For uploaded digital PDFs, the system shall extract test analyte names, numerical/string values, units of measurement, and laboratory-printed reference ranges using PyMuPDF.
- **FR-RE-03 (Mandatory Confirmation Grid)**: Extracted laboratory data must be presented to the user in an editable review table prior to any interpretation. The user must actively verify, edit, or delete extracted parameters.
- **FR-RE-04 (Reference Range Integrity)**: 
  - The system must display the laboratory's printed reference range alongside the observed value.
  - If no reference range is detected on the user's report, the system shall explicitly display *"Reference range not specified by laboratory"* and shall **never** insert a generic or assumed range as if it originated from the testing laboratory.
  - Standard population reference ranges from verified clinical literature (e.g., AACC, Tietz Textbook of Clinical Chemistry) may be provided in a clearly labeled separate informational card with explicit citations.
- **FR-RE-05 (Multilingual Biomarker Glossaries)**: Explanations of biomarkers (e.g., Fasting Blood Sugar, HbA1c, Serum Creatinine, Lipid Profile, Complete Blood Count) must be provided in simple, patient-friendly English, Hindi, and Odia.
- **FR-RE-06 (Restrained Out-of-Range Highlighting)**: Out-of-range values shall be highlighted with neutral, non-alarmist visual cues (calm amber/teal badges rather than aggressive flashing red banners). Explanations must clarify that out-of-range results can stem from physiological variability, hydration status, fasting state, or laboratory assay variance.
- **FR-RE-07 (Ephemeral Document Handling)**: Uploaded PDF binaries shall be parsed in volatile memory and deleted immediately after extraction confirmation, storing only user-confirmed numeric/text values in session storage.

### 2.2 Module 02: Indian Diabetes Risk Score (IDRS)
- **FR-IDRS-01 (Strict Evidence Grounding)**: The scoring calculation must strictly implement the validated 4-factor formula published by Dr. V. Mohan et al. (*Journal of the Association of Physicians of India*, 2005; 53:759–763).
- **FR-IDRS-02 (Input Parameters & Points)**:
  1. **Age (years)**:
     - $< 35$: 0 points
     - $35 - 49$: 20 points
     - $\ge 50$: 30 points
  2. **Abdominal Obesity (Waist Circumference)**:
     - Female: $< 80\text{ cm}$ (0 points) | $80 - 89\text{ cm}$ (10 points) | $\ge 90\text{ cm}$ (20 points)
     - Male: $< 90\text{ cm}$ (0 points) | $90 - 99\text{ cm}$ (10 points) | $\ge 100\text{ cm}$ (20 points)
  3. **Physical Activity**:
     - Regular vigorous exercise AND strenuous occupational work: 0 points
     - Regular exercise OR strenuous occupational work (moderate): 20 points
     - No exercise AND sedentary occupational work: 30 points
  4. **Family History of Diabetes**:
     - Neither parent diagnosed: 0 points
     - One parent diagnosed: 10 points
     - Both parents diagnosed: 20 points
- **FR-IDRS-03 (Total Score & Stratification)**:
  - Max possible score: 100 points.
  - **Low Risk**: $< 30$ points
  - **Moderate Risk**: $30 - 50$ points
  - **High Risk**: $\ge 60$ points
- **FR-IDRS-04 (Diagnostic Disclaimer & Sensitivity Disclosures)**: The user interface must state that an IDRS $\ge 60$ represents a high screening probability (Sensitivity 72.5%, Specificity 60.1% in the CURES cohort) and is a prompt for screening via fasting blood glucose / HbA1c, NOT a diagnosis of diabetes.
- **FR-IDRS-05 (Multilingual Explanations)**: Interpretive guidance and risk factor lifestyle advice must be fully available in English, Hindi, and Odia.

### 2.3 Module 03: Symptom Triage
- **FR-ST-01 (Deterministic Rule Engine)**: Symptom triage must evaluate symptoms solely through documented, deterministic clinical logic rules derived from established sources (NICE CKS, WHO ETAT, ACEP).
- **FR-ST-02 (Emergency Red-Flag Short-Circuiting)**:
  - Life-threatening symptoms (e.g., crushing chest pain radiating to arm/jaw, acute stroke signs per BE-FAST, stridor/respiratory exhaustion, anaphylaxis, severe acute altered mental state) must be evaluated **first**.
  - Detection of any single emergency red flag must immediately short-circuit evaluation, halt lower-priority routine queries, and trigger an unambiguous emergency action message (e.g., *"Seek immediate emergency medical care / call local emergency services"*).
- **FR-ST-03 (Auditability & Rule Transparency)**: For every triggered recommendation, the system must display:
  - The exact rule name and identifier (e.g., `RULE-EMERG-ACS-001`).
  - The specific user-reported inputs that triggered the rule.
  - The clinical bibliographic citation and evidence level (e.g., NICE Clinical Guideline CG95).
  - The clinical review status and effective revision date.
- **FR-ST-04 (Handling Missing Data & Uncertainty)**: Missing answers must **never** be interpreted as absence of a symptom. If information is incomplete, the system must explicitly present an uncertainty flag indicating that full triage could not be determined.
- **FR-ST-05 (Safety Netting & Reassurance Prohibition)**: The engine shall never output absolute reassurance (e.g., *"You do not have a serious illness"*). It must always provide safety netting instructions (what symptoms to monitor and when to seek urgent care).

### 2.4 Module 04: Medication Interaction Checker
- **FR-MIC-01 (Medication Concept Search & Normalization)**:
  - Users shall search medications by generic or brand names.
  - The backend shall normalize medication names using NIH RxNorm concept identifiers (RxCUI) via the official RxNav REST API or a local curated ontology table.
- **FR-MIC-02 (Pairwise Interaction Evaluation)**:
  - Users may add multiple active medications (minimum 2 to perform an interaction check).
  - The system checks pairs against curated clinical interaction datasets (such as the ONC High-Priority Drug-Drug Interaction List and openFDA Structured Product Labeling drug interaction extracts).
- **FR-MIC-03 (Structured Interaction Output)**: When an interaction is detected, the system displays:
  - Interacting drug pair.
  - Severity classification (e.g., Contraindicated / Severe / Moderate / Informational).
  - Clinical mechanism and documented adverse outcomes.
  - Documented evidence source (e.g., FDA Prescribing Information, ONC Clinical List).
- **FR-MIC-04 (Mandatory Negative Finding Disclaimer)**:
  - If no interaction is found in the database, the system is strictly prohibited from claiming the combination is "safe".
  - The mandated output must state: *"No interaction was found in the available dataset. This does not establish that the combination is safe. Many non-prescription drugs, dietary supplements, and less common medications may have uncatalogued interactions."*
- **FR-MIC-05 (Prescription Non-Interference Clause)**: The interface must display an unmissable warning: *"Never stop, start, or adjust the dose of any prescribed medication without direct consultation with your prescribing physician."*

### 2.5 Module 05: Health Summary
- **FR-HS-01 (Cross-Module Synthesis)**: The summary module must consolidate verified findings from Modules 01 through 04 into a unified, coherent clinical brief.
- **FR-HS-02 (Triage-Ranked Overview)**: Findings must be organized by clinical acuity:
  1. Emergency red flags or critical alerts (if triggered).
  2. Out-of-range laboratory analytes requiring clinical discussion.
  3. Elevated demographic risk scores (IDRS $\ge 60$).
  4. Notable medication interactions.
  5. Routine wellness and preventive health observations.
- **FR-HS-03 (Correlative Synthesis without Medical Causation)**: The engine may identify associative context (e.g., *"Elevated Fasting Blood Sugar observed in laboratory findings correlates with a High Risk IDRS score"*), but shall **never** generate an inferred medical diagnosis (e.g., *"You have diabetes"*).
- **FR-HS-04 (Downloadable PDF Clinical Brief)**:
  - The user can download a clean, structured PDF summary.
  - The PDF must include: Generation timestamp, user-confirmed values, module findings, full bibliographic references, and the bold safety disclaimer.
- **FR-HS-05 (Session Persistence & Privacy Controls)**: Users may clear all entered session data with a single click, triggering complete volatile and database session erasure.

---

## 3. Independent Python/ML Research Engine Requirements

- **FR-ML-01 (Strict Decoupling)**: The ML pipeline exists as an independent research package under `/ml`, with its own dependencies, evaluation notebooks, and data artifacts. It does not touch clinical rule services.
- **FR-ML-02 (Dataset Rigor & South Asian Focus)**:
  - Primary research evaluation shall use benchmark datasets, notably the Sylhet Diabetes Hospital dataset (Islam et al., 2020, South Asian cohort, n=520) and the CDC BRFSS dataset (n=253,680) for large-scale epidemiological comparison.
  - The Pima Indian dataset (n=768) must be explicitly documented regarding its genetic and demographic distinctness from the South Asian population.
- **FR-ML-03 (Benchmarked Algorithms)**:
  1. Logistic Regression (Linear baseline with interpretable odds ratios).
  2. Decision Trees (Rule-extraction and threshold interpretability).
  3. Random Forest (Ensemble non-linear performance benchmark).
  4. Support Vector Machines (Kernel-based boundary analysis).
- **FR-ML-04 (Leakage-Proof ML Lifecycle)**:
  - Strict train/validation/test partitioning (e.g., 70% train, 15% validation, 15% test) with stratified sampling before any imputation, encoding, or feature scaling.
  - 5-Fold Stratified Cross-Validation on training splits.
  - Fixed random seeds (`ML_RANDOM_SEED=42`) for total reproducibility.
- **FR-ML-05 (Exhaustive Evaluation Metrics)**:
  - Accuracy, Balanced Accuracy, Precision, Recall, F1-Score, ROC-AUC, PR-AUC, Confusion Matrix, and Brier Score / Calibration Curves.
- **FR-ML-06 (Explainable AI / SHAP)**:
  - Model explanations using SHAP (SHapley Additive exPlanations).
  - Global feature importance (mean absolute SHAP values) and local explanation plots (waterfall/force plots) for experimental queries.
- **FR-ML-07 (Dedicated Research Dashboard)**:
  - The web application shall provide a dedicated "Research & Analytics Dashboard" partitioned from patient-facing modules.
  - Displays interactive ROC curves, confusion matrices, SHAP summary plots, and Model Cards.

---

## 4. Multilingual & Localization Requirements

- **FR-MLN-01 (Three Launch Languages)**: English (`en`), Hindi (`hi`), and Odia (`or`).
- **FR-MLN-02 (Taxonomic Translation Partitioning)**:
  - Translations must be split into: UI strings, Medical Terminology, Clinical Explanations, Emergency Alerts, and Legal Disclaimers.
- **FR-MLN-03 (Clinical Translation Verification)**:
  - No unvetted automated machine translation is permitted for emergency warnings and clinical triage rules.
  - All clinical explanations must be human-reviewed and version-controlled.
- **FR-MLN-04 (Preserved User State)**: Switching languages in the UI must immediately re-render translated text without resetting user inputs, form state, or confirmed session data.
- **FR-MLN-05 (Native Script Rendering & Typography)**:
  - High-readability font families supporting Devanagari (Hindi) and Odia scripts (e.g., Noto Sans Devanagari, Noto Sans Oriya).

---

## 5. Non-Functional Requirements (NFR)

- **NFR-SEC-01 (Data Minimization & Ephemeral PDF Processing)**: No patient identity (name, government ID, phone number) is required to use the platform. Uploaded PDF files are never stored permanently unless explicitly opted in.
- **NFR-SEC-02 (Secure Input Handling)**: Magic-number file type validation, 5MB file-size cutoff, strict MIME checking, and PyMuPDF text-only extraction without executing embedded macros or active scripts.
- **NFR-ACC-01 (Accessibility)**: Full compliance with WCAG 2.1 Level AA standards. High contrast ratios ($\ge 4.5:1$), full keyboard navigation, screen reader ARIA landmarks, and focus management.
- **NFR-PERF-01 (Performance Benchmarks)**:
  - API response time $< 200\text{ ms}$ for deterministic rule evaluation (IDRS, Symptom Triage, Medication Lookup).
  - PDF text extraction $< 1.5\text{ seconds}$ for reports up to 5 pages.
  - Frontend First Contentful Paint (FCP) $< 1.2\text{ seconds}$ on standard 4G broadband.
- **NFR-MOD-01 (Modularity & Maintainability)**:
  - Modular monolith architecture with strict domain separation.
  - Zero cyclic dependencies between modules.
  - Authoritative clinical logic lives exclusively on the backend.
- **NFR-TEST-01 (Test Coverage)**:
  - 100% test coverage for deterministic scoring algorithms (IDRS) and emergency red-flag triage rules.
  - Integration tests for all `/api/v1/` endpoints using HTTPX and Pytest.
  - Unit tests for all reusable React UI components using Vitest.

---

## 6. Traceability Matrix

| Requirement ID | Module / System Component | Architectural Layer | Primary Evidence / Standard |
| :--- | :--- | :--- | :--- |
| **FR-RE-01..07** | Module 01: Report Explainer | `services/report_explainer/` | AACC Reference Values; PyMuPDF Sandboxed Parser |
| **FR-IDRS-01..05**| Module 02: IDRS | `services/idrs/` | Mohan et al. (JAPI 2005; 53:759–763) |
| **FR-ST-01..05**  | Module 03: Symptom Triage | `services/symptom_triage/` | NICE CKS; WHO ETAT; Emergency Red Flags |
| **FR-MIC-01..05** | Module 04: Medication Checker| `services/medication_checker/`| NLM RxNorm; ONC High-Priority DDI List; openFDA |
| **FR-HS-01..05**  | Module 05: Health Summary | `services/health_summary/` | Clinical synthesis design; ReportLab PDF engine |
| **FR-ML-01..07**  | Research ML Engine | `/ml/` (Standalone Package) | Islam et al. (2020); CDC BRFSS; Lundberg & Lee (SHAP)|
| **FR-MLN-01..05** | Multilingual Engine | `frontend/src/i18n/` | i18next; Unicode 15.0; Odia/Devanagari Typography |
| **NFR-SEC-01..02** | Security & Privacy | `core/security/` | Privacy by Design; HIPAA de-identification standard |
