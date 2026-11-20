"""
Curated Drug-Drug Interaction Registry and Interaction Evaluator (Module 04)
Contains clinically verified pairwise interactions derived from the ONC High-Priority List,
FDA Boxed Warnings, and Clinical Pharmacology Compendia.
Supports English (en), Hindi (hi), and Odia (or).
"""

from typing import List, Dict, Any, Optional, Set
from dataclasses import dataclass
from backend.app.schemas.medications import (
    MedicationCheckItemInput,
    DetectedInteractionInfo,
    MedicationCheckResponse,
)
from backend.app.services.medication_checker.catalog import (
    resolve_to_canonical_ingredient,
    MedicationConceptRecord,
)


@dataclass
class MultilingualNote:
    en: str
    hi: str
    or_: str

    def get(self, lang: str) -> str:
        if lang == "hi":
            return self.hi
        elif lang in ("or", "odia"):
            return self.or_
        return self.en


@dataclass
class CuratedInteractionRecord:
    pair: Set[str]  # frozenset of generic names
    severity: str  # CONTRAINDICATED, SEVERE, MODERATE, MINOR
    mechanism: str
    clinical_description: MultilingualNote
    evidence_source: str
    management_guidance: MultilingualNote


CURATED_INTERACTION_REGISTER: List[CuratedInteractionRecord] = [
    # 1. Metformin + Iodinated Radiocontrast
    CuratedInteractionRecord(
        pair={"Metformin", "Iodinated Radiocontrast"},
        severity="CONTRAINDICATED",
        mechanism="Contrast-induced acute kidney injury leads to metformin accumulation and potentially fatal lactic acidosis.",
        clinical_description=MultilingualNote(
            en="Intravascular iodinated contrast media can impair renal function, leading to acute accumulation of metformin and triggering life-threatening lactic acidosis.",
            hi="आयोडिनेटेड कंट्रास्ट मीडिया गुर्दे (किडनी) के कार्य को प्रभावित कर सकता है, जिससे मेटफॉर्मिन शरीर में जमा हो सकती है और जानलेवा लैक्टिक एसिडोसिस हो सकता है।",
            or_="ଆୟୋଡିନେଟେଡ୍ କଣ୍ଟ୍ରାଷ୍ଟ ମିଡିଆ ବୃକ୍‌କ (କିଡନୀ) କାର୍ଯ୍ୟକ୍ଷମତା ହ୍ରାସ କରିପାରେ, ଯାହା ଫଳରେ ମେଟଫର୍ମିନ୍ ଜମା ହୋଇ ବିପଜ୍ଜନକ ଲାକ୍ଟିକ୍ ଏସିଡୋସିସ୍ ସୃଷ୍ଟି କରିପାରେ।",
        ),
        evidence_source="FDA Boxed Warning & American College of Radiology (ACR) Contrast Manual",
        management_guidance=MultilingualNote(
            en="Clinical standard: Withhold metformin prior to or at time of iodinated contrast procedure and re-evaluate eGFR 48 hours post-procedure before resuming.",
            hi="चिकित्सीय मानक: कंट्रास्ट प्रक्रिया से पहले मेटफॉर्मिन रोकें और प्रक्रिया के 48 घंटे बाद किडनी की जांच (eGFR) सामान्य होने पर ही पुनः शुरू करें।",
            or_="ଡାକ୍ତରୀ ମାନକ: କଣ୍ଟ୍ରାଷ୍ଟ ପରୀକ୍ଷା ପୂର୍ବରୁ ମେଟଫର୍ମିନ୍ ବନ୍ଦ ରଖନ୍ତୁ ଏବଂ 48 ଘଣ୍ଟା ପରେ କିଡନୀ ପରୀକ୍ଷା କରି ପୁନର୍ବାର ଆରମ୍ଭ କରନ୍ତୁ।",
        ),
    ),

    # 2. Aspirin + Warfarin
    CuratedInteractionRecord(
        pair={"Aspirin", "Warfarin"},
        severity="SEVERE",
        mechanism="Synergistic pharmacodynamic inhibition of platelet aggregation and coagulation factors.",
        clinical_description=MultilingualNote(
            en="Concurrent use of aspirin with warfarin drastically potentiates the risk of major upper gastrointestinal and intracranial hemorrhage.",
            hi="एस्पिरिन और वारफेरिन का एक साथ उपयोग पेट में गंभीर रक्तस्राव और मस्तिष्क में रक्तस्राव (ब्रेन हैमरेज) के जोखिम को अत्यधिक बढ़ा देता है।",
            or_="ଆସ୍ପିରିନ୍ ଓ ୱାର୍ଫାରିନ୍ ଏକତ୍ର ବ୍ୟବହାର କଲେ ପେଟ ଓ ମସ୍ତିଷ୍କରେ ଗୁରୁତର ରକ୍ତସ୍ରାବର ଆଶଙ୍କା ବହୁଗୁଣିତ ହୋଇଥାଏ।",
        ),
        evidence_source="ONC High-Priority Drug Interaction List & CHEST Guidelines",
        management_guidance=MultilingualNote(
            en="Combined therapy requires rigorous clinical justification (e.g. mechanical heart valve), gastroprotection (PPI), and frequent INR monitoring.",
            hi="संयुक्त चिकित्सा के लिए सख्त चिकित्सीय कारण, पेट की सुरक्षा की दवा (PPI), और नियमित INR जांच आवश्यक है।",
            or_="ଏହି ମିଶ୍ରଣ ପାଇଁ ବିଶେଷ ଡାକ୍ତରୀ ନିରୀକ୍ଷଣ, ପେଟ ସୁରକ୍ଷା ଔଷଧ ଏବଂ ନିୟମିତ INR ରକ୍ତ ପରୀକ୍ଷା ଜରୁରୀ।",
        ),
    ),

    # 3. Clopidogrel + Omeprazole
    CuratedInteractionRecord(
        pair={"Clopidogrel", "Omeprazole"},
        severity="SEVERE",
        mechanism="Omeprazole competitively inhibits CYP2C19, preventing metabolic activation of clopidogrel prodrug into active antiplatelet metabolite.",
        clinical_description=MultilingualNote(
            en="Omeprazole significantly reduces the antiplatelet effectiveness of clopidogrel, substantially elevating the risk of stent thrombosis and recurrent myocardial infarction.",
            hi="ओमेप्राजोल क्लोपिडोग्रेल के प्रभाव को कम कर देता है, जिससे दिल का दौरा और हार्ट स्टेंट में खून का थक्का जमने का खतरा बढ़ जाता है।",
            or_="ଓମେପ୍ରାଜୋଲ୍ କ୍ଲୋପିଡୋଗ୍ରେଲ୍ ର କାର୍ଯ୍ୟକାରିତାକୁ ହ୍ରାସ କରିଥାଏ, ଯାହା ଫଳରେ ହୃଦଘାତ ଓ ଷ୍ଟେଣ୍ଟରେ ରକ୍ତ ଜମାଟ ବାନ୍ଧିବା ଆଶଙ୍କା ବଢ଼ିଯାଏ।",
        ),
        evidence_source="FDA Drug Safety Communication & ACC/AHA Practice Guidelines",
        management_guidance=MultilingualNote(
            en="Guidance: If gastroprotection is required with clopidogrel, guidelines recommend pantoprazole as an alternative because it exhibits minimal CYP2C19 inhibition.",
            hi="निर्देश: यदि पेट की सुरक्षा आवश्यक हो, तो पैंटोप्राजोल का उपयोग अनुशंसित है क्योंकि यह क्लोपिडोग्रेल को प्रभावित नहीं करता।",
            or_="ପରାମର୍ଶ: ପେଟ ସୁରକ୍ଷା ପାଇଁ ପାଣ୍ଟୋପ୍ରାଜୋଲ୍ ବ୍ୟବହାର କରିବା ଉପଯୁକ୍ତ, କାରଣ ଏହା କ୍ଲୋପିଡୋଗ୍ରେଲ୍ କାର୍ଯ୍ୟରେ ବାଧା ସୃଷ୍ଟି କରେ ନାହିଁ।",
        ),
    ),

    # 4. Ramipril / Telmisartan + Spironolactone (Severe Hyperkalemia)
    CuratedInteractionRecord(
        pair={"Ramipril", "Spironolactone"},
        severity="SEVERE",
        mechanism="Dual blockade of aldosterone and angiotensin pathways impedes renal potassium excretion, risking life-threatening cardiac arrhythmias.",
        clinical_description=MultilingualNote(
            en="Combining an ACE inhibitor (Ramipril) with a potassium-sparing diuretic (Spironolactone) can trigger severe hyperkalemia leading to lethal ventricular dysrhythmias.",
            hi="रेमीप्रिल और स्पिरोनोलैक्टोन को एक साथ लेने से रक्त में पोटेशियम खतरनाक स्तर तक बढ़ सकता है (हाइपरकेलेमिया), जिससे दिल की धड़कन रुकने का खतरा होता है।",
            or_="ରାମିପ୍ରିଲ୍ ଓ ସ୍ପିରୋନୋଲାକ୍ଟୋନ୍ ଏକାଠି ବ୍ୟବହାର କଲେ ରକ୍ତରେ ପୋଟାସିୟମ୍ ବିପଜ୍ଜନକ ଭାବେ ବଢ଼ି ହୃଦସ୍ପନ୍ଦନ ଅନିୟମିତ ହୋଇପାରେ।",
        ),
        evidence_source="ONC High-Priority Drug Interaction List & AHA/ACC Heart Failure Guidelines",
        management_guidance=MultilingualNote(
            en="Guidance: Strict baseline and ongoing serum potassium and creatinine monitoring within 1 week of co-initiation.",
            hi="निर्देश: दवा शुरू करने के 1 सप्ताह के भीतर सीरम पोटेशियम और क्रिएटिनिन की जांच अनिवार्य है।",
            or_="ପରାମର୍ଶ: ଔଷଧ ଆରମ୍ଭ କରିବାର ଗୋଟିଏ ସପ୍ତାହ ମଧ୍ୟରେ ପୋଟାସିୟମ୍ ଓ କ୍ରିଏଟିନିନ୍ ପରୀକ୍ଷା ବାଧ୍ୟତାମୂଳକ।",
        ),
    ),
    CuratedInteractionRecord(
        pair={"Telmisartan", "Spironolactone"},
        severity="SEVERE",
        mechanism="Dual renin-angiotensin-aldosterone axis inhibition impairs renal potassium elimination.",
        clinical_description=MultilingualNote(
            en="Combining an ARB (Telmisartan) with Spironolactone significantly elevates serum potassium, risking cardiac arrest.",
            hi="टेल्मीसार्टन और स्पिरोनोलैक्टोन को एक साथ लेने से पोटेशियम अत्यधिक बढ़ सकता है, जिससे दिल का दौरा पड़ सकता है।",
            or_="ଟେଲମିସାର୍ଟାନ୍ ଓ ସ୍ପିରୋନୋଲାକ୍ଟୋନ୍ ର ଏକତ୍ର ବ୍ୟବହାର ରକ୍ତରେ ପୋଟାସିୟମ୍ ବୃଦ୍ଧି କରି ହୃଦଘାତର କାରଣ ହୋଇପାରେ।",
        ),
        evidence_source="ONC High-Priority Drug Interaction List",
        management_guidance=MultilingualNote(
            en="Guidance: Frequent electrolyte monitoring; avoid concurrent dietary potassium supplements.",
            hi="निर्देश: नियमित इलेक्ट्रोलाइट जांच करें; अतिरिक्त पोटेशियम सप्लीमेंट्स से बचें।",
            or_="ପରାମର୍ଶ: ନିୟମିତ ଇଲେକ୍ଟ୍ରୋଲାଇଟ୍ ପରୀକ୍ଷା କରାନ୍ତୁ; ପୋଟାସିୟମ୍ ଯୁକ୍ତ ସପ୍ଲିମେଣ୍ଟ ଖାଆନ୍ତୁ ନାହିଁ।",
        ),
    ),

    # 5. Ciprofloxacin + Warfarin
    CuratedInteractionRecord(
        pair={"Ciprofloxacin", "Warfarin"},
        severity="SEVERE",
        mechanism="Ciprofloxacin potently inhibits hepatic CYP1A2 and alters gut flora synthesis of Vitamin K, drastically increasing warfarin exposure.",
        clinical_description=MultilingualNote(
            en="Ciprofloxacin impairs warfarin metabolism and reduces intestinal vitamin K production, causing rapid, marked elevations in INR and severe hemorrhage.",
            hi="सिप्रोफ्लोक्सासिन वारफेरिन के प्रभाव को अप्रत्याशित रूप से बढ़ा देता है, जिससे गंभीर आंतरिक रक्तस्राव का भारी खतरा होता है।",
            or_="ସିପ୍ରୋଫ୍ଲୋକ୍ସାସିନ୍ ୱାର୍ଫାରିନ୍ ର ପ୍ରଭାବକୁ ବହୁତ ବଢ଼ାଇଦିଏ, ଯାହା ଫଳରେ ରକ୍ତସ୍ରାବର ପ୍ରବଳ ଆଶଙ୍କା ଥାଏ।",
        ),
        evidence_source="FDA Drug Safety & CHEST Antithrombotic Therapy Guidelines",
        management_guidance=MultilingualNote(
            en="Guidance: Check INR within 48 to 72 hours of starting ciprofloxacin; empirical warfarin dosage reduction of 30-50% is commonly practiced.",
            hi="निर्देश: सिप्रोफ्लोक्सासिन शुरू करने के 48-72 घंटों के भीतर INR की जांच करें; डॉक्टर की सलाह पर वारफेरिन की खुराक कम की जाती है।",
            or_="ପରାମର୍ଶ: ସିପ୍ରୋ ଆରମ୍ଭ କରିବାର 48-72 ଘଣ୍ଟା ମଧ୍ୟରେ INR ଯାଞ୍ଚ କରନ୍ତୁ।",
        ),
    ),

    # 6. Ibuprofen / Diclofenac + Ramipril / Telmisartan (The Renal "Double / Triple Whammy")
    CuratedInteractionRecord(
        pair={"Ibuprofen", "Ramipril"},
        severity="MODERATE",
        mechanism="NSAIDs block renal prostaglandins (afferent arteriolar vasoconstriction) while ACE inhibitors dilate efferent arterioles, causing acute decline in glomerular filtration rate.",
        clinical_description=MultilingualNote(
            en="Concurrent NSAID (Ibuprofen) and ACE inhibitor (Ramipril) therapy blunts blood pressure control and significantly elevates the risk of Acute Kidney Injury.",
            hi="इबुप्रोफेन (दर्द निवारक) और रेमीप्रिल (बीपी की दवा) एक साथ लेने से गुर्दे (किडनी) खराब होने का खतरा बढ़ जाता है और बीपी नियंत्रण कमजोर होता है।",
            or_="ଆଇବୁପ୍ରୋଫେନ୍ ଓ ରାମିପ୍ରିଲ୍ ଏକାଠି ବ୍ୟବହାର କଲେ ବୃକ୍‌କ (କିଡନୀ) କ୍ଷତିଗ୍ରସ୍ତ ହେବା ସହ ରକ୍ତଚାପ ନିୟନ୍ତ୍ରଣ ବାଧାପ୍ରାପ୍ତ ହୁଏ।",
        ),
        evidence_source="KDIGO Clinical Practice Guideline for Acute Kidney Injury",
        management_guidance=MultilingualNote(
            en="Guidance: Avoid chronic NSAID use; consider paracetamol as a preferred non-nephrotoxic analgesic alternative for mild-to-moderate pain.",
            hi="निर्देश: लंबे समय तक दर्द निवारक लेने से बचें; सुरक्षित विकल्प के रूप में पैरासिटामोल का उपयोग करें।",
            or_="ପରାମର୍ଶ: ଦୀର୍ଘକାଳୀନ ଯନ୍ତ୍ରଣା ନିବାରକରୁ ଦୂରେଇ ରୁହନ୍ତୁ; ପାରାସିଟାମୋଲ୍ ଏକ ନିରାପଦ ବିକଳ୍ପ।",
        ),
    ),
    CuratedInteractionRecord(
        pair={"Diclofenac", "Telmisartan"},
        severity="MODERATE",
        mechanism="Prostaglandin inhibition combined with angiotensin receptor blockade impairs renal hemodynamics.",
        clinical_description=MultilingualNote(
            en="Diclofenac blunts the antihypertensive efficacy of Telmisartan and precipitates acute renal dysfunction, especially in dehydrated patients.",
            hi="डाइक्लोफेनाक टेल्मीसार्टन के बीपी घटाने वाले असर को कम करता है और गुर्दे की कार्यप्रणाली को नुकसान पहुंचा सकता है।",
            or_="ଡାଇକ୍ଲୋଫେନାକ୍ ଟେଲମିସାର୍ଟାନ୍ ର ରକ୍ତଚାପ ନିୟନ୍ତ୍ରଣ କ୍ଷମତା ହ୍ରାସ କରେ ଏବଂ କିଡନୀ ଉପରେ ଚାପ ପକାଏ।",
        ),
        evidence_source="KDIGO Guidelines & American Heart Association",
        management_guidance=MultilingualNote(
            en="Guidance: Minimize NSAID duration and maintain adequate hydration. Paracetamol is the preferred first-line analgesic.",
            hi="निर्देश: डाइक्लोफेनाक का कम से कम समय उपयोग करें और भरपूर पानी पिएं।",
            or_="ପରାମର୍ଶ: ଯଥାସମ୍ଭବ କମ୍ ସମୟ ପାଇଁ ବ୍ୟବହାର କରନ୍ତୁ ଏବଂ ପର୍ଯ୍ୟାପ୍ତ ପାଣି ପିଅନ୍ତୁ।",
        ),
    ),

    # 7. Tramadol + Escitalopram / Fluoxetine (Serotonin Syndrome)
    CuratedInteractionRecord(
        pair={"Tramadol", "Escitalopram"},
        severity="SEVERE",
        mechanism="Combined serotonergic activity (SSRI reuptake inhibition plus tramadol serotonin release/inhibition) produces excess central serotonin receptor activation.",
        clinical_description=MultilingualNote(
            en="Concomitant administration significantly heightens the risk of life-threatening Serotonin Syndrome (hyperthermia, clonus, autonomic instability, and seizures).",
            hi="ट्रामाडोल और एस्सिटालोप्राम का एक साथ सेवन सेरोटोनिन सिंड्रोम (तेज बुखार, मांसपेशियों में ऐंठन, बेचैनी और दौरे) का गंभीर खतरा पैदा करता है।",
            or_="ଟ୍ରାମାଡୋଲ୍ ଓ ଏସିଟାଲୋପ୍ରାମ୍ ଏକାଠି ବ୍ୟବହାର କଲେ ସେରୋଟୋନିନ୍ ସିଣ୍ଡ୍ରୋମ୍ (ତୀବ୍ର ଜ୍ୱର, ମାଂସପେଶୀ ଟାଣିବା ଓ କମ୍ପନ) ର ଗୁରୁତର ବିପଦ ରହିଥାଏ।",
        ),
        evidence_source="FDA Drug Safety Communication & Hunter Serotonin Toxicity Criteria",
        management_guidance=MultilingualNote(
            en="Guidance: Avoid concurrent combination if possible. Monitor immediately for agitation, tremor, hyperreflexia, and diaphoresis.",
            hi="निर्देश: संभव हो तो इस संयोजन से बचें। बेचैनी, कंपकंपी या तेज पसीना आने पर तुरंत डॉक्टर से संपर्क करें।",
            or_="ପରାମର୍ଶ: ଏହି ଦୁଇ ଔଷଧ ଏକାଠି ନେବାରୁ ଦୂରେଇ ରୁହନ୍ତୁ। କମ୍ପନ ବା ଅସ୍ଥିରତା ହେଲେ ତୁରନ୍ତ ଡାକ୍ତରଙ୍କୁ ଜଣାନ୍ତୁ।",
        ),
    ),
    CuratedInteractionRecord(
        pair={"Fluoxetine", "Tramadol"},
        severity="SEVERE",
        mechanism="Fluoxetine potently inhibits CYP2D6 (blocking tramadol active metabolite clearance) and synergistically elevates serotonin.",
        clinical_description=MultilingualNote(
            en="Severe risk of Serotonin Syndrome and lowered seizure threshold due to potent pharmacokinetic and pharmacodynamic interactions.",
            hi="सेरोटोनिन सिंड्रोम और मिर्गी के दौरे का गंभीर जोखिम।",
            or_="ସେରୋଟୋନିନ୍ ସିଣ୍ଡ୍ରୋମ୍ ଏବଂ ବାତ ମାରିବାର ଗୁରୁତର ବିପଦ।",
        ),
        evidence_source="FDA Warning & Clinical Pharmacogenetics Implementation Consortium (CPIC)",
        management_guidance=MultilingualNote(
            en="Guidance: Co-prescription is generally discouraged. Seek alternative non-serotonergic analgesia.",
            hi="निर्देश: अन्य सुरक्षित दर्द निवारक दवाओं का उपयोग करने की सलाह दी जाती है।",
            or_="ପରାମର୍ଶ: ଅନ୍ୟ ନିରାପଦ ଯନ୍ତ୍ରଣା ନିବାରକ ଔଷଧ ବ୍ୟବହାର କରନ୍ତୁ।",
        ),
    ),

    # 8. Glimepiride / Gliclazide + Aspirin
    CuratedInteractionRecord(
        pair={"Glimepiride", "Aspirin"},
        severity="MODERATE",
        mechanism="Salicylates displace sulfonylureas from plasma albumin binding sites and decrease renal clearance, potentiating hypoglycemic action.",
        clinical_description=MultilingualNote(
            en="Aspirin can potentiate the blood glucose-lowering action of glimepiride, elevating the incidence of symptomatic hypoglycemia.",
            hi="एस्पिरिन ग्लिमेपिराइड के प्रभाव को बढ़ा सकती है, जिससे रक्त में शुगर का स्तर अचानक बहुत कम (हाइपोग्लाइसीमिया) होने का खतरा रहता है।",
            or_="ଆସ୍ପିରିନ୍ ଗ୍ଲିମେପିରାଇଡ୍ ର ପ୍ରଭାବ ବଢ଼ାଇ ରକ୍ତ ଶର୍କରା ହଠାତ୍ ଅତ୍ୟଧିକ କମିଯିବାର (ହାଇପୋଗ୍ଲାଇସେମିଆ) ବିପଦ ସୃଷ୍ଟି କରେ।",
        ),
        evidence_source="ADA Standards of Care in Diabetes & Clinical Pharmacology Compendium",
        management_guidance=MultilingualNote(
            en="Guidance: Educate patient on early signs of hypoglycemia (sweating, trembling, hunger). Self-monitor capillary blood glucose closely.",
            hi="निर्देश: लो-शुगर के लक्षणों (पसीना, कंपकंपी, घबराहट) के प्रति सतर्क रहें और नियमित ग्लूकोज चेक करें।",
            or_="ପରାମର୍ଶ: କମ୍ ଶର୍କରାର ଲକ୍ଷଣ (ଝାଳ, କମ୍ପନ, ଭୋକ) ପ୍ରତି ସଚେତନ ରୁହନ୍ତୁ ଓ ରକ୍ତ ଶର୍କରା ଯାଞ୍ଚ କରନ୍ତୁ।",
        ),
    ),

    # 9. Atorvastatin + Clarithromycin
    CuratedInteractionRecord(
        pair={"Atorvastatin", "Clarithromycin"},
        severity="SEVERE",
        mechanism="Clarithromycin is a potent CYP3A4 inhibitor, causing dramatic spikes in atorvastatin plasma concentrations.",
        clinical_description=MultilingualNote(
            en="Clarithromycin dramatically increases atorvastatin blood levels (up to 4-fold), markedly raising the risk of severe myopathy and rhabdomyolysis.",
            hi="क्लैरिथ्रोमाइसिन एटोरवास्टेटिन के स्तर को 4 गुना तक बढ़ा सकती है, जिससे मांसपेशियों में गंभीर क्षति (रैबडोमायोलिसिस) और किडनी फेलियर का खतरा होता है।",
            or_="କ୍ଲାରିଥ୍ରୋମାଇସିନ୍ ଏଟୋରଭାଷ୍ଟାଟିନ୍ ର ମାତ୍ରାକୁ ଅତ୍ୟଧିକ ବଢ଼ାଇ ମାଂସପେଶୀ ନଷ୍ଟ ଓ କିଡନୀ ବିଫଳତାର ଆଶଙ୍କା ସୃଷ୍ଟି କରେ।",
        ),
        evidence_source="FDA Drug Safety Communication & American Heart Association Statin Guidelines",
        management_guidance=MultilingualNote(
            en="Guidance: Temporarily suspend atorvastatin during the short course of clarithromycin therapy, or substitute azithromycin which does not inhibit CYP3A4.",
            hi="निर्देश: क्लैरिथ्रोमाइसिन लेने के दौरान एटोरवास्टेटिन को अस्थायी रूप से बंद करें, या एजिथ्रोमाइसिन का उपयोग करें।",
            or_="ପରାମର୍ଶ: ଆଣ୍ଟିବାୟୋଟିକ୍ ଚାଲିଥିବା ସମୟରେ ଷ୍ଟାଟିନ୍ କିଛି ଦିନ ବନ୍ଦ ରଖନ୍ତୁ ବା ଏଜିଥ୍ରୋମାଇସିନ୍ ବ୍ୟବହାର କରନ୍ତୁ।",
        ),
    ),

    # 10. Empagliflozin / Dapagliflozin + Human Insulin
    CuratedInteractionRecord(
        pair={"Empagliflozin", "Human Insulin"},
        severity="MODERATE",
        mechanism="Concomitant SGLT2 inhibition and exogenous insulin administration increases risk of both hypoglycemia and euglycemic diabetic ketoacidosis.",
        clinical_description=MultilingualNote(
            en="While a clinically validated combination, adding an SGLT2 inhibitor to insulin therapy requires caution regarding hypoglycemia and rare euglycemic diabetic ketoacidosis.",
            hi="इंसुलिन और एम्पाग्लिफ्लोज़िन का संयोजन शुगर को अत्यधिक कम कर सकता है और दुर्लभ मामलों में यूग्लाइसेमिक कीटोएसिडोसिस कर सकता है।",
            or_="ଇନସୁଲିନ୍ ଓ ଏମ୍ପାଗ୍ଲିଫ୍ଲୋଜିନ୍ ଏକାଠି ବ୍ୟବହାର କଲେ ରକ୍ତ ଶର୍କରା କମିବା ବା କିଟୋଏସିଡୋସିସ୍ ର ଆଶଙ୍କା ଥାଏ।",
        ),
        evidence_source="ADA / EASD Consensus Statement on Type 2 Diabetes Management",
        management_guidance=MultilingualNote(
            en="Guidance: May require a planned 10-20% insulin dosage adjustment under endocrinologist guidance; monitor for malaise, nausea, or ketones even if glucose is normal.",
            hi="निर्देश: डॉक्टर की देखरेख में इंसुलिन की खुराक में समायोजन की आवश्यकता हो सकती है।",
            or_="ପରାମର୍ଶ: ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ କ୍ରମେ ଇନସୁଲିନ୍ ଡୋଜ୍ ନିୟନ୍ତ୍ରଣ କରନ୍ତୁ।",
        ),
    ),
]


