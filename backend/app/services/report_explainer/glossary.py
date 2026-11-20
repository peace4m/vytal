"""
Multilingual Laboratory Biomarker Glossary
Provides patient-friendly, human-reviewed educational explanations of common biomarkers
in English (en), Hindi (hi), and Odia (or).
"""

from typing import Dict, Any, Optional

BIOMARKER_GLOSSARY: Dict[str, Dict[str, Any]] = {
    "glucose_fasting": {
        "canonical_name": "Fasting Blood Sugar (Glucose)",
        "aliases": ["fasting blood sugar", "fbs", "fasting glucose", "blood glucose fasting", "glucose - fasting"],
        "standard_unit": "mg/dL",
        "explanations": {
            "en": {
                "normal": "Your fasting blood sugar is within the expected range for an overnight fast. This indicates good baseline glycemic control.",
                "high": "Your fasting blood glucose is elevated above the standard reference range. An elevated reading can occur after recent food intake, acute stress, illness, or metabolic dysregulation. It does not diagnose diabetes on its own.",
                "low": "Your fasting blood glucose is below standard reference values (hypoglycemia). This can occur with prolonged fasting, excessive physical exertion, or medication effects.",
                "safety": "A single laboratory test is not a medical diagnosis. Fasting glucose must be interpreted in clinical context alongside HbA1c."
            },
            "hi": {
                "normal": "आपकी खाली पेट रक्त शर्करा (Fasting Blood Sugar) सामान्य सीमा में है। यह इंगित करता है कि आपका रक्त शर्करा नियंत्रण ठीक है।",
                "high": "आपकी खाली पेट रक्त शर्करा संदर्भ सीमा से अधिक है। यह हालिया भोजन, तनाव, बीमारी या चयापचय कारणों से हो सकता है। यह अकेले मधुमेह का निदान नहीं है।",
                "low": "आपकी खाली पेट रक्त शर्करा सामान्य से कम है। यह लंबे उपवास या दवा के प्रभाव से हो सकता है।",
                "safety": "एक अकेला परीक्षण किसी बीमारी का निदान नहीं करता है। हमेशा डॉक्टर से परामर्श लें।"
            },
            "or": {
                "normal": "ଆପଣଙ୍କ ଖାଲି ପେଟ ରକ୍ତ ଶର୍କରା (Fasting Blood Sugar) ସାଧାରଣ ସୀମା ମଧ୍ୟରେ ଅଛି।",
                "high": "ଆପଣଙ୍କ ଖାଲି ପେଟ ରକ୍ତ ଶର୍କରା ସାଧାରଣ ସୀମାରୁ ଅଧିକ ଅଛି। ଏହା ଖାଦ୍ୟ, ମାନସିକ ଚାପ ବା ଶାରୀରିକ ଅସୁସ୍ଥତା କାରଣରୁ ହୋଇପାରେ। ଏହା ଏକୁଟିଆ ମଧୁମେହର ପ୍ରମାଣ ନୁହେଁ।",
                "low": "ଆପଣଙ୍କ ଖାଲି ପେଟ ରକ୍ତ ଶର୍କରା ସାଧାରଣଠାରୁ କମ୍ ଅଛି।",
                "safety": "ଗୋଟିଏ ରିପୋର୍ଟ ଆଧାରରେ କୌଣସି ଚିକିତ୍ସା ନିଷ୍ପତ୍ତି ନିଅନ୍ତୁ ନାହିଁ। ଡାକ୍ତରଙ୍କ ସହିତ ଆଲୋଚନା କରନ୍ତୁ।"
            }
        }
    },
    "glucose_pp": {
        "canonical_name": "Postprandial Blood Sugar (PPBS)",
        "aliases": ["post prandial blood sugar", "ppbs", "glucose post prandial", "glucose - pp", "postprandial glucose"],
        "standard_unit": "mg/dL",
        "explanations": {
            "en": {
                "normal": "Your blood sugar measured 2 hours after a meal is within expected normal post-meal limits.",
                "high": "Your post-meal blood sugar is higher than standard reference ranges. This indicates that your body took longer to process dietary carbohydrates.",
                "low": "Your post-meal blood sugar is lower than expected.",
                "safety": "Dietary composition and physical activity immediately preceding the test significantly affect postprandial readings."
            },
            "hi": {
                "normal": "भोजन के 2 घंटे बाद का रक्त शर्करा स्तर सामान्य सीमा में है।",
                "high": "भोजन के बाद का रक्त शर्करा स्तर सामान्य से अधिक है। इसका मतलब है कि शरीर को कार्बोहाइड्रेट पचाने में अधिक समय लगा।",
                "low": "भोजन के बाद का रक्त शर्करा स्तर सामान्य से कम है।",
                "safety": "भोजन की प्रकृति का इस परीक्षण पर सीधा प्रभाव पड़ता है।"
            },
            "or": {
                "normal": "ଖାଇବାର ୨ ଘଣ୍ଟା ପରେ ରକ୍ତ ଶର୍କରା ସ୍ତର ସାଧାରଣ ସୀମାରେ ଅଛି।",
                "high": "ଖାଇବା ପରେ ରକ୍ତ ଶର୍କରା ସ୍ତର ସାଧାରଣଠାରୁ ଅଧିକ ଅଛି।",
                "low": "ଖାଇବା ପରେ ରକ୍ତ ଶର୍କରା ସ୍ତର ସାଧାରଣଠାରୁ କମ୍ ଅଛି।",
                "safety": "ଖାଦ୍ୟର ପ୍ରକାର ଉପରେ ଏହି ପରୀକ୍ଷାର ଫଳାଫଳ ନିର୍ଭର କରେ।"
            }
        }
    },
    "hba1c": {
        "canonical_name": "Glycated Hemoglobin (HbA1c)",
        "aliases": ["hba1c", "glycated hemoglobin", "glycosylated hemoglobin", "a1c"],
        "standard_unit": "%",
        "explanations": {
            "en": {
                "normal": "Your HbA1c is below 5.7%, which is considered the standard healthy non-diabetic range.",
                "high": "Your HbA1c is 5.7% or higher. Values between 5.7% and 6.4% often reflect prediabetes; 6.5% or higher may warrant diagnostic clinical evaluation for diabetes.",
                "low": "Your HbA1c is unusually low, which can occasionally occur with certain hemoglobin variants or hemolytic conditions.",
                "safety": "HbA1c reflects average blood sugar over the past 2 to 3 months. Confirmation by a laboratory repeat test is clinically required."
            },
            "hi": {
                "normal": "आपका HbA1c स्तर 5.7% से कम है, जो सामान्य और स्वस्थ माना जाता है।",
                "high": "आपका HbA1c स्तर बढ़ा हुआ है। 5.7% से 6.4% प्रीडायबिटीज तथा 6.5% या उससे अधिक मधुमेह की संभावना दर्शा सकता है।",
                "low": "आपका HbA1c स्तर असामान्य रूप से कम है।",
                "safety": "HbA1c पिछले 2 से 3 महीनों का औसत शर्करा स्तर दर्शाता है। पुष्टि के लिए डॉक्टर से मिलें।"
            },
            "or": {
                "normal": "ଆପଣଙ୍କ HbA1c ସ୍ତର ୫.୭% ରୁ କମ୍ ଅଛି, ଯାହା ସାଧାରଣ ବୋଲି ଧରାଯାଏ।",
                "high": "ଆପଣଙ୍କ HbA1c ସ୍ତର ସାଧାରଣଠାରୁ ଅଧିକ। ୫.୭% ରୁ ୬.୪% ପ୍ରି-ଡାଇବେଟିସ୍ ଏବଂ ୬.୫% ବା ତଦୁର୍ଦ୍ଧ୍ୱ ମଧୁମେହର ସମ୍ଭାବନା ଦର୍ଶାଇପାରେ।",
                "low": "ଆପଣଙ୍କ HbA1c ସ୍ତର ଅସ୍ୱାଭାବିକ ଭାବରେ କମ୍ ଅଛି।",
                "safety": "HbA1c ବିଗତ ୨ ରୁ ୩ ମାସର ହାରାହାରି ରକ୍ତ ଶର୍କରା ସ୍ତର ଦର୍ଶାଏ।"
            }
        }
    },
    "cholesterol_total": {
        "canonical_name": "Total Cholesterol",
        "aliases": ["total cholesterol", "cholesterol - total", "serum cholesterol"],
        "standard_unit": "mg/dL",
        "explanations": {
            "en": {
                "normal": "Your total cholesterol is in the desirable range (typically under 200 mg/dL).",
                "high": "Your total cholesterol is elevated. Cardiovascular risk depends more specifically on the balance between LDL, HDL, and triglycerides.",
                "low": "Your total cholesterol is below average reference thresholds.",
                "safety": "Cholesterol must be interpreted as part of a complete lipid profile alongside blood pressure and lifestyle factors."
            },
            "hi": {
                "normal": "आपका कुल कोलेस्ट्रॉल सामान्य और वांछनीय स्तर में है।",
                "high": "आपका कुल कोलेस्ट्रॉल बढ़ा हुआ है। हृदय स्वास्थ्य के लिए LDL और HDL का संतुलन अधिक महत्वपूर्ण है।",
                "low": "आपका कुल कोलेस्ट्रॉल संदर्भ सीमा से कम है।",
                "safety": "कोलेस्ट्रॉल को पूरे लिपिड प्रोफाइल और जीवनशैली के संदर्भ में देखा जाना चाहिए।"
            },
            "or": {
                "normal": "ଆପଣଙ୍କ ସମୁଦାୟ କୋଲେଷ୍ଟ୍ରଲ୍ ସାଧାରଣ ସୀମାରେ ଅଛି।",
                "high": "ଆପଣଙ୍କ ସମୁଦାୟ କୋଲେଷ୍ଟ୍ରଲ୍ ବୃଦ୍ଧି ପାଇଛି।",
                "low": "ଆପଣଙ୍କ ସମୁଦାୟ କୋଲେଷ୍ଟ୍ରଲ୍ ସାଧାରଣଠାରୁ କମ୍ ଅଛି।",
                "safety": "ସମ୍ପୂର୍ଣ୍ଣ ଲିପିଡ୍ ପ୍ରୋଫାଇଲ୍ ସହିତ ଏହାକୁ ଡାକ୍ତରଙ୍କ ସହିତ ଯାଞ୍ଚ କରନ୍ତୁ।"
            }
        }
    },
    "creatinine": {
        "canonical_name": "Serum Creatinine",
        "aliases": ["creatinine", "serum creatinine", "s. creatinine", "creatinine - serum"],
        "standard_unit": "mg/dL",
        "explanations": {
            "en": {
                "normal": "Your serum creatinine is in the expected reference range, reflecting normal muscle metabolism and baseline kidney filtration.",
                "high": "Your creatinine level is higher than the laboratory reference range. Elevated creatinine can be caused by dehydration, high protein intake, vigorous exercise, or reduced kidney function.",
                "low": "Your creatinine is lower than reference levels, which can be seen with low muscle mass or reduced dietary intake.",
                "safety": "Creatinine levels vary by age, sex, and muscle mass. Do not assume kidney illness based on a single result."
            },
            "hi": {
                "normal": "आपका सीरम क्रिएटिनिन सामान्य सीमा में है, जो गुर्दे की सामान्य कार्यप्रणाली का संकेत देता है।",
                "high": "आपका क्रिएटिनिन स्तर संदर्भ सीमा से अधिक है। यह निर्जलीकरण (डिहाइड्रेशन), भारी कसरत या गुर्दे की कार्यक्षमता में कमी से हो सकता है।",
                "low": "आपका क्रिएटिनिन स्तर सामान्य से कम है।",
                "safety": "क्रिएटिनिन का स्तर उम्र और मांसपेशियों पर निर्भर करता है। डॉक्टर से जांच करवाएं।"
            },
            "or": {
                "normal": "ଆପଣଙ୍କ ସିରମ୍ କ୍ରିଏଟିନିନ୍ ସାଧାରଣ ସୀମାରେ ଅଛି, ଯାହା ବୃକ୍‌କ (କିଡନୀ) ର ସାଧାରଣ କାର୍ଯ୍ୟ ଦର୍ଶାଏ।",
                "high": "ଆପଣଙ୍କ କ୍ରିଏଟିନିନ୍ ସ୍ତର ସାଧାରଣଠାରୁ ଅଧିକ ଅଛି। ଏହା ଜଳାଭାବ (ଡିହାଇଡ୍ରେସନ୍) ବା କିଡନୀ ଉପରେ ଚାପ ଯୋଗୁଁ ହୋଇପାରେ।",
                "low": "ଆପଣଙ୍କ କ୍ରିଏଟିନିନ୍ ସ୍ତର ସାଧାରଣଠାରୁ କମ୍ ଅଛି।",
                "safety": "ଏକାକୀ ଏହି ପରୀକ୍ଷା ଆଧାରରେ ଚିନ୍ତିତ ହୁଅନ୍ତୁ ନାହିଁ। ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।"
            }
        }
    },
    "hemoglobin": {
        "canonical_name": "Hemoglobin (Hb)",
        "aliases": ["hemoglobin", "haemoglobin", "hb"],
        "standard_unit": "g/dL",
        "explanations": {
            "en": {
                "normal": "Your hemoglobin level is within the expected range, indicating adequate oxygen-carrying capacity in the blood.",
                "high": "Your hemoglobin is above reference ranges, which can occur with dehydration, smoking, high altitude, or bone marrow responses.",
                "low": "Your hemoglobin is below standard reference thresholds, which indicates anemia. This may cause fatigue or weakness.",
                "safety": "Anemia has multiple distinct causes (e.g., iron deficiency, vitamin B12 deficiency, blood loss). Further evaluation is needed."
            },
            "hi": {
                "normal": "आपका हीमोग्लोबिन स्तर सामान्य है, जो रक्त में ऑक्सीजन संचार की सही क्षमता दर्शाता है।",
                "high": "आपका हीमोग्लोबिन सामान्य से अधिक है, जो निर्जलीकरण या ऊंचाई पर रहने से हो सकता है।",
                "low": "आपका हीमोग्लोबिन सामान्य से कम है, जो एनीमिया (रक्त की कमी) का संकेत है।",
                "safety": "एनीमिया के कई कारण हो सकते हैं जैसे आयरन की कमी। सटीक कारण जानने के लिए डॉक्टर से मिलें।"
            },
            "or": {
                "normal": "ଆପଣଙ୍କ ହିମୋଗ୍ଲୋବିନ୍ ସ୍ତର ସାଧାରଣ ସୀମାରେ ଅଛି।",
                "high": "ଆପଣଙ୍କ ହିମୋଗ୍ଲୋବିନ୍ ସାଧାରଣଠାରୁ ଅଧିକ ଅଛି।",
                "low": "ଆପଣଙ୍କ ହିମୋଗ୍ଲୋବିନ୍ ସାଧାରଣଠାରୁ କମ୍ ଅଛି, ଯାହା ରକ୍ତହୀନତା (ଏନିମିଆ) ଦର୍ଶାଇପାରେ।",
                "safety": "ରକ୍ତହୀନତାର ସଠିକ୍ କାରଣ ଜାଣିବା ପାଇଁ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।"
            }
        }
    }
}


