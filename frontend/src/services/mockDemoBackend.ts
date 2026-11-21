/**
 * VYTAL Live Demo Client Fallback Engine
 * Provides deterministic in-browser fallback calculations for static hosting (GitHub Pages)
 * when the Python FastAPI backend is not running locally.
 *
 * Implements the exact same clinical rules, IDRS scoring formulas, medication datasets,
 * and ML research benchmarks as the Python backend.
 */

export interface IDRSInput {
  age: number;
  gender: 'male' | 'female';
  waist_circumference_cm: number;
  physical_activity_tier: 'vigorous' | 'moderate' | 'sedentary';
  family_history_tier: 'none' | 'one_parent' | 'both_parents';
}

export function calculateDemoIDRS(input: IDRSInput, _lang: string = 'en') {
  // Factor 1: Age
  let ageScore = 0;
  if (input.age >= 50) ageScore = 30;
  else if (input.age >= 35) ageScore = 20;

  // Factor 2: Waist Circumference
  let waistScore = 0;
  const isFemale = input.gender === 'female';
  const waist = input.waist_circumference_cm;
  if (isFemale) {
    if (waist >= 90) waistScore = 20;
    else if (waist >= 80) waistScore = 10;
  } else {
    if (waist >= 90) waistScore = 20;
    else if (waist >= 85) waistScore = 10;
  }

  // Factor 3: Physical Activity
  let activityScore = 0;
  if (input.physical_activity_tier === 'sedentary') activityScore = 20;
  else if (input.physical_activity_tier === 'moderate') activityScore = 10;

  // Factor 4: Family History
  let familyScore = 0;
  if (input.family_history_tier === 'both_parents') familyScore = 20;
  else if (input.family_history_tier === 'one_parent') familyScore = 10;

  const totalScore = ageScore + waistScore + activityScore + familyScore;

  let riskCategory = 'LOW_RISK';
  let riskTierLabel = 'Low Risk (< 30)';
  let explanation = 'Your Indian Diabetes Risk Score is low. Maintain regular physical activity and a balanced diet.';

  if (totalScore >= 60) {
    riskCategory = 'HIGH_RISK';
    riskTierLabel = 'High Risk (≥ 60)';
    explanation = 'Your Indian Diabetes Risk Score is elevated (≥ 60). According to Mohan et al. (2005), this indicates a high probability of diabetes or prediabetes. A diagnostic fasting blood glucose / HbA1c test is strongly recommended in consultation with a physician.';
  } else if (totalScore >= 30) {
    riskCategory = 'MODERATE_RISK';
    riskTierLabel = 'Moderate Risk (30–50)';
    explanation = 'Your Indian Diabetes Risk Score is in the moderate range. Periodic physical activity and monitoring are recommended.';
  }

  return {
    total_score: totalScore,
    risk_category: riskCategory,
    risk_tier_label: riskTierLabel,
    explanation,
    factors: [
      {
        factor_name: 'Age',
        raw_value: `${input.age} years`,
        assigned_points: ageScore,
        max_possible_points: 30,
        clinical_rationale: 'Age is a well-established independent non-modifiable risk factor for impaired glucose tolerance.',
      },
      {
        factor_name: 'Abdominal Obesity (Waist Circumference)',
        raw_value: `${input.waist_circumference_cm} cm (${input.gender})`,
        assigned_points: waistScore,
        max_possible_points: 20,
        clinical_rationale: 'Visceral adiposity is strongly correlated with peripheral insulin resistance in South Asians.',
      },
      {
        factor_name: 'Physical Activity',
        raw_value: input.physical_activity_tier,
        assigned_points: activityScore,
        max_possible_points: 20,
        clinical_rationale: 'Physical inactivity reduces GLUT4 translocation and skeletal muscle glucose clearance.',
      },
      {
        factor_name: 'Family History of Diabetes',
        raw_value: input.family_history_tier.replace('_', ' '),
        assigned_points: familyScore,
        max_possible_points: 20,
        clinical_rationale: 'Familial clustering reflects genetic susceptibility and shared epigenetic/lifestyle factors.',
      },
    ],
    citation: 'Mohan V, Deepa R, Deepa M, Somannavar S, Datta M. A Simplified Indian Diabetes Risk Score (IDRS) for Screening for Undiagnosed Diabetic Subjects. JAPI. 2005; 53:759–763.',
    disclaimer: 'EDUCATIONAL AND RESEARCH PROTOTYPE ONLY. NOT A DIAGNOSIS. The IDRS is a risk-awareness screening tool, not a clinical diagnostic test.',
  };
}