MANDATORY_NEGATIVE_FINDING_DISCLAIMER = {
    "en": (
        "No interaction was found in the available dataset for the queried combination. "
        "This does NOT establish that the combination is safe. Many dietary supplements, herbal compounds, "
        "over-the-counter remedies, and specialized formulations may have interactions that are not "
        "catalogued in this educational database. Always verify medication safety with your prescribing physician or pharmacist."
    ),
    "hi": (
        "उपलब्ध डेटाबेस में इस दवा संयोजन के लिए कोई ज्ञात प्रतिकूल परस्पर क्रिया (इंटरैक्शन) नहीं मिली। "
        "इसका अर्थ यह कतई नहीं है कि यह संयोजन पूरी तरह सुरक्षित है। कई घरेलू उपचार, हर्बल दवाएं, सप्लीमेंट्स "
        "और ओटीसी दवाएं ऐसी हो सकती हैं जो इस शैक्षणिक डेटाबेस में शामिल नहीं हैं। कृपया हमेशा अपने डॉक्टर या फार्मासिस्ट से पुष्टि करें।"
    ),
    "or": (
        "ଉପଲବ୍ଧ ତଥ୍ୟାବଳୀରେ ଏହି ଔଷଧ ମିଶ୍ରଣ ପାଇଁ କୌଣସି ପାରସ୍ପରିକ କ୍ଷତିକାରକ ପ୍ରଭାବ (ଇଣ୍ଟରାକ୍ସନ୍) ମିଳିଲା ନାହିଁ। "
        "ଏହାର ଅର୍ଥ ଏହା ସମ୍ପୂର୍ଣ୍ଣ ନିରାପଦ ବୋଲି ପ୍ରମାଣିତ ହୁଏ ନାହିଁ। ଅନେକ ଆୟୁର୍ବେଦିକ, ହର୍ବାଲ୍ ବା ଅଣ-ପଞ୍ଜୀକୃତ ଔଷଧର ପ୍ରଭାବ ଏହି ଶିକ୍ଷଣୀୟ ତଥ୍ୟରେ ଅନ୍ତର୍ଭୁକ୍ତ ନଥାଇପାରେ। ସର୍ବଦା ନିଜ ଡାକ୍ତର ବା ଫାର୍ମାସିଷ୍ଟଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।"
    ),
}