def find_glossary_match(analyte_name: str) -> Optional[Dict[str, Any]]:
    """Matches a raw extracted analyte name against known biomarkers."""
    name_clean = analyte_name.strip().lower()
    for key, data in BIOMARKER_GLOSSARY.items():
        if key in name_clean:
            return data
        for alias in data["aliases"]:
            if alias in name_clean:
                return data
    return None


def get_biomarker_explanation(
    analyte_name: str,
    status_flag: str,
    lang: str = "en"
) -> Dict[str, str]:
    """Retrieves localized plain-language explanation and safety note."""
    if lang not in ["en", "hi", "or"]:
        lang = "en"

    match = find_glossary_match(analyte_name)
    if not match:
        # Fallback generic message
        return {
            "canonical_name": analyte_name,
            "explanation": f"Result for {analyte_name} is marked as {status_flag} relative to laboratory reference bounds.",
            "safety_note": "Laboratory reference ranges can vary by equipment, assay technique, and patient demographics. Consult your doctor."
        }

    lang_exps = match["explanations"].get(lang, match["explanations"]["en"])
    flag_key = "normal"
    if status_flag == "HIGH":
        flag_key = "high"
    elif status_flag == "LOW":
        flag_key = "low"

    return {
        "canonical_name": match["canonical_name"],
        "explanation": lang_exps.get(flag_key, lang_exps["normal"]),
        "safety_note": lang_exps.get("safety", match["explanations"]["en"]["safety"])
    }