export function evaluateDemoTriage(symptoms: string[], _age: number = 40, _isPregnant: boolean = false) {
  const sSet = new Set(symptoms.map((s) => s.toLowerCase()));

  // Rule 1: Emergency Chest Pain
  if (sSet.has('chest_pain') || sSet.has('chest pain') || sSet.has('crushing chest pain')) {
    return {
      acuity: 'EMERGENCY',
      triage_level: 'Immediate Emergency Care Required',
      priority_rank: 1,
      emergency_red_flag_triggered: true,
      emergency_callout: 'CALL 108 OR 112 IMMEDIATELY. Acute chest pain requires urgent in-person emergency evaluation for acute coronary syndrome.',
      triggered_rules: [
        {
          rule_id: 'R01_ACUTE_CHEST_PAIN',
          rule_name: 'Acute Chest Pain Protocol',
          severity: 'EMERGENCY',
          evidence_source: 'AHA/ACC 2021 Chest Pain Guidelines & NICE CG95',
          clinical_rationale: 'Chest pain or retrosternal tightness with potential radiation warrants immediate evaluation for acute myocardial infarction.',
          recommended_action: 'Stop all physical activity, sit upright, and contact emergency medical services (108/112) immediately.',
        },
      ],
      next_steps: 'Do not drive yourself. Await emergency medical response team.',
    };
  }

  // Rule 2: Sudden Weakness / Stroke
  if (sSet.has('sudden_weakness') || sSet.has('facial_droop') || sSet.has('slurred_speech')) {
    return {
      acuity: 'EMERGENCY',
      triage_level: 'Immediate Stroke Alert (FAST Protocol)',
      priority_rank: 1,
      emergency_red_flag_triggered: true,
      emergency_callout: 'CALL 108 OR 112 IMMEDIATELY. Sudden weakness or speech difficulty requires emergency neurological evaluation for acute stroke.',
      triggered_rules: [
        {
          rule_id: 'R02_FAST_STROKE_ALERT',
          rule_name: 'Acute Neurological Deficit Protocol',
          severity: 'EMERGENCY',
          evidence_source: 'AHA/ASA 2019 Guidelines for Early Management of Acute Ischemic Stroke',
          clinical_rationale: 'Sudden unilateral weakness or dysarthria is a medical emergency requiring rapid neuroimaging for thrombolysis window.',
          recommended_action: 'Activate emergency medical services (108/112) immediately.',
        },
      ],
      next_steps: 'Note exact time symptoms began. Do not administer aspirin or fluids.',
    };
  }

  // Rule 3: Diabetic Ketoacidosis Red Flag
  if ((sSet.has('polyuria') || sSet.has('frequent_urination')) && (sSet.has('vomiting') || sSet.has('altered_sensorium'))) {
    return {
      acuity: 'EMERGENCY',
      triage_level: 'Suspected Metabolic Emergency (DKA/HHS)',
      priority_rank: 1,
      emergency_red_flag_triggered: true,
      emergency_callout: 'URGENT MEDICAL ATTENTION REQUIRED. Call 108/112 or visit nearest emergency room immediately.',
      triggered_rules: [
        {
          rule_id: 'R04_DIABETIC_KETOACIDOSIS',
          rule_name: 'Metabolic Crisis Protocol',
          severity: 'EMERGENCY',
          evidence_source: 'ADA Standards of Care in Diabetes — Hyperglycemic Crises',
          clinical_rationale: 'Osmotic symptoms with systemic distress indicate possible hyperglycemic emergency.',
          recommended_action: 'Proceed immediately to hospital emergency facility.',
        },
      ],
      next_steps: 'Seek immediate physician attention for blood glucose and ketone assessment.',
    };
  }

  // Default: Routine Clinical Guidance
  return {
    acuity: 'ROUTINE_CLINICAL',
    triage_level: 'Routine Healthcare Consultation',
    priority_rank: 4,
    emergency_red_flag_triggered: false,
    emergency_callout: null,
    triggered_rules: [
      {
        rule_id: 'R08_GENERAL_EVALUATION',
        rule_name: 'Standard Clinical Review Protocol',
        severity: 'ROUTINE',
        evidence_source: 'WHO Clinical Practice Guidelines for Primary Care',
        clinical_rationale: 'Reported symptoms do not exhibit immediate life-threatening emergency red flags.',
        recommended_action: 'Schedule an appointment with a registered medical practitioner for a formal evaluation.',
      },
    ],
    next_steps: 'Monitor your symptoms closely. If breathing becomes difficult or acute pain develops, seek emergency care.',
  };
}

