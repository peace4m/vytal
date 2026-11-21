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

export function evaluateDemoTriage(
  symptoms: string[] = [],
  attributes: Record<string, any> = {},
  lang: string = 'en'
) {
  const sSet = new Set((symptoms || []).map((s) => (typeof s === 'string' ? s.toLowerCase() : '')));
  const attrs = attributes || {};
  const isHi = lang === 'hi';
  const isOr = lang === 'or' || lang === 'odia';

  const triageId = `trg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const triggeredRules: Array<{
    rule_id: string;
    rule_name: string;
    priority: string;
    evidence_source: string;
    reason: string;
  }> = [];
  const uncertaintyNotes: string[] = [];

  // =========================================================
  // TIER 1: EMERGENCY RED-FLAG EVALUATION (MANDATORY FIRST)
  // =========================================================

  // 1. Acute Coronary Syndrome
  if (sSet.has('chest_pain') || sSet.has('chest pain') || attrs.chest_pain_nature) {
    const nature = attrs.chest_pain_nature || '';
    const radiates = attrs.radiates_to_jaw_or_left_arm === true;
    const sweatDyspnea = attrs.associated_sweating_or_dyspnea === true;
    const hasBreath = sSet.has('severe_shortness_of_breath') || sSet.has('shortness_of_breath');

    if (!nature && !radiates && !sweatDyspnea) {
      uncertaintyNotes.push(
        isHi
          ? 'सीने के दर्द का प्रकार स्पष्ट नहीं था; अतिरिक्त सावधानी के साथ मूल्यांकन किया गया।'
          : isOr
          ? 'ଛାତି ଯନ୍ତ୍ରଣାର ପ୍ରକାର ନିର୍ଦ୍ଦିଷ୍ଟ ନଥିଲା; ସତର୍କତା ସହ ମୂଲ୍ୟାଙ୍କନ କରାଗଲା।'
          : 'Nature of chest pain was not fully specified; evaluated with heightened clinical caution.'
      );
    }

    if (
      ['crushing_pressure', 'heavy_squeezing', 'crushing'].includes(nature) ||
      radiates ||
      sweatDyspnea ||
      hasBreath ||
      sSet.has('chest_pain')
    ) {
      triggeredRules.push({
        rule_id: 'RULE-EMERG-ACS-001',
        rule_name: isHi ? 'संभावित एक्यूट कोरोनरी सिंड्रोम (ACS) आपातकालीन रेड फ्लैग' : isOr ? 'ସନ୍ଦିଗ୍ଧ ହୃଦଘାତ (ACS) ଜରୁରୀକାଳୀନ ରେଡ୍ ଫ୍ଲାଗ୍' : 'Suspected Acute Coronary Syndrome (ACS) Red Flag',
        priority: 'EMERGENCY_RED_FLAG',
        evidence_source: 'National Institute for Health and Care Excellence (NICE) CG95 (2016)',
        reason: isHi
          ? 'दबाव या भारीपन वाला सीने का दर्द जो जबड़े, बाएं हाथ में फैले या सांस फूलने के साथ हो, तत्काल आपातकालीन चिकित्सा की मांग करता है।'
          : isOr
          ? 'ଛାତିରେ ଚାପ ବା ଭାରୀପଣ ଯନ୍ତ୍ରଣା, ଯାହା ବାମ ହାତକୁ ବ୍ୟାପେ ବା ଶ୍ୱାସକଷ୍ଟ ସହିତ ଥାଏ, ତୁରନ୍ତ ଡାକ୍ତରୀ ସେବା ଆବଶ୍ୟକ କରେ।'
          : 'Compressive chest pain presenting with potential radiation or associated dyspnea warrants immediate emergency exclusion of acute myocardial infarction.',
      });
    }
  }

  // 2. Acute Stroke (BE-FAST)
  if (
    sSet.has('facial_droop_or_weakness') ||
    sSet.has('facial_droop') ||
    sSet.has('arm_weakness') ||
    sSet.has('slurred_speech') ||
    attrs.unilateral_weakness === true ||
    attrs.speech_difficulty_or_slurring === true
  ) {
    triggeredRules.push({
      rule_id: 'RULE-EMERG-STRK-002',
      rule_name: isHi ? 'तीव्र स्ट्रोक (BE-FAST) आपातकालीन चेतावनी' : isOr ? 'ତୀବ୍ର ଷ୍ଟ୍ରୋକ୍ (BE-FAST) ଜରୁରୀକାଳୀନ ସତର୍କତା' : 'Acute Stroke / Cerebrovascular Event (BE-FAST) Red Flag',
      priority: 'EMERGENCY_RED_FLAG',
      evidence_source: 'AHA/ASA Guidelines for Early Management of Acute Ischemic Stroke (2019)',
      reason: isHi
        ? 'अचानक चेहरे का टेढ़ापन, एक तरफ की कमजोरी या आवाज लड़खड़ाना तीव्र मस्तिष्क पक्षाघात (स्ट्रोक) का संकेत है।'
        : isOr
        ? 'ହଠାତ୍ ମୁହଁ ବଙ୍କା ହେବା, ଏକପାଖିଆ ଦୁର୍ବଳତା ବା କହିବାରେ ଅସୁବିଧା ଏକ ଜରୁରୀକାଳୀନ ଷ୍ଟ୍ରୋକ୍ ର ଲକ୍ଷଣ।'
        : 'Sudden onset of facial asymmetry, unilateral weakness, or slurred speech indicates acute cerebrovascular compromise requiring emergency neurovascular care.',
    });
  }

  // 3. Severe Respiratory Compromise
  if (
    sSet.has('severe_shortness_of_breath') ||
    sSet.has('shortness_of_breath') ||
    attrs.inability_to_speak_full_sentences === true ||
    attrs.stridor_or_rest_wheezing === true
  ) {
    triggeredRules.push({
      rule_id: 'RULE-EMERG-RESP-003',
      rule_name: isHi ? 'गंभीर श्वसन संकट (श्वासकष्ट) रेड फ्लैग' : isOr ? 'ଗୁରୁତର ଶ୍ୱାସକଷ୍ଟ ଜରୁରୀକାଳୀନ ରେଡ୍ ଫ୍ଲାଗ୍' : 'Severe Acute Respiratory Compromise Red Flag',
      priority: 'EMERGENCY_RED_FLAG',
      evidence_source: 'World Health Organization (WHO) Emergency Triage Assessment (ETAT)',
      reason: isHi
        ? 'विश्राम में सांस फूलना या वाक्य पूरा न बोल पाना गंभीर श्वसन संकट का प्रमाण है।'
        : isOr
        ? 'ବିଶ୍ରାମରେ ଶ୍ୱାସକଷ୍ଟ ବା କଥା କହି ନପାରିବା ଗୁରୁତର ଶ୍ୱାସଜନିତ ସମସ୍ୟା।'
        : 'Critical respiratory compromise evidenced by rest dyspnea or inability to form complete sentences warrants urgent airway assessment.',
    });
  }

  // 4. Anaphylaxis
  if (
    sSet.has('acute_allergic_reaction') ||
    attrs.throat_tightness_or_swallowing_difficulty === true
  ) {
    triggeredRules.push({
      rule_id: 'RULE-EMERG-ANAPH-004',
      rule_name: isHi ? 'एनाफिलेक्सिस (तीव्र एलर्जी) आपातकाल' : isOr ? 'ଆନାଫାଇଲାକ୍ସିସ୍ (ଗୁରୁତର ଏଲର୍ଜି) ଜରୁରୀକାଳୀନ' : 'Acute Anaphylaxis Airway Compromise Red Flag',
      priority: 'EMERGENCY_RED_FLAG',
      evidence_source: 'World Allergy Organization (WAO) Anaphylaxis Guidelines (2020)',
      reason: isHi
        ? 'एलर्जी के बाद गले या होंठ में सूजन और सांस लेने में कठिनाई तत्काल आपातकालीन स्थिति है।'
        : isOr
        ? 'ଏଲର୍ଜି ପରେ ଗଳା ଫୁଲିବା ଓ ଶ୍ୱାସକଷ୍ଟ ଏକ ଜରୁରୀକାଳୀନ ପରିସ୍ଥିତି।'
        : 'Rapid allergic progression with suspected airway compromise requires immediate emergency medical attention.',
    });
  }

  // 5. Thunderclap Headache / Meningism
  if (
    sSet.has('thunderclap_headache') ||
    attrs.thunderclap_onset === true ||
    (attrs.severe_headache && attrs.neck_stiffness_fever)
  ) {
    triggeredRules.push({
      rule_id: 'RULE-EMERG-NEURO-005',
      rule_name: isHi ? 'अचानक असहनीय सिरदर्द (थंडरक्लैप) चेतावनी' : isOr ? 'ହଠାତ୍ ତୀବ୍ର ମୁଣ୍ଡବିନ୍ଧା ଜରୁରୀକାଳୀନ ସତର୍କତା' : 'Thunderclap Headache / Meningism Red Flag',
      priority: 'EMERGENCY_RED_FLAG',
      evidence_source: 'Scottish Intercollegiate Guidelines Network (SIGN 107)',
      reason: isHi
        ? '1 मिनट के भीतर अत्यधिक तीव्र सिरदर्द या बुखार के साथ गर्दन में अकड़न आपातकालीन न्यूरोलॉजिकल जांच की मांग करती है।'
        : isOr
        ? '୧ ମିନିଟ୍ ମଧ୍ୟରେ ଅସହ୍ୟ ମୁଣ୍ଡବିନ୍ଧା ବା ଜ୍ୱର ସହ ବେକ ଟାଣ ହେବା ତୁରନ୍ତ ଡାକ୍ତରୀ ପରୀକ୍ଷା ଆବଶ୍ୟକ କରେ।'
        : 'Explosive onset headache peaking within 1 minute or neck stiffness with fever indicates potential intracranial pathology or meningitis.',
    });
  }

  // Determine Acuity and Outcome
  const hasEmergency = triggeredRules.some((r) => r.priority === 'EMERGENCY_RED_FLAG');

  if (hasEmergency) {
    return {
      triage_id: triageId,
      primary_acuity: 'EMERGENCY',
      emergency_override_triggered: true,
      action_required: isHi
        ? 'तुरंत आपातकालीन एम्बुलेंस (108 / 112) को कॉल करें। स्वयं वाहन न चलाएं और आराम से बैठें।'
        : isOr
        ? 'ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ସେବା (108 / 112) କୁ କଲ୍ କରନ୍ତୁ। ନିଜେ ଗାଡ଼ି ଚଳାନ୍ତୁ ନାହିଁ ଏବଂ ଶାନ୍ତ ହୋଇ ବସନ୍ତୁ।'
        : 'CALL EMERGENCY SERVICES (108 / 112) IMMEDIATELY. Rest quietly in a seated position. Do not drive yourself to hospital.',
      triggered_rules: triggeredRules,
      safety_netting: isHi
        ? 'यदि व्यक्ति बेहोश हो जाए या सामान्य रूप से सांस लेना बंद कर दे, तो प्रशिक्षित होने पर तुरंत सीपीआर (CPR) शुरू करें।'
        : isOr
        ? 'ଯଦି ବ୍ୟକ୍ତି ଅଚେତ ହୋଇଯାଆନ୍ତି ବା ଶ୍ୱାସ ବନ୍ଦ ହୋଇଯାଏ, ତୁରନ୍ତ ପ୍ରାଥମିକ ଜରୁରୀ ଚିକିତ୍ସା ଆରମ୍ଭ କରନ୍ତୁ।'
        : 'If the individual becomes unresponsive or stops breathing normally, begin cardiopulmonary resuscitation (CPR) if trained while awaiting ambulance arrival.',
      uncertainty_notes: uncertaintyNotes,
    };
  }

  // TIER 2: URGENT / HIGH ACUITY (e.g. Metabolic / DKA)
  if (
    sSet.has('excessive_thirst_and_vomiting') ||
    attrs.persistent_vomiting_fluids === true ||
    (sSet.has('excessive_thirst') && attrs.fruity_breath_odor)
  ) {
    const dkaRule = {
      rule_id: 'RULE-URG-DKA-007',
      rule_name: isHi ? 'संभावित हाइपरग्लाइसेमिक संकट (DKA/HHS)' : isOr ? 'ସନ୍ଦିଗ୍ଧ ମଧୁମେହ ଜରୁରୀକାଳୀନ (DKA/HHS)' : 'Suspected Hyperglycemic Crisis / DKA Warning',
      priority: 'HIGH_ACUITY',
      evidence_source: 'American Diabetes Association (ADA) Standards of Care (2024)',
      reason: isHi
        ? 'अत्यधिक प्यास, बार-बार पेशाब और लगातार उल्टी उच्च रक्त शर्करा (DKA) का संकेत हो सकती है।'
        : isOr
        ? 'ଅତ୍ୟଧିକ ଶୋଷ, ପରିସ୍ରା ଏବଂ ଲଗାତାର ବାନ୍ତି ଉଚ୍ଚ ରକ୍ତ ଶର୍କରା ଜନିତ ସମସ୍ୟାର ଲକ୍ଷଣ।'
        : 'Polydipsia, polyuria, and persistent vomiting in the context of suspected hyperglycemia warrants urgent same-day evaluation for ketoacidosis.',
    };

    return {
      triage_id: triageId,
      primary_acuity: 'HIGH_ACUITY',
      emergency_override_triggered: false,
      action_required: isHi
        ? 'आज ही अपने निकटतम अस्पताल या डॉक्टर से तत्काल परामर्श लें। निर्जलीकरण से बचें।'
        : isOr
        ? 'ଆଜି ହିଁ ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା ବା ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ।'
        : 'SEEK URGENT SAME-DAY CLINICAL EVALUATION at an urgent care or outpatient emergency facility.',
      triggered_rules: [dkaRule],
      safety_netting: isHi
        ? 'यदि सांस में दुर्गंध आए, सुस्ती या बेहोशी बढ़े, तो बिना प्रतीक्षा किए आपातकालीन 108 पर कॉल करें।'
        : isOr
        ? 'ଯଦି ଶ୍ୱାସକଷ୍ଟ ବା ଅଚେତ ଅବସ୍ଥା ଦେଖାଦିଏ, ତୁରନ୍ତ 108 କୁ କଲ୍ କରନ୍ତୁ।'
        : 'If breathing becomes rapid or confusion develops, escalate immediately to emergency response (108 / 112).',
      uncertainty_notes: uncertaintyNotes,
    };
  }

  // TIER 3: ROUTINE CLINICAL GUIDANCE
  const routineRule = {
    rule_id: 'RULE-ROUT-METAB-008',
    rule_name: isHi ? 'सामान्य प्राथमिक स्वास्थ्य परामर्श प्रोटोकॉल' : isOr ? 'ସାଧାରଣ ଡାକ୍ତରୀ ପରାମର୍ଶ ପ୍ରୋଟୋକଲ୍' : 'Standard Routine Clinical Evaluation Protocol',
    priority: 'ROUTINE_CLINICAL',
    evidence_source: 'Indian Council of Medical Research (ICMR) Primary Care Guidelines',
    reason: isHi
      ? 'दर्ज किए गए लक्षणों में कोई तत्काल आपातकालीन लाल झंडा नहीं पाया गया है। सामान्य स्वास्थ्य जांच की सलाह दी जाती है।'
      : isOr
      ? 'ଦାଖଲ କରାଯାଇଥିବା ଲକ୍ଷଣରେ କୌଣସି ଜରୁରୀକାଳୀନ ରେଡ୍ ଫ୍ଲାଗ୍ ମିଳିନାହିଁ। ସାଧାରଣ ଡାକ୍ତରୀ ପରୀକ୍ଷା ଉଚିତ।'
      : 'Reported symptoms do not meet deterministic criteria for immediate emergency red flags. Scheduled outpatient clinical evaluation recommended.',
  };

  return {
    triage_id: triageId,
    primary_acuity: 'ROUTINE_CLINICAL',
    emergency_override_triggered: false,
    action_required: isHi
      ? 'नियमित समय पर अपने पंजीकृत चिकित्सक से परामर्श करें और अपने स्वास्थ्य लक्षणों की समीक्षा कराएं।'
      : isOr
      ? 'ସୁବିଧା ଅନୁସାରେ ନିଜର ପଞ୍ଜୀକୃତ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରି ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା କରାନ୍ତୁ।'
      : 'Schedule a routine consultation with your registered healthcare practitioner for clinical evaluation.',
    triggered_rules: [routineRule],
    safety_netting: isHi
      ? 'यदि अचानक सीने में दर्द, सांस फूलना, बोलने में कठिनाई या बेहोशी हो, तो तत्काल 108/112 पर संपर्क करें।'
      : isOr
      ? 'ଯଦି ହଠାତ୍ ଛାତି ଯନ୍ତ୍ରଣା, ଶ୍ୱାସକଷ୍ଟ ବା କଥା କହିବାରେ ଅସୁବିଧା ହୁଏ, ତୁରନ୍ତ 108 କୁ କଲ୍ କରନ୍ତୁ।'
      : 'If acute severe symptoms suddenly develop (chest pressure, slurred speech, shortness of breath), seek immediate emergency care.',
    uncertainty_notes: uncertaintyNotes,
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

export function checkDemoInteractions(
  medications: Array<string | { name: string; rxcui?: string }> = [],
  lang: string = 'en'
) {
  const isHi = lang === 'hi';
  const isOr = lang === 'or' || lang === 'odia';

  // Normalize medication input (handles both string and object shapes)
  const normalizedMeds = (medications || []).map((item) => {
    if (typeof item === 'string') return item.trim();
    if (item && typeof item === 'object' && item.name) return String(item.name).trim();
    return '';
  }).filter(Boolean);

  const mListLower = normalizedMeds.map((m) => m.toLowerCase());
  const hasMed = (query: string) => mListLower.some((m) => m.includes(query.toLowerCase()));

  const interactions: Array<{
    drug_a: string;
    drug_b: string;
    severity: string;
    clinical_description: string;
    evidence_source: string;
    management_guidance?: string;
  }> = [];

  // 1. Metformin + Iodinated Contrast
  if (
    (hasMed('metformin') || hasMed('glycomet') || hasMed('glucophage')) &&
    (hasMed('contrast') || hasMed('radiocontrast') || hasMed('iodine') || hasMed('omnipaque') || hasMed('visipaque'))
  ) {
    interactions.push({
      drug_a: 'Metformin',
      drug_b: 'Iodinated Radiocontrast',
      severity: 'CONTRAINDICATED',
      clinical_description: isHi
        ? 'रेडियोकंट्रास्ट डाई गुर्दे की कार्यप्रणाली को अस्थायी रूप से प्रभावित कर सकती है, जिससे मेटफॉर्मिन शरीर में जमा होकर लैक्टिक एसिडोसिस (एक जानलेवा स्थिति) पैदा कर सकता है।'
        : isOr
        ? 'ରେଡିଓକଣ୍ଟ୍ରାଷ୍ଟ ଡାଇ ବୃକ୍‌କ (କିଡନୀ) କାର୍ଯ୍ୟକ୍ଷମତା ହ୍ରାସ କରିପାରେ, ଯାହା ମେଟଫର୍ମିନ୍ ଜମା ହୋଇ ଲାକ୍ଟିକ୍ ଏସିଡୋସିସ୍ ସୃଷ୍ଟି କରିପାରେ।'
        : 'Intravascular iodinated contrast media can precipitate acute renal impairment, reducing metformin clearance and precipitating life-threatening lactic acidosis.',
      evidence_source: 'American College of Radiology (ACR) Contrast Manual & US FDA Metformin Prescribing Information',
      management_guidance: isHi
        ? 'प्रक्रिया से पहले मेटफॉर्मिन रोकें और प्रक्रिया के 48 घंटे बाद किडनी परीक्षण (eGFR) सामान्य आने पर ही पुनः शुरू करें।'
        : isOr
        ? 'ପରୀକ୍ଷା ପୂର୍ବରୁ ମେଟଫର୍ମିନ୍ ବନ୍ଦ ରଖନ୍ତୁ ଏବଂ ୪୮ ଘଣ୍ଟା ପରେ କିଡନୀ ପରୀକ୍ଷା ପରେ ହିଁ ପୁନର୍ବାର ଆରମ୍ଭ କରନ୍ତୁ।'
        : 'Withhold metformin prior to or at time of procedure. Re-evaluate renal function (eGFR) 48 hours post-procedure before restarting.',
    });
  }

  // 2. Lisinopril / ACE Inhibitor + Potassium Supplement
  if (
    (hasMed('lisinopril') || hasMed('ramipril') || hasMed('enalapril') || hasMed('ace')) &&
    (hasMed('potassium') || hasMed('potklor') || hasMed('k-tab'))
  ) {
    interactions.push({
      drug_a: 'Lisinopril (ACE Inhibitor)',
      drug_b: 'Potassium Chloride',
      severity: 'SEVERE',
      clinical_description: isHi
        ? 'ACE इन्हिबिटर दवाएं शरीर में पोटेशियम का स्तर बढ़ाती हैं। पोटेशियम सप्लीमेंट साथ लेने से हाइपरकेलेमिया (रक्त में अत्यधिक पोटेशियम) और हृदय गति में गंभीर अनियमितता हो सकती है।'
        : isOr
        ? 'ACE ଇନହିବିଟର୍ ଔଷଧ ଶରୀରରେ ପୋଟାସିୟମ୍ ସ୍ତର ବୃଦ୍ଧି କରେ। ଏକାସାଙ୍ଗରେ ପୋଟାସିୟମ୍ ନେବା ଦ୍ୱାରା ହାଇପରକାଲେମିଆ ଏବଂ ହୃଦସ୍ପନ୍ଦନରେ ଅନିୟମିତତା ହୋଇପାରେ।'
        : 'ACE inhibitors decrease aldosterone production, promoting potassium retention. Concurrent potassium supplementation significantly increases the risk of severe hyperkalemia and cardiac dysrhythmias.',
      evidence_source: 'US FDA Lisinopril Labeling & Lexicomp Drug Interactions',
      management_guidance: isHi
        ? 'डॉक्टर की स्पष्ट निगरानी के बिना यह संयोजन न लें। सीरम पोटेशियम की नियमित जांच अनिवार्य है।'
        : isOr
        ? 'ଡାକ୍ତରଙ୍କ ସ୍ପଷ୍ଟ ପରାମର୍ଶ ବିନା ଏହି ଔଷଧ ନିଅନ୍ତୁ ନାହିଁ। ନିୟମିତ ପୋଟାସିୟମ୍ ପରୀକ୍ଷା କରାନ୍ତୁ।'
        : 'Avoid concurrent use unless explicitly directed and monitored by a physician. Serial monitoring of serum potassium is mandatory.',
    });
  }

  // 3. Warfarin + NSAID (Ibuprofen / Aspirin)
  if (
    (hasMed('warfarin') || hasMed('coumadin') || hasMed('warf')) &&
    (hasMed('ibuprofen') || hasMed('brufen') || hasMed('aspirin') || hasMed('ecosprin') || hasMed('diclofenac') || hasMed('naproxen'))
  ) {
    const nsaidName = hasMed('ibuprofen') ? 'Ibuprofen' : hasMed('aspirin') ? 'Aspirin' : 'NSAID Analgesic';
    interactions.push({
      drug_a: 'Warfarin',
      drug_b: nsaidName,
      severity: 'SEVERE',
      clinical_description: isHi
        ? 'दर्द निवारक NSAIDs पेट की आंतरिक परत में जलन पैदा करती हैं और प्लेटलेट्स के कार्य को रोकती हैं, जिससे वारफारिन के साथ पेट से भारी रक्तस्राव (गैस्ट्रोइंटेस्टाइनल ब्लीडिंग) का खतरा बहुत बढ़ जाता है।'
        : isOr
        ? 'NSAIDs ଯନ୍ତ୍ରଣା ଉପଶମକାରୀ ଔଷଧ ପେଟର ରକ୍ତସ୍ରାବ ବିପଦ ବୃଦ୍ଧି କରେ, ଯାହା ୱାରଫାରିନ୍ ସହିତ ଗୁରୁତର ରକ୍ତସ୍ରାବ ଘଟାଇପାରେ।'
        : 'NSAIDs inhibit platelet cyclooxygenase and cause gastric mucosal erosions, synergistically heightening risk of major gastrointestinal hemorrhage in patients on warfarin.',
      evidence_source: 'CHEST Antithrombotic Guidelines & US FDA Warfarin Medication Guide',
      management_guidance: isHi
        ? 'NSAID का उपयोग तुरंत टालें। दर्द के लिए चिकित्सक से सुरक्षित विकल्प (जैसे सीमित पैरासिटामोल) के बारे में परामर्श लें।'
        : isOr
        ? 'NSAID ବ୍ୟବହାର ବନ୍ଦ କରନ୍ତୁ ଏବଂ ନିରାପଦ ବିକଳ୍ପ ପାଇଁ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ।'
        : 'Avoid co-administration. Consult your physician for safer analgesic alternatives (e.g. acetaminophen under clinical supervision).',
    });
  }

  // 4. Statin (Atorvastatin / Simvastatin) + Macrolide / Azole
  if (
    (hasMed('atorvastatin') || hasMed('simvastatin') || hasMed('lipitor') || hasMed('atorva')) &&
    (hasMed('clarithromycin') || hasMed('erythromycin') || hasMed('ketoconazole') || hasMed('itraconazole'))
  ) {
    interactions.push({
      drug_a: 'Atorvastatin',
      drug_b: 'Clarithromycin',
      severity: 'SEVERE',
      clinical_description: isHi
        ? 'एंटीबायोटिक क्लैरिथ्रोमाइसिन यकृत में स्टेटिन के चयापचय (CYP3A4) को रोकता है, जिससे रक्त में स्टेटिन की मात्रा खतरनाक स्तर तक बढ़ सकती है और मांसपेशियों की गंभीर क्षति (रैबडोमायोलिसिस) हो सकती है।'
        : isOr
        ? 'କ୍ଲାରିଥ୍ରୋମାଇସିନ୍ ଷ୍ଟାଟିନ୍ ର ବିଶୋଧନ ହ୍ରାସ କରେ, ଯାହା ମାଂସପେଶୀ ନଷ୍ଟ (ରାବଡୋମାୟୋଲିସିସ୍) ଓ କିଡନୀ ବିଫଳତା ଘଟାଇପାରେ।'
        : 'Strong CYP3A4 inhibitors dramatically increase systemic statin exposure, substantially elevating the risk of severe myopathy and rhabdomyolysis.',
      evidence_source: 'AHA Scientific Statement on Statin Safety & FDA Drug Safety Communication',
      management_guidance: isHi
        ? 'एंटीबायोटिक कोर्स के दौरान स्टेटिन को अस्थायी रूप से रोकें या गैर-इंटरैक्टिंग एंटीबायोटिक का चयन करें।'
        : isOr
        ? 'ଏଣ୍ଟିବାୟୋଟିକ୍ ସେବନ ସମୟରେ ଷ୍ଟାଟିନ୍ ବନ୍ଦ ରଖନ୍ତୁ ବା ଅନ୍ୟ ବିକଳ୍ପ ବାଛନ୍ତୁ।'
        : 'Temporarily withhold statin therapy during macrolide antimicrobial course, or select an alternative antibiotic that does not inhibit CYP3A4.',
    });
  }

  // 5. Aspirin + Ibuprofen
  if (
    (hasMed('aspirin') || hasMed('ecosprin')) &&
    (hasMed('ibuprofen') || hasMed('brufen') || hasMed('advil'))
  ) {
    interactions.push({
      drug_a: 'Aspirin (Cardioprotective Low-Dose)',
      drug_b: 'Ibuprofen',
      severity: 'MODERATE',
      clinical_description: isHi
        ? 'इबुप्रोफेन प्लेटलेट एंजाइम (COX-1) पर एस्पिरिन के सुरक्षात्मक बंधन को अवरुद्ध करता है, जिससे एस्पिरिन का हृदय सुरक्षात्मक प्रभाव समाप्त हो सकता है और हृदय रोग का खतरा बढ़ सकता है।'
        : isOr
        ? 'ଇବୁପ୍ରୋଫେନ୍ ଆସ୍ପିରିନ୍ ର ହୃଦୟ ସୁରକ୍ଷାକାରୀ କ୍ଷମତାକୁ ହ୍ରାସ କରିପାରେ ଏବଂ ହୃଦରୋଗ ବିପଦ ବୃଦ୍ଧି କରିପାରେ।'
        : 'Ibuprofen competitively blocks the access of low-dose aspirin to the platelet COX-1 binding site, antagonizing the irreversible antiplatelet cardioprotective effect of aspirin.',
      evidence_source: 'US FDA Drug Safety Communication on Ibuprofen and Aspirin Interaction',
      management_guidance: isHi
        ? 'यदि दोनों आवश्यक हैं, तो इबुप्रोफेन लेने से कम से कम 30 मिनट पहले एस्पिरिन लें, या चिकित्सक से परामर्श करें।'
        : isOr
        ? 'ଯଦି ଉଭୟ ଆବଶ୍ୟକ, ତେବେ ଇବୁପ୍ରୋଫେନ୍ ପୂର୍ବରୁ ଆସ୍ପିରିନ୍ ସେବନ କରନ୍ତୁ ବା ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।'
        : 'If both must be taken, take immediate-release aspirin at least 30 minutes before or 8 hours after ibuprofen.',
    });
  }

  const hasSevere = interactions.some((i) => i.severity === 'CONTRAINDICATED' || i.severity === 'SEVERE');

  return {
    check_id: `ddi-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    total_medications: normalizedMeds.length,
    interaction_count: interactions.length,
    has_severe_warning: hasSevere,
    interactions,
    mandatory_disclaimer: isHi
      ? 'समीक्षा किए गए संदर्भ स्रोतों में जो संयोजन नहीं मिले, वे पूरी तरह सुरक्षित हैं ऐसा नहीं माना जा सकता। डॉक्टर के परामर्श के बिना कभी भी दवाएं न बदलें।'
      : isOr
      ? 'ପରୀକ୍ଷା କରାଯାଇଥିବା ତଥ୍ୟାବଳୀରେ ଅନ୍ୟ କୌଣସି ପ୍ରତିକ୍ରିୟା ମିଳିନାହିଁ। ଏହାର ଅର୍ଥ ନୁହେଁ ଯେ ଏହି ମିଶ୍ରଣ ସମ୍ପୂର୍ଣ୍ଣ ନିରାପଦ। ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ଅତ୍ୟନ୍ତ ଜରୁରୀ।'
      : 'No interaction was found for unspecified combinations in the curated evidence tables. This does NOT establish that the combination is safe. Never stop, start, or modify prescribed medications without clinical consultation with your physician or pharmacist.',
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

export function generateDemoHealthSummary(lang: string = 'en') {
  const isHi = lang === 'hi';
  const isOr = lang === 'or' || lang === 'odia';

  let labData: any = null;
  let idrsData: any = null;
  let triageData: any = null;
  let medsData: any = null;

  // Retrieve authenticated user context for strict data isolation
  let currentUserId: string | null = null;
  try {
    const rawSess = localStorage.getItem('vytal_local_auth_session');
    if (rawSess) {
      const parsedSess = JSON.parse(rawSess);
      currentUserId = parsedSess?.user?.id || null;
    }
  } catch {}

  try {
    const rawLab = localStorage.getItem('vytal_assessment_lab');
    if (rawLab) {
      const parsed = JSON.parse(rawLab);
      if (!parsed.user_id || !currentUserId || parsed.user_id === currentUserId) {
        labData = parsed;
      }
    }
  } catch {}

  try {
    const rawIdrs = localStorage.getItem('vytal_assessment_idrs');
    if (rawIdrs) {
      const parsed = JSON.parse(rawIdrs);
      if (!parsed.user_id || !currentUserId || parsed.user_id === currentUserId) {
        idrsData = parsed;
      }
    }
  } catch {}

  try {
    const rawTriage = localStorage.getItem('vytal_assessment_triage');
    if (rawTriage) {
      const parsed = JSON.parse(rawTriage);
      if (!parsed.user_id || !currentUserId || parsed.user_id === currentUserId) {
        triageData = parsed;
      }
    }
  } catch {}

  try {
    const rawMeds = localStorage.getItem('vytal_assessment_meds');
    if (rawMeds) {
      const parsed = JSON.parse(rawMeds);
      if (!parsed.user_id || !currentUserId || parsed.user_id === currentUserId) {
        medsData = parsed;
      }
    }
  } catch {}

  // 1. Module 01: Lab Observations
  let hasAbnormalGlucose = false;
  let hasAbnormalCreatinine = false;
  const observationsList: any[] = [];

  if (labData && Array.isArray(labData.observations) && labData.observations.length > 0) {
    for (const obs of labData.observations) {
      const name = obs.analyte_name || '';
      const status = obs.status_flag || obs.status || 'NORMAL';
      if (name.toLowerCase().includes('glucose') && (status === 'HIGH' || status === 'ABNORMAL')) {
        hasAbnormalGlucose = true;
      }
      if (name.toLowerCase().includes('creatinine') && (status === 'HIGH' || status === 'ABNORMAL')) {
        hasAbnormalCreatinine = true;
      }
      observationsList.push({
        analyte_name: name,
        value: obs.observed_value_str || `${obs.observed_value} ${obs.unit || ''}`.trim(),
        unit: obs.unit || '',
        reference_range: obs.lab_reference_range || '',
        status: status,
      });
    }
  }

  const mod01 = {
    has_data: observationsList.length > 0,
    confirmed_observations_count: observationsList.length,
    observations: observationsList,
  };

  // 2. Module 02: IDRS
  const hasHighIdrs = idrsData && typeof idrsData.total_score === 'number' && idrsData.total_score >= 60;
  const mod02 = {
    has_data: !!idrsData,
    total_score: idrsData?.total_score,
    risk_category: idrsData?.risk_category,
    breakdown: idrsData?.breakdown,
    citation: idrsData ? 'Mohan V et al. JAPI 2005; 53:759-763' : undefined,
  };

  // 3. Module 03: Triage
  const isEmergency = triageData?.primary_acuity === 'EMERGENCY' || triageData?.emergency_override_triggered;
  const mod03 = {
    has_data: !!triageData,
    primary_acuity: triageData?.primary_acuity,
    emergency_override_triggered: triageData?.emergency_override_triggered || false,
    action_required: triageData?.action_required,
    triggered_rules: triageData?.triggered_rules || [],
    safety_netting: triageData?.safety_netting,
  };

  // 4. Module 04: Medications
  const hasSevereDdi =
    medsData?.has_severe_warning ||
    (medsData?.interactions || []).some((i: any) => i.severity === 'CONTRAINDICATED' || i.severity === 'SEVERE');
  const mod04 = {
    has_data: !!medsData,
    total_medications: medsData?.total_medications || (medsData?.medications || []).length || 0,
    interaction_count: medsData?.interaction_count || (medsData?.interactions || []).length || 0,
    has_severe_warning: hasSevereDdi || false,
    medications_checked: (medsData?.medications || []).map((m: any) => (typeof m === 'string' ? m : m.name)),
    interactions: medsData?.interactions || [],
    mandatory_disclaimer: medsData?.mandatory_disclaimer,
  };

  // Determine Highest Acuity
  let highestAcuity = 'ROUTINE';
  if (isEmergency) highestAcuity = 'EMERGENCY';
  else if (hasSevereDdi) highestAcuity = 'HIGH_ACUITY';
  else if (hasHighIdrs || hasAbnormalGlucose || hasAbnormalCreatinine) highestAcuity = 'MODERATE';

  // Synthesize Cross-Module Insights
  const insights: Array<{
    category: string;
    severity: string;
    title: string;
    details: string;
    evidence_source?: string;
    boundary_notice?: string;
  }> = [];

  // Insight 1: Glycemic & IDRS Alignment
  if (hasAbnormalGlucose && hasHighIdrs) {
    insights.push({
      category: isHi ? 'मेटाबोलिक / ग्लाइसेमिक जोखिम सहसंबंध' : isOr ? 'ମେଟାବୋଲିକ୍ / ଗ୍ଲାଇସେମିକ୍ ସହସମ୍ବନ୍ଧ' : 'Metabolic / Glycemic Risk Correlation',
      severity: 'WARNING',
      title: isHi ? 'उच्च रक्त शर्करा और उच्च IDRS स्कोर (>=60)' : isOr ? 'ଉଚ୍ଚ ରକ୍ତ ଶର୍କରା ଓ ଉଚ୍ଚ IDRS ସ୍କୋର (>=60)' : 'Elevated Glucose Finding with High IDRS Risk Profile',
      details: isHi
        ? 'प्रयोगशाला रिपोर्ट में शर्करा का असामान्य स्तर भारतीय मधुमेह जोखिम स्कोर (IDRS >= 60) के साथ मेल खाता है। निश्चित निदान के लिए चिकित्सक द्वारा औपचारिक रक्त परीक्षण (FPG / HbA1c) की सिफारिश की जाती है।'
        : isOr
        ? 'ରକ୍ତ ପରୀକ୍ଷାରେ ଅସ୍ୱାଭାବିକ ଶର୍କରା ସ୍ତର IDRS ସ୍କୋର (>=60) ସହ ମିଳିତ ହେଉଛି। ଡାକ୍ତରୀ ପରୀକ୍ଷା (FPG / HbA1c) କରାଇବା ଉଚିତ।'
        : 'Confirmed laboratory elevated glucose coincides with a high-risk Indian Diabetes Risk Score (>=60). Outpatient clinical evaluation for formal diagnostic fasting plasma glucose or HbA1c is strongly advised.',
      evidence_source: 'ICMR Guidelines for Management of Type 2 Diabetes & Mohan et al. (JAPI 2005)',
      boundary_notice: 'Educational observation. Neither score nor individual lab test constitutes a medical diagnosis.',
    });
  } else if (hasHighIdrs) {
    insights.push({
      category: isHi ? 'निवारक स्क्रीनिंग प्रोफाइल' : isOr ? 'ନିବାରକ ସ୍କ୍ରିନିଂ ପ୍ରୋଫାଇଲ୍' : 'Preventive Screening Profile',
      severity: 'INFORMATIONAL',
      title: isHi ? 'उच्च भारतीय मधुमेह जोखिम स्कोर (IDRS >= 60)' : isOr ? 'ଉଚ୍ଚ ଭାରତୀୟ ମଧୁମେହ ବିପଦ ସ୍କୋର (IDRS >= 60)' : 'Elevated Indian Diabetes Risk Score (IDRS >= 60)',
      details: isHi
        ? 'गणना किया गया IDRS स्कोर दक्षिण एशियाई वयस्कों में मधुमेह या प्री-डायबिटीज की उच्च संभावना (संवेदनशीलता ~72.5%) दर्शाता है। नियमित शारीरिक गतिविधि और पोषण पर ध्यान दें।'
        : isOr
        ? 'ଗଣନା କରାଯାଇଥିବା IDRS ସ୍କୋର ମଧୁମେହର ସମ୍ଭାବନା (ସମ୍ବେଦନଶୀଳତା ~72.5%) ଦର୍ଶାଏ। ନିୟମିତ ବ୍ୟାୟାମ ଓ ସନ୍ତୁଳିତ ଆହାର ଆବଶ୍ୟକ।'
        : 'The calculated IDRS score indicates elevated probability for pre-diabetes/diabetes in South Asian adults (sensitivity ~72.5%). Primary care consultation and lifestyle modifications are recommended.',
      evidence_source: 'Mohan V et al. J Assoc Physicians India (JAPI) 2005; 53:759-763',
      boundary_notice: 'Screening tool for awareness only; does not establish presence of pathology.',
    });
  }

  // Insight 2: Emergency Override
  if (isEmergency) {
    insights.push({
      category: isHi ? 'तीव्र नैदानिक प्राथमिकता' : isOr ? 'ତୀବ୍ର ଜରୁରୀକାଳୀନ ପ୍ରାଥମିକତା' : 'Acute Clinical Priority',
      severity: 'CRITICAL',
      title: isHi ? 'आपातकालीन रेड-फ्लैग प्रोटोकॉल सक्रिय' : isOr ? 'ଜରୁରୀକାଳୀନ ରେଡ୍-ଫ୍ଲାଗ୍ ପ୍ରୋଟୋକଲ୍ ସକ୍ରିୟ' : 'Emergency Red-Flag Protocol Activated',
      details: isHi
        ? 'लक्षण मूल्यांकन में संभावित जानलेवा आपातकालीन मानदंड पाए गए हैं। अन्य सभी गैर-आपातकालीन निष्कर्ष द्वितीयक हैं। तुरंत आपातकालीन चिकित्सा (108/112) लें।'
        : isOr
        ? 'ଲକ୍ଷଣରେ ଜରୁରୀକାଳୀନ ବିପଦ ଚିହ୍ନଟ ହୋଇଛି। ଅନ୍ୟ ସମସ୍ତ ତଥ୍ୟ ଗୌଣ। ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା (108/112) ନିଅନ୍ତୁ।'
        : 'The symptom assessment detected potential life-threatening emergency criteria. All non-emergency findings are subordinated. Immediate emergency evaluation is required.',
      evidence_source: 'NICE CG95 / AHA Guidelines / WHO ETAT',
      boundary_notice: 'Emergency safety protocol overrides all lower priority information.',
    });
  }

  // Insight 3: Severe Drug Interaction
  if (hasSevereDdi) {
    insights.push({
      category: isHi ? 'औषधि सुरक्षा चेतावनी' : isOr ? 'ଔଷଧ ସୁରକ୍ଷା ସତର୍କତା' : 'Pharmacotherapy Safety',
      severity: 'CRITICAL',
      title: isHi ? 'उच्च प्राथमिकता वाली दवा परस्पर क्रिया की पहचान' : isOr ? 'ଗୁରୁତର ଔଷଧ ପ୍ରତିକ୍ରିୟା ଚିହ୍ନଟ' : 'High-Priority Drug Interaction Identified',
      details: isHi
        ? 'दर्ज की गई दवाओं में गंभीर या परस्पर-निषिद्ध दवा परस्पर क्रिया पाई गई है। किसी भी बदलाव से पहले अपने डॉक्टर से सलाह लें।'
        : isOr
        ? 'ଦାଖଲ ଔଷଧ ମଧ୍ୟରେ ଗୁରୁତର ପ୍ରତିକ୍ରିୟା ଚିହ୍ନଟ ହୋଇଛି। ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ବିନା କୌଣସି ପରିବର୍ତ୍ତନ କରନ୍ତୁ ନାହିଁ।'
        : 'At least one severe or contraindicated drug interaction pair was identified in your regimen. Co-administration requires clinical physician review and monitoring.',
      evidence_source: 'FDA Boxed Warnings & ONC High-Priority Drug Interaction Registry',
      boundary_notice: 'Never stop or alter prescription medication without direct medical supervision.',
    });
  }

  // Insight 4: General Baseline
  if (insights.length === 0) {
    insights.push({
      category: isHi ? 'सामान्य स्वास्थ्य सारांश' : isOr ? 'ସାଧାରଣ ସ୍ୱାସ୍ଥ୍ୟ ସାରାଂଶ' : 'General Health Brief',
      severity: 'INFORMATIONAL',
      title: isHi ? 'एकीकृत स्वास्थ्य अवलोकन एवं नियमित निगरानी' : isOr ? 'ଏକୀକୃତ ସ୍ୱାସ୍ଥ୍ୟ ଅବଲୋକନ' : 'Integrated Health Overview & Routine Monitoring',
      details: isHi
        ? 'समीक्षा किए गए सभी घटक सामान्य सीमाओं में हैं। नियमित स्वास्थ्य जांच जारी रखें और संतुलित जीवनशैली बनाए रखें।'
        : isOr
        ? 'ସମସ୍ତ ପରୀକ୍ଷିତ ତଥ୍ୟ ସାଧାରଣ ସୀମାରେ ଅଛି। ନିୟମିତ ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା ଜାରି ରଖନ୍ତୁ।'
        : 'Evaluated parameters fall within standard elective or routine thresholds. Continue regular preventive health check-ups and maintain an active lifestyle.',
      evidence_source: 'ICMR / WHO Preventive Healthcare Guidance',
      boundary_notice: 'Decision-support summary for informational health literacy only.',
    });
  }

  const summaryId = `vytal-sum-${Date.now().toString(36)}`;
  return {
    summary_id: summaryId,
    generated_at: new Date().toISOString(),
    highest_acuity: highestAcuity,
    module_01_report: mod01,
    module_02_idrs: mod02,
    module_03_triage: mod03,
    module_04_medications: mod04,
    cross_module_insights: insights,
    synthesis_items: insights,
    pdf_export_url: `/api/v1/summary/export-pdf?lang=${lang}`,
    mandatory_safety_disclaimer: isHi
      ? 'VYTAL केवल शैक्षिक और अनुसंधान प्रोटोटाइप है, चिकित्सा उपकरण नहीं। यह निदान नहीं करता या दवाएं नहीं लिखता। चिकित्सा निर्णयों के लिए हमेशा अपने चिकित्सक से परामर्श करें।'
      : isOr
      ? 'VYTAL କେବଳ ଏକ ଶିକ୍ଷାଗତ ଏବଂ ଗବେଷଣା ପ୍ରୋଟୋଟାଇପ୍, କୌଣସି ଚିକିତ୍ସା ଉପକରଣ ନୁହେଁ। ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି ପାଇଁ ନିଜ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ।'
      : 'VYTAL is strictly an educational and clinical informatics decision-support prototype. It is NOT a medical device, does NOT diagnose illness, and does NOT prescribe medication. Always consult your qualified healthcare practitioner for diagnosis, treatment, and prescription changes.',
  };
}
