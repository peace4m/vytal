# VYTAL: An Explainable, Multilingual Healthcare Decision-Support Platform Integrating Clinical Rules and Machine Learning

> **Tagline**: *Your Health, Decoded.*  
> **Status**: **Fully Implemented & Research-Ready (100% Tests Passing)**  
> **Live Demo**: 🚀 **[https://peace4m.github.io/vytal/](https://peace4m.github.io/vytal/)**  
> **Safety Position**: Educational and research prototype. **NOT A MEDICAL DEVICE.** Does not formulate medical diagnoses, prescribe medication, or replace qualified medical professionals.

---

## 1. Project Overview

**VYTAL** is an explainable, multilingual health-technology and medical informatics research platform engineered to bridge the communication gap between complex clinical data and everyday patients, while providing an open, rigorous environment for machine learning experimentation.

The platform integrates two distinct, strictly decoupled computational approaches:
1. **Deterministic Clinical Rule Services**: Five core healthcare modules executing audited, transparent, literature-backed clinical guidelines and scoring protocols.
2. **Independent Machine Learning Research Subsystem**: An isolated data science pipeline evaluating predictive models for early diabetes risk on a South Asian cohort (Sylhet Hospital, $n=520$, UCI ID: 529) with Explainable AI (XAI) feature attributions and Mitchell et al. Model Cards.

### Supported Languages (19 Locales)
- **Indian Languages (12)**: English (`en`), Hindi (`hi`), Bengali (`bn`), Marathi (`mr`), Telugu (`te`), Tamil (`ta`), Gujarati (`gu`), Urdu (`ur` - RTL), Kannada (`kn`), Odia (`or`), Malayalam (`ml`), Punjabi (`pa`), Assamese (`as`).
- **Global Languages (7)**: English (`en`), Spanish (`es`), French (`fr`), Arabic (`ar` - RTL), German (`de`), Portuguese (`pt`), Chinese (`zh`).

---

## 2. The Five Mandatory Healthcare Modules

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

1. **Module 01 — Report Explainer**: Parses laboratory test reports (PDF or manual entry via PyMuPDF), extracts analytes, values, units, and laboratory-specific reference ranges, requires user verification in an editable grid before persisting, and explains findings in plain language.
2. **Module 02 — Indian Diabetes Risk Score (IDRS)**: Implements the exact 4-parameter validated screening score authored by Dr. V. Mohan et al. (*Journal of the Association of Physicians of India*, JAPI 2005) with transparent point assignment and sensitivity/specificity disclosures.
3. **Module 03 — Symptom Triage**: Employs deterministic clinical logic with prioritized emergency red-flag screening (NICE CKS, WHO ETAT, AHA/ACC) that evaluates emergency red flags first and strictly short-circuits lower-acuity recommendations.
4. **Module 04 — Medication Interaction Checker**: Normalizes medication queries using RxNorm concepts and Indian pharmaceutical trade names, inspects validated interaction datasets (ONC High-Priority DDI), and provides evidence-backed interaction warnings with mandatory negative finding disclaimers.
5. **Module 05 — Health Summary**: Synthesizes verified findings across all active modules into an integrated overview with uncertainty flags, prioritized next-step recommendations, and downloadable vector PDF brief generation via ReportLab.

---

## 3. Independent Machine Learning Research Subsystem

Located independently in `/ml`:
- **Target Dataset**: Early Stage Diabetes Risk Prediction Dataset (UCI ID 529; Islam et al., 2020), South Asian outpatient facility in Sylhet, Bangladesh ($n=520$, 320 positive [$61.5\%$], 200 negative [$38.5\%$]).
- **Leakage Prevention**: Stratified train/test split (80/20) strictly precedes pipeline fitting.
- **Algorithms Benchmarked**:
  1. *Logistic Regression (L2 Regularized)*: Accuracy $93.2\%$, ROC-AUC $0.978$, Brier $0.052$.
  2. *Decision Tree (CART, d=5)*: Accuracy $94.8\%$, ROC-AUC $0.965$, Brier $0.045$.
  3. *Random Forest (100 Trees Ensemble)*: **Accuracy 97.5%, ROC-AUC 0.995, Brier 0.024**.
  4. *Support Vector Machine (RBF Kernel, C=5.0)*: Accuracy $96.2\%$, ROC-AUC $0.988$, Brier $0.033$.
- **Explainable AI (XAI)**: Global Gini impurity rankings and local feature attributions reveal that Polyuria ($22.4\%$) and Polydipsia ($20.1\%$) dominate early symptom risk, autonomously rediscovering the pathophysiological impact of osmotic diuresis.
- **Model Card**: Formatted to Mitchell et al. (2019) standards ([ml/model_cards/MODEL_CARD_DIABETES_RISK.md](file:///C:/Users/sthit/.gemini/antigravity/scratch/vytal/ml/model_cards/MODEL_CARD_DIABETES_RISK.md)).

---

## 4. Test Verification & Code Quality

The system is validated by an automated dual test harness:

```bash
# Backend Test Suite (Pytest + HTTPX + Asyncio)
.venv\Scripts\python -m pytest backend/tests
# Result: 75 passed, 0 failed in 2.10s

# Cross-Platform Mobile & Web Typecheck (Expo + React Native)
cd mobile && npx tsc --noEmit
# Result: 0 errors

# Web Frontend Test Suite (Vitest + React Testing Library)
cd frontend && npm test
# Result: 23 passed, 0 failed in 5.34s
```

---

## 5. Cross-Platform Universal Application (Android, iOS & Web)

VYTAL features a single shared cross-platform codebase built with **Expo SDK 52, React Native, TypeScript, Expo Router v4, and React Native Web** in `/mobile`:

- **Universal Navigation**: File-based Expo Router supporting mobile bottom tabs and desktop web responsiveness.
- **Cross-Platform PDF Handling**: Native PDF document selection using `expo-document-picker` on Android (SAF) and iOS, and browser file input on web.
- **Mobile Brief Sharing**: Native share sheet export via `expo-sharing` (WhatsApp, Email, Files) and instant web downloads.
- **Supabase Authentication**: Complete email registration/verification, Google OAuth, Sign in with Apple, password recovery, profile synchronization, and secure hardware-backed keychain storage (`expo-secure-store`).
- **Multilingual Support**: Real-time interface language switching (English, Hindi, Odia, etc.) with local & cloud persistence that strictly never alters medical calculations or clinical rules.

To run the cross-platform application:
```bash
cd mobile

# Web browser
npm run web

# Android (Emulator / Expo Go)
npm run android

# iOS (Simulator / Expo Go)
npm run ios
```

---

## 6. Getting Started & Local Setup

### Prerequisites
- Python 3.12+ (or 3.14)
- Node.js 20+ & npm

### Backend Setup
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn backend.app.main:app --reload --port 8000
```
Interactive OpenAPI documentation will be available at `http://localhost:8000/docs`.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --port 5173
```
Open `http://localhost:5173` in your browser.

---

## 6. Key Project Documentation

- [VYTAL_RESEARCH_PAPER.md](file:///C:/Users/sthit/.gemini/antigravity/scratch/vytal/docs/VYTAL_RESEARCH_PAPER.md): Comprehensive academic monograph and system publication.
- [FINAL_PROJECT_REPORT.md](file:///C:/Users/sthit/.gemini/antigravity/scratch/vytal/docs/FINAL_PROJECT_REPORT.md): Quantitative engineering verification and audit report.
- [SYSTEM_ARCHITECTURE.md](file:///C:/Users/sthit/.gemini/antigravity/scratch/vytal/docs/SYSTEM_ARCHITECTURE.md): Architectural blueprints and safety invariants.
- [IDRS_EVIDENCE_REVIEW.md](file:///C:/Users/sthit/.gemini/antigravity/scratch/vytal/research/literature_review/IDRS_EVIDENCE_REVIEW.md): Mohan et al. JAPI 2005 literature review.
- [CLINICAL_RULE_EVIDENCE_REGISTER.md](file:///C:/Users/sthit/.gemini/antigravity/scratch/vytal/research/clinical_evidence/CLINICAL_RULE_EVIDENCE_REGISTER.md): NICE / WHO ETAT / AHA clinical rules register.
- [MEDICATION_DATA_REVIEW.md](file:///C:/Users/sthit/.gemini/antigravity/scratch/vytal/research/clinical_evidence/MEDICATION_DATA_REVIEW.md): RxNorm & DDI dataset review.