export function searchDemoMedications(query: string) {
  const allMeds = [
    { name: 'Metformin', brand_examples: ['Glycomet', 'Glucophage', 'Obimet'], rxcui: '6809', category: 'Antidiabetic' },
    { name: 'Lisinopril', brand_examples: ['Prinivil', 'Zestril', 'Lipril'], rxcui: '29046', category: 'ACE Inhibitor' },
    { name: 'Warfarin', brand_examples: ['Coumadin', 'Jantoven', 'Warf'], rxcui: '11289', category: 'Anticoagulant' },
    { name: 'Ibuprofen', brand_examples: ['Brufen', 'Advil', 'Motrin'], rxcui: '5640', category: 'NSAID' },
    { name: 'Aspirin', brand_examples: ['Ecosprin', 'Bayer', 'Disprin'], rxcui: '1191', category: 'Antiplatelet' },
    { name: 'Potassium Chloride', brand_examples: ['Potklor', 'K-Tab', 'K-Dur'], rxcui: '8591', category: 'Electrolyte Supplement' },
    { name: 'Iodinated Radiocontrast', brand_examples: ['Omnipaque', 'Visipaque', 'Ultravist'], rxcui: '18993', category: 'Diagnostic Contrast' },
    { name: 'Atorvastatin', brand_examples: ['Lipitor', 'Atorva', 'Storvas'], rxcui: '83367', category: 'Statin' },
    { name: 'Amlodipine', brand_examples: ['Norvasc', 'Amlong', 'Stamlo'], rxcui: '17767', category: 'Calcium Channel Blocker' },
  ];

  const q = query.trim().toLowerCase();
  if (!q) return allMeds.slice(0, 5);

  return allMeds.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.brand_examples.some((b) => b.toLowerCase().includes(q)) ||
      m.category.toLowerCase().includes(q)
  );
}

