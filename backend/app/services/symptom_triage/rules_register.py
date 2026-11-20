"""
Clinical Rule Register for Symptom Triage (Module 03)
Authoritative, auditable clinical decision rules with verified bibliographic evidence.
Supports English (en), Hindi (hi), and Odia (or).
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field


@dataclass
class RuleEvidence:
    title: str
    organization: str
    year: int
    guideline_id: str
    url: str


@dataclass
class MultilingualText:
    en: str
    hi: str
    or_: str  # 'or' is a Python keyword

    def get(self, lang: str) -> str:
        if lang == "hi":
            return self.hi
        elif lang in ("or", "odia"):
            return self.or_
        return self.en


@dataclass
class ClinicalRule:
    rule_id: str
    rule_name: str
    priority_tier: str  # EMERGENCY_RED_FLAG, HIGH_ACUITY, ROUTINE
    category: str
    version: str
    effective_date: str
    review_status: str
    evidence: RuleEvidence
    clinical_rationale: MultilingualText
    recommended_action: MultilingualText
    safety_netting: MultilingualText


CLINICAL_RULES_REGISTRY: Dict[str, ClinicalRule] = {
    "RULE-EMERG-ACS-001": ClinicalRule(
        rule_id="RULE-EMERG-ACS-001",
        rule_name="Suspected Acute Coronary Syndrome (ACS) Red Flag",
        priority_tier="EMERGENCY_RED_FLAG",
        category="cardiovascular",
        version="1.0.0",
        effective_date="2026-11-21",
        review_status="APPROVED",
        evidence=RuleEvidence(
            title="Recent-onset chest pain of suspected cardiac origin: assessment and diagnosis",
            organization="National Institute for Health and Care Excellence (NICE)",
            year=2016,
            guideline_id="CG95",
            url="https://www.nice.org.uk/guidance/cg95",
        ),
        clinical_rationale=MultilingualText(
            en="Chest pain presenting with compressive/pressure characteristics, radiation to the jaw, neck, or left arm, or associated acute dyspnea and diaphoresis warrants immediate emergency exclusion of acute myocardial infarction.",
            hi="दबाव या भारीपन वाला सीने का दर्द, जो जबड़े, गर्दन या बाएं हाथ में फैले, या जिसके साथ सांस लेने में तकलीफ और पसीना आए, उसमें तुरंत आपातकालीन दिल का दौरा (मायोकार्डियल रोधगलन) की जांच जरूरी है।",
            or_="ଛାତିରେ ଚାପ ବା ଭାରୀପଣ ଯନ୍ତ୍ରଣା, ଯାହା ମୁଖମଣ୍ଡଳ, ବେକ କିମ୍ବା ବାମ ହାତକୁ ବ୍ୟାପେ, କିମ୍ବା ଶ୍ୱାସକଷ୍ଟ ଓ ଝାଳ ସହିତ ଥାଏ, ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ହୃଦଘାତ (ମାୟୋକାର୍ଡିଆଲ୍ ଇନଫାର୍କସନ୍) ପରୀକ୍ଷା ଆବଶ୍ୟକ କରେ।",
        ),
        recommended_action=MultilingualText(
            en="CALL EMERGENCY SERVICES (108 / 112) IMMEDIATELY. Rest quietly in a comfortable seated position. Do not drive yourself to hospital.",
            hi="तुरंत आपातकालीन एम्बुलेंस (108 / 112) को कॉल करें। आराम से बैठें। स्वयं गाड़ी चलाकर अस्पताल न जाएं।",
            or_="ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ସେବା (108 / 112) କୁ କଲ୍ କରନ୍ତୁ। ଶାନ୍ତ ଭାବରେ ବସି ରୁହନ୍ତୁ। ନିଜେ ଗାଡ଼ି ଚଳାଇ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ ନାହିଁ।",
        ),
        safety_netting=MultilingualText(
            en="If the person becomes unresponsive or stops breathing normally, begin cardiopulmonary resuscitation (CPR) immediately if trained.",
            hi="यदि व्यक्ति बेहोश हो जाए या सांस लेना बंद कर दे, तो प्रशिक्षित होने पर तुरंत सीपीआर (CPR) शुरू करें।",
            or_="ଯଦି ବ୍ୟକ୍ତି ଅଚେତ ହୋଇଯାଆନ୍ତି ବା ଶ୍ୱାସ ବନ୍ଦ ହୋଇଯାଏ, ପ୍ରଶିକ୍ଷିତ ଥିଲେ ତୁରନ୍ତ ସିପିଆର (CPR) ଆରମ୍ଭ କରନ୍ତୁ।",
        ),
    ),
    "RULE-EMERG-STRK-002": ClinicalRule(
        rule_id="RULE-EMERG-STRK-002",
        rule_name="Acute Stroke / Cerebrovascular Event (BE-FAST) Red Flag",
        priority_tier="EMERGENCY_RED_FLAG",
        category="cerebrovascular",
        version="1.0.0",
        effective_date="2026-11-21",
        review_status="APPROVED",
        evidence=RuleEvidence(
            title="Guidelines for the Early Management of Patients With Acute Ischemic Stroke",
            organization="American Heart Association / American Stroke Association (AHA/ASA)",
            year=2019,
            guideline_id="Stroke 2019; 50:e344-e418",
            url="https://www.ahajournals.org/doi/10.1161/STR.0000000000000211",
        ),
        clinical_rationale=MultilingualText(
            en="Sudden onset of facial asymmetry, unilateral limb weakness, speech slurring, or visual disturbance indicates acute cerebrovascular compromise requiring immediate neurovascular intervention within the critical thrombolysis window.",
            hi="अचानक चेहरे का टेढ़ापन, एक तरफ के हाथ-पैर में कमजोरी, बोलने में कठिनाई या दृष्टि हानि तीव्र स्ट्रोक का संकेत है, जिसमें तुरंत अस्पताल में उपचार की आवश्यकता होती है।",
            or_="ହଠାତ୍ ମୁହଁ ବଙ୍କା ହୋଇଯିବା, ଏକପାଖିଆ ହାତ-ଗୋଡ଼ ଦୁର୍ବଳତା, କହିବାରେ ଅସୁବିଧା ବା ଦୃଷ୍ଟିଶକ୍ତି ହ୍ରାସ ଏକ ତୀବ୍ର ଷ୍ଟ୍ରୋକ୍ ର ଲକ୍ଷଣ, ଯାହା ପାଇଁ ତୁରନ୍ତ ଡାକ୍ତରଖାନାରେ ଚିକିତ୍ସା ଆବଶ୍ୟକ।",
        ),
        recommended_action=MultilingualText(
            en="CALL EMERGENCY MEDICAL SERVICES (108 / 112) IMMEDIATELY. Record the exact time symptoms started. Do NOT give aspirin, food, or liquids.",
            hi="तुरंत आपातकालीन चिकित्सा सेवा (108 / 112) को कॉल करें। लक्षण शुरू होने का सटीक समय नोट करें। एस्पिरिन या कुछ भी खाने-पीने को न दें।",
            or_="ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ସେବା (108 / 112) କୁ କଲ୍ କରନ୍ତୁ। ଲକ୍ଷଣ ଆରମ୍ଭ ହେବାର ସଠିକ୍ ସମୟ ଲେଖି ରଖନ୍ତୁ। ଆସ୍ପିରିନ୍ ବା କୌଣସି ଖାଦ୍ୟ/ପାନୀୟ ଦିଅନ୍ତୁ ନାହିଁ।",
        ),
        safety_netting=MultilingualText(
            en="Keep patient safely lying on their side (recovery position) if drowsy or vomiting to safeguard the airway.",
            hi="उल्टी या उनींदापन होने पर वायुमार्ग सुरक्षित रखने के लिए मरीज को करवट से लिटाएं।",
            or_="ବାନ୍ତି ବା ମୁଣ୍ଡ ଝିମଝିମ ହେଲେ ଶ୍ୱାସନଳୀ ସୁରକ୍ଷିତ ରଖିବା ପାଇଁ ରୋଗୀଙ୍କୁ କଡ଼ ମାଡ଼ି ଶୁଆଇ ରଖନ୍ତୁ।",
        ),
    ),
    "RULE-EMERG-RESP-003": ClinicalRule(
        rule_id="RULE-EMERG-RESP-003",
        rule_name="Acute Severe Respiratory Compromise Red Flag",
        priority_tier="EMERGENCY_RED_FLAG",
        category="respiratory",
        version="1.0.0",
        effective_date="2026-11-21",
        review_status="APPROVED",
        evidence=RuleEvidence(
            title="Emergency Triage Assessment and Treatment (ETAT) Guidelines",
            organization="World Health Organization (WHO)",
            year=2016,
            guideline_id="WHO-ETAT-2016",
            url="https://www.who.int/publications/i/item/9789241511117",
        ),
        clinical_rationale=MultilingualText(
            en="Audible stridor at rest, inability to complete full sentences in a single breath, central cyanosis, or significant accessory muscle retractions indicate critical respiratory decompensation.",
            hi="विश्राम के समय सांस में सीटी/घड़घड़ाहट (स्ट्राइडोर), एक सांस में पूरा वाक्य न बोल पाना, होंठ नीले पड़ना, या सांस लेने में अत्यधिक जोर लगना गंभीर श्वसन विफलता का संकेत है।",
            or_="ବିଶ୍ରାମ ସମୟରେ ଶ୍ୱାସ ଶବ୍ଦ (ଷ୍ଟ୍ରାଇଡୋର୍), ଗୋଟିଏ ନିଶ୍ୱାସରେ ବାକ୍ୟ ପୂରା ନକହିପାରିବା, ଓଠ ନୀଳ ପଡ଼ିବା କିମ୍ବା ଛାତିର ଅତ୍ୟଧିକ ଚାପ ଗୁରୁତର ଶ୍ୱାସକଷ୍ଟର ସଙ୍କେତ।",
        ),
        recommended_action=MultilingualText(
            en="CALL EMERGENCY MEDICAL SERVICES (108 / 112) IMMEDIATELY. Keep patient sitting upright in high Fowler's position. Ensure airway is completely clear.",
            hi="तुरंत आपातकालीन चिकित्सा सेवा (108 / 112) को कॉल करें। मरीज को सीधा बैठा कर रखें। वायुमार्ग खुला रखें।",
            or_="ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ସେବା (108 / 112) କୁ ଡାକନ୍ତୁ। ରୋଗୀଙ୍କୁ ସିଧା ବସାଇ ରଖନ୍ତୁ ଏବଂ ଶ୍ୱାସପଥ ସଫା ରଖନ୍ତୁ।",
        ),
        safety_netting=MultilingualText(
            en="Do not force patient to lie down. Loosen all tight clothing around the neck and chest.",
            hi="मरीज को जबरन लेटने न दें। गर्दन और छाती के आसपास के तंग कपड़े ढीले करें।",
            or_="ରୋଗୀଙ୍କୁ ବଳପୂର୍ବକ ଶୁଆନ୍ତୁ ନାହିଁ। ବେକ ଓ ଛାତି ପାଖର ଚିପା ପୋଷାକ ଢିଲା କରନ୍ତୁ।",
        ),
    ),
    "RULE-EMERG-ANAPH-004": ClinicalRule(
        rule_id="RULE-EMERG-ANAPH-004",
        rule_name="Anaphylaxis / Severe Systemic Allergic Reaction Red Flag",
        priority_tier="EMERGENCY_RED_FLAG",
        category="immunological",
        version="1.0.0",
        effective_date="2026-11-21",
        review_status="APPROVED",
        evidence=RuleEvidence(
            title="World Allergy Organization (WAO) Anaphylaxis Guidelines",
            organization="World Allergy Organization (WAO)",
            year=2020,
            guideline_id="WAO-Anaph-2020",
            url="https://doi.org/10.1016/j.waojou.2020.100472",
        ),
        clinical_rationale=MultilingualText(
            en="Acute allergic exposure followed by airway swelling, stridor, or generalized urticaria combined with hypotension or dyspnea is life-threatening anaphylaxis requiring immediate intramuscular epinephrine.",
            hi="एलर्जी या कीट दंश के बाद गले में सूजन, सांस में घरघराहट या त्वचा पर चकत्तों के साथ चक्कर या सांस फूलना जानलेवा एनाफिलेक्सिस है, जिसमें तत्काल एपिनेफ्रीन और अस्पताल उपचार चाहिए।",
            or_="ଏଲର୍ଜି ବା କୀଟ କାମୁଡ଼ା ପରେ ଗଳା ଫୁଲିବା, ଶ୍ୱାସକଷ୍ଟ କିମ୍ବା ଶରୀରରେ କୁଣ୍ଡିଆ ସହ ମୁଣ୍ଡ ବୁଲାଇବା ଗୁରୁତର ଆନାଫାଇଲାକ୍ସିସ୍, ଯାହା ପାଇଁ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଚିକିତ୍ସା ଆବଶ୍ୟକ।",
        ),
        recommended_action=MultilingualText(
            en="ADMINISTER INTRAMUSCULAR EPINEPHRINE (EpiPen) IF PRESCRIBED. CALL 108 / 112 IMMEDIATELY. Lay patient flat with legs elevated unless breathing is difficult.",
            hi="यदि निर्धारित हो तो तुरंत एपिनेफ्रीन ऑटो-इंजेक्टर (EpiPen) लगाएं। तुरंत 108 / 112 पर कॉल करें। सांस लेने में कठिनाई न हो तो पैरों को ऊपर उठाकर लिटाएं।",
            or_="ଡାକ୍ତରୀ ପରାମର୍ଶ ଥିଲେ ତୁରନ୍ତ ଏପିନେଫ୍ରିନ୍ (EpiPen) ପ୍ରୟୋଗ କରନ୍ତୁ। 108 / 112 କୁ କଲ୍ କରନ୍ତୁ। ଶ୍ୱାସକଷ୍ଟ ନଥିଲେ ଗୋଡ଼ ଉପରକୁ କରି ଶୁଆଇ ରଖନ୍ତୁ।",
        ),
        safety_netting=MultilingualText(
            en="A second dose of epinephrine may be administered after 5-15 minutes if symptoms persist and emergency medical services have not yet arrived.",
            hi="यदि लक्षण बने रहें और एम्बुलेंस न पहुंचे तो 5-15 मिनट बाद दूसरी खुराक दी जा सकती है।",
            or_="ଯଦି ଲକ୍ଷଣ ଜାରି ରହେ ଓ ଆମ୍ବୁଲାନ୍ସ ନପହଞ୍ଚେ, 5-15 ମିନିଟ୍ ପରେ ଦ୍ୱିତୀୟ ଡୋଜ୍ ଦିଆଯାଇପାରେ।",
        ),
    ),
    "RULE-EMERG-NEURO-005": ClinicalRule(
        rule_id="RULE-EMERG-NEURO-005",
        rule_name="Thunderclap Headache / Acute Meningism Red Flag",
        priority_tier="EMERGENCY_RED_FLAG",
        category="neurological",
        version="1.0.0",
        effective_date="2026-11-21",
        review_status="APPROVED",
        evidence=RuleEvidence(
            title="Headaches in over 12s: diagnosis and management",
            organization="National Institute for Health and Care Excellence (NICE)",
            year=2021,
            guideline_id="CG150",
            url="https://www.nice.org.uk/guidance/cg150",
        ),
        clinical_rationale=MultilingualText(
            en="A thunderclap headache reaching maximum severity within 1 minute, or severe headache associated with high fever, neck stiffness, and photophobia suggests subarachnoid hemorrhage or acute bacterial meningitis.",
            hi="अचानक 1 मिनट के भीतर होने वाला असहनीय सिरदर्द (थंडरक्लैप), या तेज बुखार, गर्दन में अकड़न और रोशनी से परेशानी के साथ सिरदर्द सबअराक्नॉइड रक्तस्राव या मेनिन्जाइटिस का संकेत हो सकता है।",
            or_="ହଠାତ୍ 1 ମିନିଟ୍ ମଧ୍ୟରେ ଅସହ୍ୟ ମୁଣ୍ଡବିନ୍ଧା (ଥଣ୍ଡରକ୍ଲାପ୍), କିମ୍ବା ଉଚ୍ଚ ଜ୍ୱର, ବେକ ଟାଣ ହେବା ଓ ଆଲୋକ ଅସହ୍ୟ ହେବା ସହ ମୁଣ୍ଡବିନ୍ଧା ମେନିଞ୍ଜାଇଟିସ୍ ବା ରକ୍ତସ୍ରାବର ସଙ୍କେତ ହୋଇପାରେ।",
        ),
        recommended_action=MultilingualText(
            en="CALL EMERGENCY SERVICES (108 / 112) IMMEDIATELY for urgent brain imaging and neuro-intensive evaluation.",
            hi="मस्तिष्क स्कैन (CT) और तत्काल आपातकालीन न्यूरो मूल्यांकन हेतु तुरंत 108 / 112 पर कॉल करें।",
            or_="ତୁରନ୍ତ ବ୍ରେନ୍ ସ୍କାନ ଓ ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା ପାଇଁ 108 / 112 କୁ କଲ୍ କରନ୍ତୁ।",
        ),
        safety_netting=MultilingualText(
            en="Keep patient in a dark, quiet room while awaiting emergency transport.",
            hi="एम्बुलेंस की प्रतीक्षा के दौरान मरीज को शांत, अंधेरे कमरे में रखें।",
            or_="ଆମ୍ବୁଲାନ୍ସ ଆସିବା ପର୍ଯ୍ୟନ୍ତ ରୋଗୀଙ୍କୁ ଏକ ଶାନ୍ତ, ଅନ୍ଧାରିଆ କୋଠରୀରେ ରଖନ୍ତୁ।",
        ),
    ),
    "RULE-EMERG-SEPS-006": ClinicalRule(
        rule_id="RULE-EMERG-SEPS-006",
        rule_name="Suspected Severe Sepsis / Septic Shock Alert",
        priority_tier="EMERGENCY_RED_FLAG",
        category="infectious",
        version="1.0.0",
        effective_date="2026-11-21",
        review_status="APPROVED",
        evidence=RuleEvidence(
            title="Surviving Sepsis Campaign: International Guidelines for Management of Sepsis and Septic Shock",
            organization="Surviving Sepsis Campaign / Critical Care Medicine",
            year=2021,
            guideline_id="SCCM-ESICM-2021",
            url="https://doi.org/10.1097/CCM.0000000000005337",
        ),
        clinical_rationale=MultilingualText(
            en="Infection symptoms accompanied by altered mental status, severe rigors, rapid breathing, mottled skin, or absent urine output indicate life-threatening systemic organ hypoperfusion (severe sepsis).",
            hi="संक्रमण के साथ भ्रम/उलझन, अत्यधिक कंपकंपी, तेज सांस, त्वचा पर नीले धब्बे, या 18 घंटे से पेशाब न होना गंभीर सेप्सिस का संकेत है, जो तुरंत आईसीयू स्तर का उपचार मांगता है।",
            or_="ସଂକ୍ରମଣ ସହିତ ମାନସିକ ବିଭ୍ରାନ୍ତି, ପ୍ରବଳ କମ୍ପନ, ଦ୍ରୁତ ଶ୍ୱାସକ୍ରିୟା, ଚର୍ମରେ ଚିହ୍ନ ବା ପରିସ୍ରା ବନ୍ଦ ହେବା ପ୍ରାଣଘାତୀ ସେପସିସ୍ ର ଲକ୍ଷଣ, ଯାହା ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯତ୍ନ ଆବଶ୍ୟକ କରେ।",
        ),
        recommended_action=MultilingualText(
            en="TRANSFER TO EMERGENCY DEPARTMENT IMMEDIATELY (108 / 112). Inform triage staff of suspected SEPSIS for immediate intravenous fluids, blood cultures, and lactate testing.",
            hi="तुरंत आपातकालीन विभाग (108 / 112) जाएं। स्टाफ को संदिग्ध सेप्सिस के बारे में सूचित करें ताकि त्वरित एंटीबायोटिक और आईवी फ्लुइड्स शुरू किए जा सकें।",
            or_="ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ବିଭାଗ (108 / 112) କୁ ଯାଆନ୍ତୁ ଏବଂ ସେପସିସ୍ ବିଷୟରେ ଡାକ୍ତରଙ୍କୁ ଅବଗତ କରାନ୍ତୁ।",
        ),
        safety_netting=MultilingualText(
            en="Every hour of delay in sepsis intervention increases mortality risk. Do not adopt a wait-and-see approach.",
            hi="सेप्सिस में हर एक घंटे की देरी जानलेवा हो सकती है। बिल्कुल भी इंतजार न करें।",
            or_="ସେପସିସ୍ ଚିକିତ୍ସାରେ ପ୍ରତି ଘଣ୍ଟାର ବିଳମ୍ବ ବିପଜ୍ଜନକ। ଆଦୌ ଅପେକ୍ଷା କରନ୍ତୁ ନାହିଁ।",
        ),
    ),
    "RULE-URG-DKA-007": ClinicalRule(
        rule_id="RULE-URG-DKA-007",
        rule_name="Suspected Hyperglycemic Crisis / Diabetic Ketoacidosis (DKA)",
        priority_tier="HIGH_ACUITY",
        category="metabolic",
        version="1.0.0",
        effective_date="2026-11-21",
        review_status="APPROVED",
        evidence=RuleEvidence(
            title="Standards of Medical Care in Diabetes: Diabetes Emergencies",
            organization="American Diabetes Association (ADA)",
            year=2024,
            guideline_id="ADA-Standards-2024",
            url="https://diabetesjournals.org/care/issue/47/Supplement_1",
        ),
        clinical_rationale=MultilingualText(
            en="Unquenchable thirst, frequent urination, persistent vomiting, abdominal pain, and fruity acetone breath odor in a person with diabetes or severe hyperglycemia indicate potential Diabetic Ketoacidosis or Hyperosmolar Hyperglycemic State.",
            hi="मधुमेह के रोगी में अत्यधिक प्यास, बार-बार पेशाब, लगातार उल्टी, पेट दर्द और सांस में फलों जैसी गंध डायबिटिक कीटोएसिडोसिस (DKA) का संकेत हो सकती है।",
            or_="ମଧୁମେହ ରୋଗୀଙ୍କଠାରେ ଅତ୍ୟଧିକ ଶୋଷ, ବାରମ୍ବାର ପରିସ୍ରା, ଲଗାତାର ବାନ୍ତି, ପେଟ ଯନ୍ତ୍ରଣା ଏବଂ ନିଶ୍ୱାସରେ ଫଳ ପରି ଗନ୍ଧ ଡାୟାବେଟିକ୍ କିଟୋଏସିଡୋସିସ୍ (DKA) ର ସଙ୍କେତ ହୋଇପାରେ।",
        ),
        recommended_action=MultilingualText(
            en="SEEK SAME-DAY URGENT HOSPITAL EVALUATION. Check blood glucose and urine/blood ketones immediately if home monitoring meters are available.",
            hi="आज ही तत्काल अस्पताल जाकर जांच कराएं। यदि मीटर उपलब्ध हो तो तुरंत ब्लड ग्लूकोज और कीटोन की जांच करें।",
            or_="ଆଜି ହିଁ ତୁରନ୍ତ ଡାକ୍ତରଖାନାରେ ପରୀକ୍ଷା କରାନ୍ତୁ। ମିଟର ଥିଲେ ତୁରନ୍ତ ରକ୍ତ ଶର୍କରା ଓ କିଟୋନ୍ ଯାଞ୍ଚ କରନ୍ତୁ।",
        ),
        safety_netting=MultilingualText(
            en="If the patient develops confusion, deep rapid breathing, or is unable to retain liquids, proceed to the nearest Emergency Department immediately.",
            hi="यदि भ्रम, अत्यधिक गहरी सांस, या पानी भी न पच पाने की स्थिति हो, तो तुरंत निकटतम इमरजेंसी विभाग जाएं।",
            or_="ଯଦି ଅଚେତ ଭାବ, ଗଭୀର ଦ୍ରୁତ ଶ୍ୱାସକ୍ରିୟା ବା ପାଣି ମଧ୍ୟ ନ ରହିପାରେ, ତୁରନ୍ତ ନିକଟତମ ଜରୁରୀକାଳୀନ ବିଭାଗକୁ ଯାଆନ୍ତୁ।",
        ),
    ),
    "RULE-ROUT-METAB-008": ClinicalRule(
        rule_id="RULE-ROUT-METAB-008",
        rule_name="Routine Primary Care Evaluation & Lifestyle Review",
        priority_tier="ROUTINE",
        category="metabolic",
        version="1.0.0",
        effective_date="2026-11-21",
        review_status="APPROVED",
        evidence=RuleEvidence(
            title="ICMR Guidelines for Management of Type 2 Diabetes & NICE Primary Care Summaries",
            organization="Indian Council of Medical Research (ICMR) / NICE",
            year=2018,
            guideline_id="ICMR-T2D-2018",
            url="https://main.icmr.nic.in",
        ),
        clinical_rationale=MultilingualText(
            en="Reported symptoms represent non-acute, subacute, or chronic presentations without emergency red flags. These findings warrant comprehensive elective outpatient consultation.",
            hi="दर्ज किए गए लक्षण गैर-आपातकालीन और दीर्घकालिक हैं, जिनमें कोई आपातकालीन चेतावनी संकेत नहीं है। इसके लिए नियमित बाह्य रोगी (OPD) परामर्श की सलाह दी जाती है।",
            or_="ଉଲ୍ଲେଖ କରାଯାଇଥିବା ଲକ୍ଷଣଗୁଡ଼ିକ ଅଣ-ଜରୁରୀକାଳୀନ ଓ ପୁରୁଣା ଅଟେ, ଯେଉଁଥିରେ କୌଣସି ଜରୁରୀ ବିପଦ ସଙ୍କେତ ନାହିଁ। ଏଥିପାଇଁ ନିୟମିତ ଡାକ୍ତରୀ ପରାମର୍ଶ ଉପଯୁକ୍ତ।",
        ),
        recommended_action=MultilingualText(
            en="Schedule an elective outpatient consultation with your primary care physician. Prepare a list of current symptoms, duration, and regular medications.",
            hi="अपने प्राथमिक चिकित्सक के साथ एक नियमित ओपीडी परामर्श बुक करें। अपने लक्षणों और दवाओं की सूची तैयार रखें।",
            or_="ଆପଣଙ୍କ ପ୍ରାଥମିକ ଚିକିତ୍ସକଙ୍କ ସହିତ ନିୟମିତ ଡାକ୍ତରୀ ପରାମର୍ଶ କରନ୍ତୁ। ଆପଣଙ୍କ ଲକ୍ଷଣ ଓ ଔଷଧର ତାଲିକା ପ୍ରସ୍ତୁତ ରଖନ୍ତୁ।",
        ),
        safety_netting=MultilingualText(
            en="MANDATORY SAFETY-NET: If your symptoms worsen, or if you develop severe chest pressure, sudden weakness, severe shortness of breath, or high fever, seek emergency medical attention immediately.",
            hi="अनिवार्य सुरक्षा चेतावनी: यदि लक्षण बिगड़ते हैं, या सीने में भारीपन, अचानक कमजोरी, गंभीर सांस की तकलीफ या तेज बुखार हो, तो तुरंत आपातकालीन चिकित्सा सहायता लें।",
            or_="ବାଧ୍ୟତାମୂଳକ ସୁରକ୍ଷା ଚେତାବନୀ: ଯଦି ଆପଣଙ୍କ ଲକ୍ଷଣ ବୃଦ୍ଧି ପାଏ, କିମ୍ବା ଛାତିରେ ଭାରୀ ଯନ୍ତ୍ରଣା, ହଠାତ୍ ଦୁର୍ବଳତା, ଅତ୍ୟଧିକ ଶ୍ୱାସକଷ୍ଟ କିମ୍ବା ଉଚ୍ଚ ଜ୍ୱର ଦେଖାଦିଏ, ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ଡାକ୍ତରୀ ସହାୟତା ନିଅନ୍ତୁ।",
        ),
    ),
}
