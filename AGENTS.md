# VYTAL — Engineering & Agent Operational Guidelines (AGENTS.md)

## 1. High-Level Mission & Core Identity
VYTAL is an explainable, multilingual healthcare decision-support platform integrating validated clinical rules and machine learning.
- **Tagline**: *Your Health, Decoded.*
- **Classification**: Educational and research decision-support prototype. **NOT A MEDICAL DEVICE.**
- **Intended Audience**: General public, students, and healthcare informatics researchers.
- **Supported Languages**: English (`en`), Hindi (`hi`), Odia (`or`).

---

## 2. Mandatory Healthcare Safety Invariants (Zero Exceptions)
Every agent working on this repository must enforce these safety rules in code, prompt design, and data processing:
1. **Never Diagnose or Prescribe**: The system never issues a diagnosis, never prescribes therapy, and never instructs users to alter prescribed medications.
2. **Deterministic Emergency Overrides**: Life-threatening emergency red flags (e.g., suspected acute coronary syndrome, stroke, anaphylaxis, severe respiratory distress) must ALWAYS evaluate first and short-circuit any lower-priority assessment.
3. **Strict Partitioning of ML vs. Clinical Logic**: The independent Machine Learning engine is an educational research pipeline. **ML predictions must NEVER override, modify, or inform clinical triage rules or emergency detection.**
4. **No Assumption of Missing Data**: Missing answers or missing lab tests must NEVER be imputed as normal/negative in clinical rules. Explicit uncertainty must be preserved and rendered.
5. **No Synthetic Reference Ranges**: Report explainer must NEVER hallucinate or assume lab reference ranges. If a laboratory does not provide a reference range, label it as "Laboratory reference range not stated on report."
6. **Interaction Check Limitations**: Never claim a drug pair is "safe" because no interaction was found. The mandated phrasing is: *"No interaction was found in the available dataset. This does not establish that the combination is safe."*
7. **No Fabricated Medical Claims or Statistics**: All clinical scoring (such as the Indian Diabetes Risk Score) must strictly match peer-reviewed source literature (Mohan et al., 2005).

---

## 3. Mandatory Module Sequence
Throughout UI, API routes, database models, and documentation, the five modules MUST maintain this exact sequence:
1. **Module 01: Report Explainer** (`report-explainer` / `report_explainer`)
2. **Module 02: Indian Diabetes Risk Score** (`risk-score` / `idrs`)
3. **Module 03: Symptom Triage** (`symptom-triage` / `symptom_triage`)
4. **Module 04: Medication Interaction Checker** (`medication-check` / `medication_checker`)
5. **Module 05: Health Summary** (`health-summary` / `health_summary`)

The **Independent Python/ML Research Engine** resides separately under `/ml` and provides an isolated research dashboard.

---

## 4. Architectural Rules
- **Modular Monolith**: Clean boundaries between presentation, REST API (`/api/v1/`), service layer, clinical rules, and persistence.
- **Backend as Source of Truth**: Frontend never executes authoritative clinical rules, risk scores, or triage logic. All calculations occur in backend Pydantic/SQLAlchemy services.
- **Stateless & Privacy-First**: Do not persist raw PDF binaries by default. Process text in-memory or ephemeral storage, present extracted values for user confirmation, and delete raw artifacts.
- **Type Safety**: Full TypeScript in frontend (`strict: true`), Pydantic models for all backend payloads, and SQLAlchemy 2.0 type annotations.
- **Multilingual Separation**: Keep UI strings, medical terms, clinical explanations, emergency alerts, and safety disclaimers cleanly partitioned in JSON translation catalogs (`en`, `hi`, `or`).

---

## 5. Development Workflow & Phasing
Agents must strictly follow the sequential phase lifecycle:
- **Phase 1**: Research, evidence verification, planning documentation (ACTIVE).
- **Phase 2**: Frontend & Backend foundations, database schema, API contracts.
- **Phase 3**: Module 01 (Report Explainer) & Module 02 (IDRS).
- **Phase 4**: Module 03 (Symptom Triage) & Module 04 (Medication Checker).
- **Phase 5**: Module 05 (Health Summary) & synthesis.
- **Phase 6**: Independent Python/ML research pipeline & analytics dashboard.
- **Phase 7**: Multilingual localization, accessibility (WCAG 2.1 AA), end-to-end testing.
- **Phase 8**: Research evaluation, documentation, final publication readiness.

**Stop Condition**: Agents must NEVER jump across phases or generate application code during Phase 1 without explicit human sign-off.