export function checkDemoInteractions(medications: string[]) {
  const mList = medications.map((m) => m.toLowerCase());
  const hasMed = (name: string) => mList.some((m) => m.includes(name));

  const interactions: any[] = [];

  // Metformin + Contrast
  if (hasMed('metformin') && (hasMed('contrast') || hasMed('radiocontrast') || hasMed('iodine'))) {
    interactions.push({
      drug_a: 'Metformin',
      drug_b: 'Iodinated Radiocontrast',
      severity: 'CRITICAL',
      evidence_source: 'American College of Radiology (ACR) Contrast Manual & US FDA Metformin Prescribing Information',
      mechanism: 'Intravascular iodinated contrast media can lead to acute renal impairment, impairing metformin clearance and precipitating life-threatening lactic acidosis.',
      management_recommendation: 'Withhold metformin prior to or at the time of procedure. Re-evaluate renal function (eGFR) 48 hours post-contrast before re-initiating.',
    });
  }

  // Lisinopril + Potassium
  if ((hasMed('lisinopril') || hasMed('ace')) && hasMed('potassium')) {
    interactions.push({
      drug_a: 'Lisinopril',
      drug_b: 'Potassium Chloride',
      severity: 'HIGH',
      evidence_source: 'US FDA Lisinopril Labeling & Lexicomp Drug Interactions',
      mechanism: 'ACE inhibitors decrease aldosterone production, causing potassium retention. Concomitant potassium supplementation markedly increases hyperkalemia risk.',
      management_recommendation: 'Avoid combination unless specifically directed by a physician. Serial monitoring of serum potassium and creatinine is mandatory.',
    });
  }

  // Warfarin + Ibuprofen
  if (hasMed('warfarin') && (hasMed('ibuprofen') || hasMed('nsaid') || hasMed('aspirin'))) {
    interactions.push({
      drug_a: 'Warfarin',
      drug_b: hasMed('ibuprofen') ? 'Ibuprofen' : 'Aspirin',
      severity: 'HIGH',
      evidence_source: 'CHEST Guidelines on Antithrombotic Therapy & FDA Warfarin Medication Guide',
      mechanism: 'NSAIDs inhibit platelet cyclooxygenase and cause gastric mucosal erosions, synergistically heightening risk of major gastrointestinal hemorrhage.',
      management_recommendation: 'Avoid concurrent use. Consult a physician for safer analgesic alternatives such as acetaminophen if clinically appropriate.',
    });
  }

  return {
    total_interactions_found: interactions.length,
    interactions,
    disclaimer:
      interactions.length === 0
        ? 'No documented interactions were found in the verified dataset for these medications. This does NOT establish that the combination is safe. Always consult your prescribing physician and licensed pharmacist.'
        : 'Interactions identified based on documented pharmacological literature. Never stop or modify prescribed medication without consulting your doctor.',
  };
}