MANDATORY_NON_INTERFERENCE_CLAUSE = {
    "en": (
        "IMPORTANT SAFETY NOTICE: Never stop, start, or alter the dosage of any prescribed medication "
        "based on information from this tool. Doing so without direct medical supervision can lead to "
        "severe adverse health consequences or death. Discuss all concerns directly with your healthcare provider."
    ),
    "hi": (
        "महत्वपूर्ण सुरक्षा सूचना: इस टूल की जानकारी के आधार पर कभी भी किसी भी निर्धारित दवा को बंद न करें, "
        "शुरू न करें, या उसकी खुराक न बदलें। डॉक्टर की सलाह के बिना ऐसा करना जानलेवा हो सकता है। किसी भी चिंता के लिए अपने डॉक्टर से बात करें।"
    ),
    "or": (
        "ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସୁରକ୍ଷା ସୂଚନା: ଏହି ଟୁଲ୍‌ର ସୂଚନା ଆଧାରରେ କେବେହେଲେ କୌଣସି ନିର୍ଦ୍ଧାରିତ ଔଷଧ ବନ୍ଦ କରନ୍ତୁ ନାହିଁ, ନୂଆ ଆରମ୍ଭ କରନ୍ତୁ ନାହିଁ ବା ଡୋଜ୍ ବଦଳାନ୍ତୁ ନାହିଁ। ଡାକ୍ତରୀ ପରାମର୍ଶ ବିନା ଏହା କରିବା ପ୍ରାଣଘାତୀ ହୋଇପାରେ। ସମସ୍ତ ବିଷୟରେ ନିଜ ଡାକ୍ତରଙ୍କ ସହିତ ଆଲୋଚନା କରନ୍ତୁ।"
    ),
}


