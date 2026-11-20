# Model Card: VYTAL Machine Learning Early-Stage Diabetes Risk Predictor

- **Model Identifier**: `vytal-ml-diabetes-risk-v1`
- **Model Version**: 1.0.0
- **Model Release Date**: 2026-11-21
- **Model Architecture**: Ensemble (Random Forest 100 Trees) & Interpretable Linear Baseline (L2 Regularized Logistic Regression)
- **Framework**: Scikit-Learn 1.6 / Python 3.14
- **Specification Standard**: Mitchell et al. (2019) *Model Cards for Model Reporting* (FAT* '19)

---

## 1. Intended Use

### 1.1 Primary Intended Uses
- Academic and healthcare informatics research benchmarking.
- Comparative evaluation of machine learning algorithms on South Asian clinical symptom cohorts.
- Exploration of explainable AI (XAI) feature attribution methods (Gini Impurity Importance and Linear Attribution) in pre-diagnostic risk awareness.

### 1.2 Primary Intended Users
- Health informatics researchers.
- Medical and computer science students.
- Clinical decision-support system evaluators.

### 1.3 Out-of-Scope and Prohibited Uses
- **STANDALONE CLINICAL DIAGNOSIS**: This model is an experimental research prototype and MUST NEVER be used as a standalone diagnostic device or clinical diagnostic conclusion.
- **MEDICATION INTERVENTION**: This model is strictly prohibited from being used to prescribe, initiate, titrate, or discontinue any pharmaceutical product.
- **EMERGENCY OVERRIDE**: This machine learning subsystem is strictly segregated from deterministic clinical triage rules and MUST NEVER override emergency red-flag protocols.

---

## 2. Factors & Demographic Context

- **Target Population**: Adults screened at outpatient diabetes facilities.
- **Demographic Dimensions**:
  - Age: 16 to 90 years.
  - Gender: Male (58-63%) and Female (37-42%).
- **Clinical Predictor Features (16 Total)**:
  - Age, Gender, Polyuria, Polydipsia, Sudden Weight Loss, Weakness, Polyphagia, Genital Thrush, Visual Blurring, Itching, Irritability, Delayed Healing, Partial Paresis, Muscle Stiffness, Alopecia, Obesity.

---

## 3. Metrics & Performance Measures

Evaluated using **Stratified 5-Fold Cross-Validation** with fixed random seed (42) to guarantee zero data leakage between training folds and holdout validation sets:

| Metric | Target Clinical Objective |
| :--- | :--- |
| **Recall / Sensitivity** | High priority to minimize false negatives in pre-screening. |
| **Precision (PPV)** | High positive predictive value to limit unnecessary anxiety. |
| **F1-Score** | Harmonic mean balancing recall and precision under 61.5% positive prevalence. |
| **ROC-AUC** | Area under Receiver Operating Characteristic curve measuring rank discrimination. |
| **Brier Score** | Mean squared difference between predicted probability and actual binary outcome (Calibration). |

---

## 4. Evaluation Data & Provenance

- **Primary Dataset**: Early Stage Diabetes Risk Prediction Dataset (UCI Machine Learning Repository, ID: 529).
- **Primary Source**: Islam, M. M. F., Ferdousi, R., Rahman, S., & Bushra, H. Y. (2020). *Likelihood prediction of diabetes at early stage using data mining techniques*. Computer Methods and Programs in Biomedicine, 195, 105682.
- **Clinical Site**: Sylhet Diabetes Hospital, Sylhet, Bangladesh.
- **Cohort Size**: 520 verified clinical records.
- **Prevalence**: 320 Positive instances (61.5%), 200 Negative instances (38.5%).

---

## 5. Quantitative Benchmark Results

Evaluated across 4 distinct algorithmic paradigms (Stratified 5-Fold Cross-Validation, Mean ± Std):

| Model Paradigm | Accuracy | Precision | Recall (Sens) | F1-Score | ROC-AUC | Brier Score |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Logistic Regression (L2)** | 93.2% ± 1.8% | 94.1% ± 2.1% | 95.2% ± 1.5% | 94.6% ± 1.6% | 0.978 ± 0.012 | 0.052 ± 0.011 |
| **Decision Tree (CART, d=5)** | 94.8% ± 1.4% | 95.5% ± 1.8% | 96.2% ± 1.2% | 95.8% ± 1.3% | 0.965 ± 0.015 | 0.045 ± 0.009 |
| **Random Forest (100 Trees)** | **97.5% ± 1.1%** | **97.8% ± 1.2%** | **98.4% ± 0.8%** | **98.1% ± 0.9%** | **0.995 ± 0.004** | **0.024 ± 0.006** |
| **SVM (RBF Kernel, C=5.0)** | 96.2% ± 1.5% | 96.5% ± 1.6% | 97.4% ± 1.1% | 96.9% ± 1.2% | 0.988 ± 0.007 | 0.033 ± 0.008 |

---

## 6. Explainability & Clinical Feature Importance

Top 5 predictors derived from Gini Impurity (Random Forest) and confirmed by Logistic Regression odds ratios:
1. **Polyuria** (Excessive Urination) — Relative Weight: ~22.4%
2. **Polydipsia** (Excessive Thirst) — Relative Weight: ~20.1%
3. **Age** — Relative Weight: ~9.8%
4. **Gender (Female symptom presentation)** — Relative Weight: ~9.2%
5. **Sudden Weight Loss** — Relative Weight: ~8.5%

*Clinical Note*: The primacy of Polyuria and Polydipsia aligns precisely with classic pathophysiological osmotic diuresis triggered by hyperglycemia exceeding the renal tubular absorptive threshold (~180 mg/dL).

---

## 7. Ethical Considerations & Limitations

1. **Sub-population Demographic Bias**: The training cohort was gathered in a specialized diabetes hospital in Sylhet, Bangladesh. Symptoms of individuals self-presenting to a specialized hospital may be more pronounced than those in general asymptomatic community screening.
2. **Pediatric Exclusion**: The minimum age in the cohort is 16. The model is not calibrated for pediatric or juvenile Type 1 Diabetes screening.
3. **No Laboratory Biomarker Input**: The dataset relies exclusively on clinical signs and symptoms; it does not incorporate fasting blood glucose, HbA1c, or oral glucose tolerance test (OGTT) values.

---

## 8. Safety Invariants & System Boundaries

- **Decoupling Invariant**: All predictions from `/ml` remain within the independent research pipeline.
- **Override Prohibition**: Under no circumstance is an ML prediction permitted to downgrade or suppress an emergency red flag evaluated by Module 03 (Symptom Triage).
- **Mandatory Notice**: All inference endpoints output: *"Experimental research prediction only. Not a clinical diagnosis and never overrides clinical rules."*
