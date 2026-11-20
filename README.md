# VYTAL: An Explainable, Multilingual Healthcare Decision-Support Platform Integrating Clinical Rules and Machine Learning

> **Tagline**: *Your Health, Decoded.*  
> **Status**: **Phase 1 Complete (Research, Evidence Verification & Architecture)** — Awaiting Phase 2 Approval.  
> **Safety Position**: Educational and research prototype. **NOT A MEDICAL DEVICE.** Does not diagnose, prescribe, or replace professional medical consultation.

---

## 1. Project Overview

VYTAL is a health-technology and medical informatics research platform engineered to bridge the communication gap between complex clinical data and everyday patients, while providing an open, rigorous environment for machine learning experimentation.

The platform integrates two distinct, strictly decoupled computational approaches:
1. **Deterministic Clinical Rule Services**: Five core healthcare modules executing audited, transparent, literature-backed clinical guidelines and scoring protocols.
2. **Independent Machine Learning Research Engine**: An isolated data science pipeline evaluating predictive models for diabetes risk against international South Asian and epidemiological benchmark datasets with SHAP explainability.

### Supported Languages
- **English (`en`)**
- **Hindi (`hi`)** — हिन्दी
- **Odia (`or`)** — ଓଡ଼ିଆ

Extensible architecture allows frictionless onboarding of additional regional languages.

---

## 2. The Five Healthcare Modules

The core application structures its decision-support workflows into five sequential modules:

```
[Module 01: Report Explainer]
           ↓
[Module 02: Indian Diabetes Risk Score (IDRS)]
           ↓
[Module 03: Symptom Triage]
           ↓
[Module 04: Medication Interaction Checker]
           ↓
[Module 05: Health Summary]
```

1. **Module 01 — Report Explainer**: Parses laboratory test reports (PDF or manual entry via PyMuPDF), extracts analytes, values, units, and laboratory-specific reference ranges, requires user verification of extracted data, and explains findings in plain language.
2. **Module 02 — Indian Diabetes Risk Score (IDRS)**: Implements the exact 4-parameter validated screening score authored by Dr. V. Mohan et al. (JAPI 2005) with transparent point assignment and sensitivity/specificity disclosures.
3. **Module 03 — Symptom Triage**: Employs deterministic clinical logic with prioritized emergency red-flag screening (NICE CKS, WHO ETAT) that short-circuits lower-acuity recommendations.
4. **Module 04 — Medication Interaction Checker**: Normalizes medication queries using RxNorm concepts, inspects validated interaction datasets and openFDA drug label extracts, and provides evidence-backed interaction warnings with mandatory coverage limitation disclaimers.
5. **Module 05 — Health Summary**: Synthesizes verified findings across all active modules into an integrated overview with uncertainty flags, prioritized next-step recommendations, and downloadable PDF generation.

---

## 3. Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, React Router v7, TanStack Query v5, i18next, Lucide React.
- **Backend**: Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, PyMuPDF (fitz), ReportLab (PDF generation).
- **Machine Learning & Research**: Scikit-Learn, Pandas, NumPy, SciPy, SHAP, Plotly, Joblib.
- **Database**: PostgreSQL 16 (persistent production), SQLite (automated testing).
- **Testing**: Pytest & HTTPX (backend), Vitest & React Testing Library (frontend), Playwright (E2E).

---

## 4. Repository Structure

```
vytal/
├── docs/                                  # Architectural specifications & requirements
│   ├── PROJECT_REQUIREMENTS.md            # Comprehensive project requirements
│   ├── SYSTEM_ARCHITECTURE.md             # System architecture & sequence diagrams
│   ├── DATABASE_DESIGN.md                 # PostgreSQL relational schema & policies
│   ├── API_DESIGN.md                      # OpenAPI REST API specifications
│   ├── IMPLEMENTATION_ROADMAP.md          # Multi-phase engineering roadmap
│   └── PHASE1_REPORT.md                   # Formal Phase 1 sign-off report
├── research/                              # Clinical evidence, literature & ML research
│   ├── literature_review/
│   │   └── IDRS_EVIDENCE_REVIEW.md        # Comprehensive IDRS literature review
│   ├── clinical_evidence/
│   │   ├── CLINICAL_RULE_EVIDENCE_REGISTER.md # Clinical rule register & red flags
│   │   └── MEDICATION_DATA_REVIEW.md      # RxNorm & interaction source review
│   ├── methodology/
│   │   ├── ML_RESEARCH_PLAN.md            # ML research design & model cards
│   │   ├── MULTILINGUAL_PLAN.md           # Localization & language taxonomy
│   │   └── RESEARCH_METHODOLOGY.md        # Academic research methodology & evaluation
│   └── ethics/
│       └── SECURITY_AND_PRIVACY_REVIEW.md # Threat model, privacy & compliance
├── .env.example                           # Configuration environment template
├── .gitignore                             # Git ignore rules
├── AGENTS.md                              # Safety invariants and agent rules
└── README.md                              # Project entrypoint documentation
```

---

## 5. Development Status & Next Steps

Phase 1 (Research, Evidence Verification, and System Architecture) is 100% complete. In strict adherence to our safety protocol, all application coding, API implementation, database migrations, and model training are suspended pending human technical review and approval of the Phase 1 Deliverables.