class MedicationInteractionEvaluator:
    """Evaluates pairwise drug-drug interactions with canonical ingredient normalization."""

    @classmethod
    def evaluate(
        cls,
        medications: List[MedicationCheckItemInput],
        lang: str = "en",
    ) -> MedicationCheckResponse:
        import uuid
        check_id = str(uuid.uuid4())

        # Resolve each medication to canonical concept record
        resolved_concepts: List[Optional[MedicationConceptRecord]] = []
        for item in medications:
            concept = resolve_to_canonical_ingredient(item.name)
            resolved_concepts.append(concept)

        detected: List[DetectedInteractionInfo] = []
        has_severe = False

        # Generate all pairwise combinations
        n = len(medications)
        for i in range(n):
            for j in range(i + 1, n):
                med_a_input = medications[i].name
                med_b_input = medications[j].name

                concept_a = resolved_concepts[i]
                concept_b = resolved_concepts[j]

                # Canonical names if matched, otherwise raw input
                name_a = concept_a.name if concept_a else med_a_input
                name_b = concept_b.name if concept_b else med_b_input

                pair_set = {name_a, name_b}

                # Check curated registry
                for rule in CURATED_INTERACTION_REGISTER:
                    if rule.pair == pair_set:
                        if rule.severity in ("CONTRAINDICATED", "SEVERE"):
                            has_severe = True

                        detected.append(
                            DetectedInteractionInfo(
                                drug_a=name_a,
                                drug_b=name_b,
                                severity=rule.severity,
                                clinical_description=rule.clinical_description.get(lang),
                                evidence_source=rule.evidence_source,
                                management_guidance=rule.management_guidance.get(lang),
                            )
                        )

        # Retrieve multilingual negative disclaimer
        negative_disclaimer = MANDATORY_NEGATIVE_FINDING_DISCLAIMER.get(
            lang, MANDATORY_NEGATIVE_FINDING_DISCLAIMER["en"]
        )

        return MedicationCheckResponse(
            check_id=check_id,
            total_medications=n,
            interaction_count=len(detected),
            has_severe_warning=has_severe,
            interactions=detected,
            mandatory_disclaimer=negative_disclaimer,
        )