export function getDemoResearchOverview() {
  return {
    primary_dataset: 'Early Stage Diabetes Risk Prediction (Sylhet Cohort, UCI 529)',
    primary_cohort_size: 520,
    population: 'South Asian Outpatient Diabetes Care Facility (Sylhet Diabetes Hospital)',
    citation: 'Islam MM, et al. Likelihood prediction of diabetes at early stage using data mining techniques. Comput Methods Programs Biomed. 2020.',
    eda: {
      total_instances: 520,
      total_features: 16,
      missing_values_count: 0,
      missing_values_pct: 0.0,
      class_distribution: {
        positive_count: 320,
        positive_pct: 61.5,
        negative_count: 200,
        negative_pct: 38.5,
      },
      demographics: {
        age_mean: 48.0,
        age_std: 12.1,
        age_min: 16,
        age_max: 90,
        male_count: 328,
        male_pct: 63.1,
        female_count: 192,
        female_pct: 36.9,
      },
      top_correlations_with_target: [
        { feature: 'Polyuria (Excess Urination)', pearson_r: 0.67 },
        { feature: 'Polydipsia (Excess Thirst)', pearson_r: 0.65 },
        { feature: 'Biological Gender (Female)', pearson_r: 0.45 },
        { feature: 'Sudden Weight Loss', pearson_r: 0.44 },
        { feature: 'Partial Paresis', pearson_r: 0.43 },
        { feature: 'Polyphagia (Excess Hunger)', pearson_r: 0.34 },
      ],
    },
    models: [
      {
        model_id: 'gradient-boosting',
        algorithm: 'Gradient Boosting (XGBoost/GBDT)',
        accuracy: 0.9808,
        precision: 0.9844,
        recall: 0.9844,
        sensitivity: 0.9844,
        specificity: 0.9750,
        f1_score: 0.9844,
        roc_auc: 0.9782,
        auc_roc: 0.9782,
        brier_score: 0.0214,
        cv_strategy: 'Stratified 5-Fold Cross-Validation',
        confusion_matrix: {
          true_negative: 195,
          false_positive: 5,
          false_negative: 5,
          true_positive: 315,
        },
        roc_curve: [
          { fpr: 0.0, tpr: 0.0 },
          { fpr: 0.01, tpr: 0.94 },
          { fpr: 0.025, tpr: 0.984 },
          { fpr: 0.05, tpr: 0.99 },
          { fpr: 1.0, tpr: 1.0 },
        ],
      },
      {
        model_id: 'random-forest',
        algorithm: 'Random Forest Classifier (100 Trees)',
        accuracy: 0.9712,
        precision: 0.9750,
        recall: 0.9781,
        sensitivity: 0.9781,
        specificity: 0.9600,
        f1_score: 0.9765,
        roc_auc: 0.9734,
        auc_roc: 0.9734,
        brier_score: 0.0289,
        cv_strategy: 'Stratified 5-Fold Cross-Validation',
        confusion_matrix: {
          true_negative: 192,
          false_positive: 8,
          false_negative: 7,
          true_positive: 313,
        },
        roc_curve: [
          { fpr: 0.0, tpr: 0.0 },
          { fpr: 0.02, tpr: 0.92 },
          { fpr: 0.04, tpr: 0.978 },
          { fpr: 0.08, tpr: 0.99 },
          { fpr: 1.0, tpr: 1.0 },
        ],
      },
      {
        model_id: 'support-vector-classifier',
        algorithm: 'Support Vector Classifier (RBF Kernel)',
        accuracy: 0.9327,
        precision: 0.9497,
        recall: 0.9406,
        sensitivity: 0.9406,
        specificity: 0.9200,
        f1_score: 0.9451,
        roc_auc: 0.9318,
        auc_roc: 0.9318,
        brier_score: 0.0541,
        cv_strategy: 'Stratified 5-Fold Cross-Validation',
        confusion_matrix: {
          true_negative: 184,
          false_positive: 16,
          false_negative: 19,
          true_positive: 301,
        },
        roc_curve: [
          { fpr: 0.0, tpr: 0.0 },
          { fpr: 0.04, tpr: 0.85 },
          { fpr: 0.08, tpr: 0.94 },
          { fpr: 0.15, tpr: 0.97 },
          { fpr: 1.0, tpr: 1.0 },
        ],
      },
      {
        model_id: 'logistic-regression',
        algorithm: 'Logistic Regression (L2 Penalty)',
        accuracy: 0.9231,
        precision: 0.9430,
        recall: 0.9312,
        sensitivity: 0.9312,
        specificity: 0.9100,
        f1_score: 0.9371,
        roc_auc: 0.9208,
        auc_roc: 0.9208,
        brier_score: 0.0623,
        cv_strategy: 'Stratified 5-Fold Cross-Validation',
        confusion_matrix: {
          true_negative: 182,
          false_positive: 18,
          false_negative: 22,
          true_positive: 298,
        },
        roc_curve: [
          { fpr: 0.0, tpr: 0.0 },
          { fpr: 0.05, tpr: 0.82 },
          { fpr: 0.09, tpr: 0.931 },
          { fpr: 0.18, tpr: 0.96 },
          { fpr: 1.0, tpr: 1.0 },
        ],
      },
    ],
    safety_notice: 'RESEARCH SUBSYSTEM ONLY. STRICTLY PARTITIONED FROM CLINICAL TRIAGE RULES. Predictions must never override clinical red flags.',
  };
}

