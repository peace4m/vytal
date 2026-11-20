# VYTAL: RESTful API Architecture & Endpoint Specification

- **Document Version**: 1.0.0
- **Document Status**: Final / Phase 1 Review
- **Base URL**: `/api/v1`
- **Protocol**: HTTPS / REST / JSON
- **Schema Engine**: Pydantic v2 / OpenAPI 3.1
- **Error Standard**: RFC 7807 Problem Details

---

## 1. Global API Standards & Conventions

### 1.1 Content Negotiation & Encoding
- All endpoints accept and produce `application/json; charset=utf-8`, except file upload endpoints which accept `multipart/form-data` and PDF export which returns `application/pdf`.
- All timestamps are serialized in ISO 8601 format (`YYYY-MM-DDTHH:MM:SSZ`).
- Identifiers are formatted as UUIDv4 strings.

### 1.2 Session Management Header
Clients pass the session token via a standard HTTP header or query parameter:
```http
X-Session-Token: 4a3f2c1b-9e8d-4f7a-b5c6-d1e2f3a4b5c6
```

### 1.3 Standard Error Format (RFC 7807)
All error responses (HTTP $4xx$ and $5xx$) follow the RFC 7807 specification:
```json
{
  "type": "https://vytal.health/errors/validation-error",
  "title": "Unprocessable Entity",
  "status": 422,
  "detail": "Waist circumference must be between 30.0 and 250.0 cm.",
  "instance": "/api/v1/idrs/calculate",
  "invalid_params": [
    {
      "name": "waist_circumference_cm",
      "reason": "Value 25.0 is below minimum threshold of 30.0"
    }
  ],
  "timestamp": "2026-11-21T01:30:00Z"
}
```

---

## 2. API Endpoint Directory

```
/api/v1
├── /sessions
│   ├── POST   /sessions/new                      # Create anonymous session
│   ├── GET    /sessions/{token}                  # Get session state
│   └── DELETE /sessions/{token}                  # Purge all session data
│
├── /reports (Module 01: Report Explainer)
│   ├── POST   /reports/upload                    # Upload PDF for extraction
│   ├── POST   /reports/parse-manual              # Parse manually entered lab tests
│   ├── POST   /reports/confirm                   # Confirm extracted lab observations
│   └── GET    /reports/{report_id}/observations  # Retrieve confirmed observations
│
├── /idrs (Module 02: Indian Diabetes Risk Score)
│   ├── POST   /idrs/calculate                    # Compute validated IDRS score
│   └── GET    /idrs/metadata                     # Retrieve published methodology details
│
├── /triage (Module 03: Symptom Triage)
│   ├── GET    /triage/questions                  # Get structured symptom question tree
│   ├── POST   /triage/evaluate                   # Execute deterministic rule triage
│   └── GET    /triage/rules                      # List auditable clinical rules
│
├── /medications (Module 04: Medication Interaction Checker)
│   ├── GET    /medications/search                # Query drugs with RxNorm normalization
│   └── POST   /medications/check                 # Run pairwise interaction checks
│
├── /summary (Module 05: Health Summary)
│   ├── POST   /summary/generate                  # Synthesize findings across all modules
│   └── POST   /summary/export-pdf                # Generate downloadable clinical PDF
│
├── /i18n (Multilingual Engine)
│   └── GET    /i18n/catalogs/{lang}              # Fetch localized translation catalog
│
└── /research (Independent ML Research Subsystem)
    ├── GET    /research/datasets                 # List benchmark datasets & provenance
    ├── GET    /research/models                   # List trained models & evaluation metrics
    ├── GET    /research/model-card/{model_id}    # Retrieve model card & ethical boundaries
    └── POST   /research/predict-experimental     # Run experimental inference with SHAP
```

---

## 3. Detailed Endpoint Contracts

### 3.1 Session Management

#### `POST /api/v1/sessions/new`
Creates a new anonymous privacy-preserving session.

**Response `201 Created`**:
```json
{
  "session_token": "4a3f2c1b-9e8d-4f7a-b5c6-d1e2f3a4b5c6",
  "created_at": "2026-11-21T01:30:00Z",
  "expires_at": "2026-11-22T01:30:00Z",
  "preferred_language": "en"
}
```

#### `DELETE /api/v1/sessions/{token}`
Purges all data associated with the session immediately.

**Response `200 OK`**:
```json
{
  "status": "purged",
  "message": "All session data and confirmed observations have been permanently deleted."
}
```

---

### 3.2 Module 01: Report Explainer

#### `POST /api/v1/reports/upload`
Uploads a digital PDF report (max 5 MB). The backend extracts text using PyMuPDF and returns structured candidates. The raw file is unlinked immediately.

**Headers**: `Content-Type: multipart/form-data`, `X-Session-Token: <token>`