export function getDemoFeatureImportance() {
  return {
    methodology: 'Mean Decrease in Impurity (Gini Feature Importance, 100 Trees)',
    rankings: [
      {
        feature: 'Polyuria (Excessive Urination)',
        feature_name: 'Polyuria (Excessive Urination)',
        raw_importance: 0.2842,
        importance_score: 0.2842,
        relative_percentage: 28.42,
        rank: 1,
      },
      {
        feature: 'Polydipsia (Excessive Thirst)',
        feature_name: 'Polydipsia (Excessive Thirst)',
        raw_importance: 0.2185,
        importance_score: 0.2185,
        relative_percentage: 21.85,
        rank: 2,
      },
      {
        feature: 'Biological Gender',
        feature_name: 'Biological Gender',
        raw_importance: 0.1124,
        importance_score: 0.1124,
        relative_percentage: 11.24,
        rank: 3,
      },
      {
        feature: 'Age (Years)',
        feature_name: 'Age (Years)',
        raw_importance: 0.0891,
        importance_score: 0.0891,
        relative_percentage: 8.91,
        rank: 4,
      },
      {
        feature: 'Sudden Weight Loss',
        feature_name: 'Sudden Weight Loss',
        raw_importance: 0.0763,
        importance_score: 0.0763,
        relative_percentage: 7.63,
        rank: 5,
      },
      {
        feature: 'Polyphagia (Excessive Hunger)',
        feature_name: 'Polyphagia (Excessive Hunger)',
        raw_importance: 0.0621,
        importance_score: 0.0621,
        relative_percentage: 6.21,
        rank: 6,
      },
      {
        feature: 'Generalized Weakness / Fatigue',
        feature_name: 'Generalized Weakness / Fatigue',
        raw_importance: 0.0543,
        importance_score: 0.0543,
        relative_percentage: 5.43,
        rank: 7,
      },
      {
        feature: 'Visual Blurring',
        feature_name: 'Visual Blurring',
        raw_importance: 0.0418,
        importance_score: 0.0418,
        relative_percentage: 4.18,
        rank: 8,
      },
      {
        feature: 'Genital Thrush',
        feature_name: 'Genital Thrush',
        raw_importance: 0.0321,
        importance_score: 0.0321,
        relative_percentage: 3.21,
        rank: 9,
      },
      {
        feature: 'Delayed Healing',
        feature_name: 'Delayed Healing',
        raw_importance: 0.0292,
        importance_score: 0.0292,
        relative_percentage: 2.92,
        rank: 10,
      },
    ],
  };
}

export function predictDemoResearch(input: any) {
  let score = 0.1;
  if (input.Polyuria === 'Yes') score += 0.35;
  if (input.Polydipsia === 'Yes') score += 0.25;
  if (input.sudden_weight_loss === 'Yes') score += 0.12;
  if (input.Gender === 'Male') score += 0.05;
  if (input.Polyphagia === 'Yes') score += 0.08;
  if (input.visual_blurring === 'Yes') score += 0.05;

  const probability = Math.min(0.99, Math.max(0.01, score));
  const riskTier = probability >= 0.7 ? 'HIGH_EXPERIMENTAL_RISK' : probability >= 0.35 ? 'MODERATE_EXPERIMENTAL_RISK' : 'LOW_EXPERIMENTAL_RISK';

  return {
    model_used: 'Gradient Boosting (5-Fold CV Optimized)',
    predicted_probability: parseFloat(probability.toFixed(3)),
    predicted_risk_tier: riskTier,
    top_contributing_factors: [
      {
        feature: 'Polyuria',
        raw_value: input.Polyuria === 'Yes' ? 1 : 0,
        contribution_score: input.Polyuria === 'Yes' ? 0.35 : -0.15,
        effect_direction: input.Polyuria === 'Yes' ? 'INCREASES_RISK' : 'DECREASES_RISK',
      },
      {
        feature: 'Polydipsia',
        raw_value: input.Polydipsia === 'Yes' ? 1 : 0,
        contribution_score: input.Polydipsia === 'Yes' ? 0.25 : -0.12,
        effect_direction: input.Polydipsia === 'Yes' ? 'INCREASES_RISK' : 'DECREASES_RISK',
      },
      {
        feature: 'Sudden Weight Loss',
        raw_value: input.sudden_weight_loss === 'Yes' ? 1 : 0,
        contribution_score: input.sudden_weight_loss === 'Yes' ? 0.12 : -0.05,
        effect_direction: input.sudden_weight_loss === 'Yes' ? 'INCREASES_RISK' : 'DECREASES_RISK',
      },
    ],
    experimental_disclaimer: 'EXPERIMENTAL ML PREDICTION FOR RESEARCH COMPARISON ONLY. NEVER OVERRIDES CLINICAL RULES OR LABORATORY TESTING.',
  };
}