**Response `200 OK`**:
```json
{
  "report_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "laboratory_name": "Apollo Diagnostics (Inferred)",
  "report_date": "2026-10-15",
  "extracted_items": [
    {
      "temp_id": "item-1",
      "analyte_name": "Fasting Blood Sugar (Glucose)",
      "observed_value": 126.0,
      "observed_value_str": "126 mg/dL",
      "unit": "mg/dL",
      "lab_reference_range": "70 - 100 mg/dL",
      "ref_range_low": 70.0,
      "ref_range_high": 100.0,
      "status_flag": "HIGH",
      "extraction_confidence": 0.94
    },
    {
      "temp_id": "item-2",
      "analyte_name": "HbA1c (Glycated Hemoglobin)",
      "observed_value": 6.8,
      "observed_value_str": "6.8 %",
      "unit": "%",
      "lab_reference_range": "< 5.7 %",
      "ref_range_low": null,
      "ref_range_high": 5.7,
      "status_flag": "HIGH",
      "extraction_confidence": 0.96
    }
  ],
  "disclaimer": "Verify all extracted values against your original paper report before confirming."
}
```

#### `POST /api/v1/reports/confirm`
User submits verified and edited observations to persist them under the session.

**Request Body**:
```json
{
  "report_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "confirmed_items": [
    {
      "analyte_name": "Fasting Blood Sugar (Glucose)",
      "observed_value": 126.0,
      "unit": "mg/dL",
      "lab_reference_range": "70 - 100 mg/dL",
      "status_flag": "HIGH"
    },
    {
      "analyte_name": "HbA1c (Glycated Hemoglobin)",
      "observed_value": 6.8,
      "unit": "%",
      "lab_reference_range": "< 5.7 %",
      "status_flag": "HIGH"
    }
  ]
}
```

**Response `200 OK`**:
```json
{
  "report_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "is_user_confirmed": true,
  "explanations": [
    {
      "analyte_name": "Fasting Blood Sugar (Glucose)",
      "observed_value_str": "126.0 mg/dL",
      "status": "HIGH",
      "explanation": "Your blood glucose level measured after an overnight fast is higher than the standard laboratory reference range. This can be caused by food intake, physical stress, illness, or metabolic factors.",
      "safety_note": "A single elevated fasting blood glucose test does not diagnose diabetes. A repeat test or clinical assessment by a doctor is required."
    }
  ]
}
```

---

### 3.3 Module 02: Indian Diabetes Risk Score (IDRS)

#### `POST /api/v1/idrs/calculate`
Calculates the validated IDRS based on Mohan et al. (2005).

**Request Body**:
```json
{
  "age": 48,
  "gender": "male",
  "waist_circumference_cm": 94.0,
  "physical_activity_tier": "moderate",
  "family_history_tier": "one_parent"
}
```

**Response `200 OK`**:
```json
{
  "assessment_id": "3c7b2e1a-8f9d-4e5a-b6c7-d8e9f0a1b2c3",
  "breakdown": {
    "age_input": 48,
    "age_tier": "35-49 years",
    "age_points": 20,
    "gender": "male",
    "waist_circumference_cm": 94.0,
    "waist_tier": "90-99 cm",
    "waist_points": 10,
    "physical_activity_tier": "moderate",
    "activity_description": "Regular exercise OR strenuous work",
    "activity_points": 20,
    "family_history_tier": "one_parent",
    "family_history_description": "One parent diagnosed with diabetes",
    "family_history_points": 10
  },
  "total_score": 60,
  "risk_category": "high",
  "clinical_context": {
    "risk_label": "High Risk (Score >= 60)",
    "interpretation": "A score of 60 or higher indicates a significant probability of undiagnosed diabetes or prediabetes based on the Chennai Urban Rural Epidemiology Study (CURES).",
    "sensitivity": "72.5%",
    "specificity": "60.1%",
    "recommendation": "It is advised to undergo definitive blood testing (Fasting Blood Glucose or HbA1c) in consultation with a qualified medical professional.",
    "bibliographic_citation": "Mohan V, Deepa R, Deepa M, Somannavar S, Datta M. A simplified Indian Diabetes Risk Score for screening for undiagnosed diabetic subjects. J Assoc Physicians India. 2005 Sep;53:759-63."
  }
}
```

---

### 3.4 Module 03: Symptom Triage

#### `POST /api/v1/triage/evaluate`
Evaluates symptoms through deterministic clinical rules with emergency red-flag precedence.

**Request Body**:
```json
{
  "primary_symptoms": ["chest_pain", "shortness_of_breath"],
  "symptom_attributes": {
    "chest_pain_nature": "crushing_pressure",
    "radiates_to_jaw_or_left_arm": true,
    "sudden_onset": true,
    "duration_minutes": 45,
    "associated_sweating": true
  },
  "patient_context": {
    "age": 52,
    "has_cardiac_history": false
  }
}
```

**Response `200 OK` (Emergency Red Flag Triggered)**:
```json
{
  "triage_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "primary_acuity": "EMERGENCY",
  "emergency_override_triggered": true,
  "action_required": "SEEK IMMEDIATE EMERGENCY MEDICAL CARE / CALL 108 OR 112",
  "triggered_rules": [
    {
      "rule_id": "RULE-EMERG-ACS-001",
      "rule_name": "Suspected Acute Coronary Syndrome (ACS) Red Flag",
      "priority": "EMERGENCY_RED_FLAG",
      "evidence_source": "NICE Clinical Guideline CG95 (Chest Pain of Recent Onset) & WHO ETAT",
      "reason": "Crushing chest pain radiating to jaw/arm accompanied by acute shortness of breath and diaphoresis."
    }
  ],
  "safety_netting": "Do not drive yourself to the hospital. Rest quietly while emergency services are en route. If prescribed sublingual nitroglycerin by your physician, take as directed.",
  "uncertainty_notes": []
}
```

---

### 3.5 Module 04: Medication Interaction Checker

#### `GET /api/v1/medications/search?q=metformin`
Searches medications with generic/brand normalization via RxNorm concepts.

**Response `200 OK`**:
```json
{
  "query": "metformin",
  "results": [
    {
      "rxcui": "6809",
      "name": "Metformin",
      "synonym": "Glucophage",
      "drug_type": "Ingredient",
      "clinical_class": "Biguanide Oral Hypoglycemic"
    }
  ]
}
```

#### `POST /api/v1/medications/check`
Performs pairwise interaction check for two or more normalized medications.

**Request Body**:
```json
{
  "medications": [
    { "name": "Metformin", "rxcui": "6809" },
    { "name": "Iodinated Radiocontrast", "rxcui": "6038" }
  ]
}
```

**Response `200 OK`**:
```json
{
  "check_id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
  "total_medications": 2,
  "interaction_count": 1,
  "has_severe_warning": true,
  "interactions": [
    {
      "drug_a": "Metformin",
      "drug_b": "Iodinated Radiocontrast",
      "severity": "SEVERE",
      "clinical_description": "Administration of intravascular iodinated radiocontrast in patients taking metformin can lead to acute renal impairment and subsequent accumulation of metformin, increasing the risk of potentially fatal lactic acidosis.",
      "evidence_source": "FDA Prescribing Information & American College of Radiology (ACR) Contrast Manual",
      "management_guidance": "Metformin is typically withheld prior to or at the time of intravascular contrast imaging and resumed 48 hours post-procedure after renal function is verified."
    }
  ],
  "mandatory_disclaimer": "No interaction was found for unspecified combinations. This does not establish that the combination is safe. Never stop, start, or adjust medications without consulting your prescribing healthcare provider."
}
```

---

### 3.6 Module 05: Health Summary

#### `POST /api/v1/summary/generate`
Synthesizes findings across active modules into a structured clinical overview.

**Headers**: `X-Session-Token: <token>`

**Response `200 OK`**:
```json
{
  "summary_id": "8f7e6d5c-4b3a-2109-8765-43210fedcba9",
  "generated_at": "2026-11-21T01:35:00Z",
  "highest_acuity": "HIGH",
  "synthesis_items": [
    {
      "category": "Laboratory Findings",
      "severity": "ELEVATED",
      "title": "Elevated Fasting Blood Sugar (126 mg/dL)",
      "details": "Exceeds standard reference range (70-100 mg/dL). User verified."
    },
    {
      "category": "Screening Score",
      "severity": "HIGH",
      "title": "High Indian Diabetes Risk Score (IDRS: 60/100)",
      "details": "Age and abdominal waist circumference contribute to elevated screening probability."
    },
    {
      "category": "Clinical Correlation",
      "severity": "NOTEWORTHY",
      "title": "Metabolic Screening Concordance",
      "details": "Elevated fasting glucose aligns with an elevated demographic IDRS score. Clinical evaluation with diagnostic HbA1c is strongly encouraged.",
      "boundary_notice": "Correlation is not a diagnosis. A medical doctor must perform a clinical examination."
    }
  ],
  "pdf_export_url": "/api/v1/summary/export-pdf"
}
```

---

### 3.7 Independent ML Research Engine

#### `GET /api/v1/research/models`
Returns research metrics and calibration figures for all benchmarked algorithms.

**Response `200 OK`**:
```json
{
  "dataset": "UCI 529 (Early Stage Diabetes Risk Prediction, Islam et al. 2020)",
  "cohort_size": 520,
  "models": [
    {
      "model_id": "logreg-v1",
      "algorithm": "Logistic Regression (L2 Regularized)",
      "accuracy": 0.932,
      "precision": 0.941,
      "recall": 0.952,
      "f1_score": 0.946,
      "roc_auc": 0.978,
      "brier_score": 0.052,
      "cv_strategy": "Stratified 5-Fold Cross-Validation"
    },
    {
      "model_id": "rf-v1",
      "algorithm": "Random Forest (n_estimators=100, max_depth=6)",
      "accuracy": 0.971,
      "precision": 0.975,
      "recall": 0.981,
      "f1_score": 0.978,
      "roc_auc": 0.994,
      "brier_score": 0.028,
      "cv_strategy": "Stratified 5-Fold Cross-Validation"
    }
  ]
}
```
