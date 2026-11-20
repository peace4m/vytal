"""
Symptom Questionnaire Definition (Module 03)
Provides structured, multilingual symptom selection catalogs and adaptive follow-up questionnaires.
"""

from typing import Dict, Any, List


PRIMARY_SYMPTOMS_CATALOG = [
    {
        "id": "chest_pain",
        "category": "cardiovascular",
        "label": {
            "en": "Chest Pain, Pressure, or Discomfort",
            "hi": "सीने में दर्द, दबाव या बेचैनी",
            "or": "ଛାତିରେ ଯନ୍ତ୍ରଣା, ଚାପ ବା ଅସ୍ୱସ୍ଥି",
        },
        "description": {
            "en": "Pain, tightness, squeezing, or heaviness in the center or left side of chest",
            "hi": "छाती के बीच या बाईं ओर भारीपन, खिंचाव या दबाव का अहसास",
            "or": "ଛାତିର ମଝିରେ ବା ବାମ ପାଖରେ ଭାରୀପଣ, ଚାପ ବା କଷ୍ଟ",
        },
        "icon": "Heart",
        "red_flag_alert": True,
    },
    {
        "id": "facial_droop_or_weakness",
        "category": "neurological",
        "label": {
            "en": "Facial Droop, Arm Weakness, or Slurred Speech",
            "hi": "चेहरे का टेढ़ापन, हाथ की कमजोरी, या लड़खड़ाती आवाज",
            "or": "ମୁହଁ ବଙ୍କା ହେବା, ହାତ ଦୁର୍ବଳତା, ବା କଥା ଅସ୍ପଷ୍ଟ ହେବା",
        },
        "description": {
            "en": "Sudden asymmetry in smile, difficulty raising one arm, or slurred speaking",
            "hi": "अचानक चेहरे की एक तरफ कमजोरी, एक हाथ उठाने में असमर्थता, या बोलने में अस्पष्टता",
            "or": "ହଠାତ୍ ମୁହଁର ଗୋଟିଏ ପାଖ ଦୁର୍ବଳ ହେବା, ଗୋଟିଏ ହାତ ଉଠାଇବାରେ କଷ୍ଟ, ବା କଥା କହିବାରେ ଅସୁବିଧା",
        },
        "icon": "Brain",
        "red_flag_alert": True,
    },
    {
        "id": "severe_shortness_of_breath",
        "category": "respiratory",
        "label": {
            "en": "Shortness of Breath or Breathing Difficulty",
            "hi": "सांस फूलना या सांस लेने में गंभीर कठिनाई",
            "or": "ଶ୍ୱାସକଷ୍ଟ ବା ନିଶ୍ୱାସ ନେବାରେ ଗୁରୁତର ଅସୁବିଧା",
        },
        "description": {
            "en": "Gasping for breath, inability to finish a short sentence, or wheezing at rest",
            "hi": "विश्राम के समय भी सांस फूलना या एक वाक्य पूरा न बोल पाना",
            "or": "ବିଶ୍ରାମ ସମୟରେ ମଧ୍ୟ ଶ୍ୱାସକଷ୍ଟ ବା ଗୋଟିଏ ବାକ୍ୟ ପୂରା କହି ନପାରିବା",
        },
        "icon": "Wind",
        "red_flag_alert": True,
    },
    {
        "id": "acute_allergic_reaction",
        "category": "immunological",
        "label": {
            "en": "Sudden Swelling, Rash, or Severe Allergic Reaction",
            "hi": "अचानक सूजन, त्वचा पर चकत्ते, या गंभीर एलर्जी",
            "or": "ହଠାତ୍ ଫୁଲିବା, ଚର୍ମରେ କୁଣ୍ଡିଆ, ବା ଗୁରୁତର ଏଲର୍ଜି",
        },
        "description": {
            "en": "Swelling of lips, tongue, or throat following food, insect sting, or medication",
            "hi": "दवा, भोजन या कीट दंश के बाद होंठ, जीभ या गले में सूजन",
            "or": "ଔଷଧ, ଖାଦ୍ୟ ବା କୀଟ କାମୁଡ଼ା ପରେ ଓଠ, ଜିଭ ବା ଗଳା ଫୁଲିବା",
        },
        "icon": "ShieldAlert",
        "red_flag_alert": True,
    },
    {
        "id": "thunderclap_headache",
        "category": "neurological",
        "label": {
            "en": "Severe Sudden Headache or Stiff Neck with Fever",
            "hi": "अचानक असहनीय सिरदर्द या बुखार के साथ गर्दन में अकड़न",
            "or": "ହଠାତ୍ ଅସହ୍ୟ ମୁଣ୍ଡବିନ୍ଧା ବା ଜ୍ୱର ସହ ବେକ ଟାଣ ହେବା",
        },
        "description": {
            "en": "Explosive onset reaching worst pain in under 1 minute, or stiff neck with fever and light sensitivity",
            "hi": "एक मिनट से भी कम समय में अत्यधिक तेज सिरदर्द, या गर्दन अकड़ना व तेज बुखार",
            "or": "ଗୋଟିଏ ମିନିଟ୍ ମଧ୍ୟରେ ଅସହ୍ୟ ମୁଣ୍ଡବିନ୍ଧା, ବା ଜ୍ୱର ସହ ବେକ ଟାଣ ହେବା",
        },
        "icon": "Zap",
        "red_flag_alert": True,
    },
    {
        "id": "fever_with_rigors_or_confusion",
        "category": "infectious",
        "label": {
            "en": "Fever with Severe Shivering, Confusion, or Rapid Breathing",
            "hi": "तेज बुखार के साथ कंपकंपी, उलझन, या तेज सांस",
            "or": "ଉଚ୍ଚ ଜ୍ୱର ସହ ପ୍ରବଳ କମ୍ପନ, ବିଭ୍ରାନ୍ତି, ବା ଦ୍ରୁତ ଶ୍ୱାସକ୍ରିୟା",
        },
        "description": {
            "en": "Suspected bacterial or viral infection with mental fogginess or very rapid breathing",
            "hi": "संक्रमण के लक्षणों के साथ मानसिक भ्रम, अत्यधिक कंपकंपी, या तेजी से सांस चलना",
            "or": "ସଂକ୍ରମଣ ସହିତ ମାନସିକ ଦ୍ୱନ୍ଦ୍ୱ, ଅତ୍ୟଧିକ କମ୍ପନ, ବା ଦ୍ରୁତ ଶ୍ୱାସ",
        },
        "icon": "Thermometer",
        "red_flag_alert": True,
    },
    {
        "id": "excessive_thirst_and_vomiting",
        "category": "metabolic",
        "label": {
            "en": "Severe Thirst, Frequent Urination & Nausea/Vomiting",
            "hi": "अत्यधिक प्यास, बार-बार पेशाब और मतली/उल्टी",
            "or": "ଅତ୍ୟଧିକ ଶୋଷ, ବାରମ୍ବାର ପରିସ୍ରା ଏବଂ ବାନ୍ତି ଭାବ",
        },
        "description": {
            "en": "Rapid onset of unquenchable thirst, frequent urination, abdominal pain, and nausea/vomiting",
            "hi": "तेजी से बहुत प्यास लगना, बहुत पेशाब आना, पेट दर्द और उल्टी होना",
            "or": "ଅତ୍ୟଧିକ ଶୋଷ ଲାଗିବା, ବହୁତ ପରିସ୍ରା ହେବା, ପେଟ ଯନ୍ତ୍ରଣା ଓ ବାନ୍ତି",
        },
        "icon": "Droplets",
        "red_flag_alert": False,
    },
    {
        "id": "mild_fatigue_or_gradual_symptoms",
        "category": "metabolic",
        "label": {
            "en": "Gradual Fatigue, Mild Weight Changes, or General Malaise",
            "hi": "हल्की थकान, धीरे-धीरे वजन में बदलाव, या सामान्य सुस्ती",
            "or": "ସାମାନ୍ୟ କ୍ଲାନ୍ତି, ଧୀରେ ଧୀରେ ଓଜନ ପରିବର୍ତ୍ତନ, ବା ସାଧାରଣ ଦୁର୍ବଳତା",
        },
        "description": {
            "en": "Chronic or gradual symptoms persisting over weeks without acute distress",
            "hi": "हफ्तों से बनी रहने वाली हल्की सुस्ती या थकान, बिना किसी तीव्र दर्द के",
            "or": "ସପ୍ତାହ ଧରି ଲାଗି ରହିଥିବା ସାଧାରଣ କ୍ଲାନ୍ତି ବା ଦୁର୍ବଳତା",
        },
        "icon": "Activity",
        "red_flag_alert": False,
    },
]


ADAPTIVE_FOLLOW_UPS = {
    "chest_pain": [
        {
            "id": "chest_pain_nature",
            "type": "single_choice",
            "prompt": {
                "en": "How would you describe the feeling of the chest pain?",
                "hi": "सीने के दर्द का अहसास कैसा है?",
                "or": "ଛାତି ଯନ୍ତ୍ରଣାର ଅନୁଭୂତି କିପରି?",
            },
            "options": [
                {
                    "value": "crushing_pressure",
                    "label": {
                        "en": "Crushing, heavy pressure, or tight band around chest",
                        "hi": "दबाव, भारीपन, या छाती पर भारी बोझ का अहसास",
                        "or": "ଭାରୀ ଚାପ ବା ଛାତିରେ ବନ୍ଧନ ପରି ଲାଗିବା",
                    },
                    "risk_weight": "EMERGENCY",
                },
                {
                    "value": "sharp_stabbing",
                    "label": {
                        "en": "Sharp or stabbing pain that changes with deep breaths",
                        "hi": "तेज चुभने वाला दर्द जो गहरी सांस लेने पर बदलता है",
                        "or": "ତୀକ୍ଷ୍ଣ ଛୁଞ୍ଚି ଫୋଡ଼ି ହେବା ପରି ଯନ୍ତ୍ରଣା",
                    },
                    "risk_weight": "ROUTINE",
                },
                {
                    "value": "burning_acidic",
                    "label": {
                        "en": "Burning sensation moving upward toward throat (heartburn)",
                        "hi": "गले की ओर ऊपर उठती जलन (एसिडिटी/हार्टबर्न)",
                        "or": "ଗଳା ଆଡ଼କୁ ଉଠୁଥିବା ଜଳାପୋଡ଼ା ଅନୁଭୂତି",
                    },
                    "risk_weight": "ROUTINE",
                },
            ],
        },
        {
            "id": "radiates_to_jaw_or_left_arm",
            "type": "boolean",
            "prompt": {
                "en": "Does the discomfort spread or radiate to your jaw, neck, back, or left arm?",
                "hi": "क्या दर्द जबड़े, गर्दन, पीठ या बाएं हाथ की ओर फैलता है?",
                "or": "ଯନ୍ତ୍ରଣା କ’ଣ ମୁଖମଣ୍ଡଳ, ବେକ, ପିଠି କିମ୍ବା ବାମ ହାତକୁ ବ୍ୟାପୁଛି?",
            },
        },
        {
            "id": "associated_sweating_or_dyspnea",
            "type": "boolean",
            "prompt": {
                "en": "Do you also feel a cold sweat, nausea, or noticeable shortness of breath?",
                "hi": "क्या ठंडा पसीना, जी मिचलाना, या सांस लेने में दिक्कत भी हो रही है?",
                "or": "ଥଣ୍ଡା ଝାଳ, ବାନ୍ତି ଭାବ କିମ୍ବା ଶ୍ୱାସକଷ୍ଟ ମଧ୍ୟ ଅନୁଭବ ହେଉଛି କି?",
            },
        },
    ],
    "facial_droop_or_weakness": [
        {
            "id": "unilateral_weakness",
            "type": "boolean",
            "prompt": {
                "en": "Is the weakness or numbness clearly on one side of your body (face, arm, or leg)?",
                "hi": "क्या कमजोरी या सुन्नपन शरीर के एक ही तरफ (चेहरे, हाथ या पैर) में है?",
                "or": "ଦୁର୍ବଳତା କ’ଣ ଶରୀରର ଗୋଟିଏ ପାଖରେ (ମୁହଁ, ହାତ ବା ଗୋଡ଼) ସ୍ପଷ୍ଟ ଅଛି?",
            },
        },
        {
            "id": "speech_difficulty_or_slurring",
            "type": "boolean",
            "prompt": {
                "en": "Is your speech slurred, or do you have sudden trouble understanding spoken words?",
                "hi": "क्या बोलने में जुबान लड़खड़ा रही है, या दूसरों की बात समझने में अचानक कठिनाई हो रही है?",
                "or": "କଥା କହିବାରେ ଅସ୍ପଷ୍ଟତା କିମ୍ବା ଅନ୍ୟମାନଙ୍କ କଥା ବୁଝିବାରେ ହଠାତ୍ ଅସୁବିଧା ହେଉଛି କି?",
            },
        },
        {
            "id": "sudden_onset_under_4_hours",
            "type": "boolean",
            "prompt": {
                "en": "Did these neurological signs begin suddenly within the last few hours?",
                "hi": "क्या ये लक्षण पिछले कुछ ही घंटों के भीतर अचानक शुरू हुए हैं?",
                "or": "ଏହି ଲକ୍ଷଣଗୁଡ଼ିକ କ’ଣ ଗତ କିଛି ଘଣ୍ଟା ମଧ୍ୟରେ ହଠାତ୍ ଆରମ୍ଭ ହୋଇଛି?",
            },
        },
    ],
    "severe_shortness_of_breath": [
        {
            "id": "inability_to_speak_full_sentences",
            "type": "boolean",
            "prompt": {
                "en": "Are you struggling to speak full sentences without pausing to catch your breath?",
                "hi": "क्या आप बिना रुके एक छोटा वाक्य भी पूरा नहीं बोल पा रहे हैं?",
                "or": "ଆପଣ କ’ଣ ଅଟକି ନିଶ୍ୱାସ ନନେଇ ଗୋଟିଏ ବାକ୍ୟ ପୂରା କହିପାରୁ ନାହାନ୍ତି?",
            },
        },
        {
            "id": "stridor_or_rest_wheezing",
            "type": "boolean",
            "prompt": {
                "en": "Can you hear a high-pitched whistling or harsh sound when breathing in or at rest?",
                "hi": "क्या सांस लेते समय या विश्राम में सीटी जैसी तीखी आवाज आ रही है?",
                "or": "ନିଶ୍ୱାସ ନେବା ସମୟରେ କ’ଣ ତୀକ୍ଷ୍ଣ ହୁଇସିଲ୍ ବା ଶବ୍ଦ ଶୁଣାଯାଉଛି?",
            },
        },
        {
            "id": "bluish_lips_or_cyanosis",
            "type": "boolean",
            "prompt": {
                "en": "Is there a noticeable blue or gray tinge around your lips, tongue, or fingernails?",
                "hi": "क्या होंठ, जीभ या नाखूनों के आसपास नीलापन दिखाई दे रहा है?",
                "or": "ଓଠ, ଜିଭ ବା ନଖ ଚାରିପାଖରେ କ’ଣ ନୀଳ ରଙ୍ଗ ଦେଖାଯାଉଛି?",
            },
        },
    ],
    "acute_allergic_reaction": [
        {
            "id": "throat_tightness_or_swallowing_difficulty",
            "type": "boolean",
            "prompt": {
                "en": "Do you feel throat tightness, difficulty swallowing, or hoarseness of voice?",
                "hi": "क्या गले में कसाव, निगलने में कठिनाई, या आवाज में भारीपन महसूस हो रहा है?",
                "or": "ଗଳାରେ ଚିପି ହେବା, ଢୋକିବାରେ ଅସୁବିଧା ବା ସ୍ୱରରେ ପରିବର୍ତ୍ତନ ଲାଗୁଛି କି?",
            },
        },
        {
            "id": "recent_allergen_or_medication_exposure",
            "type": "boolean",
            "prompt": {
                "en": "Did you recently take a new medicine, eat nuts/seafood, or receive an insect bite?",
                "hi": "क्या आपने हाल ही में कोई नई दवा ली है, एलर्जी वाला खाना खाया है, या कोई कीड़ा काटा है?",
                "or": "ଆପଣ କ’ଣ ନିକଟରେ ନୂଆ ଔଷଧ ନେଇଛନ୍ତି ବା କୀଟ କାମୁଡ଼ିଛି?",
            },
        },
    ],
    "excessive_thirst_and_vomiting": [
        {
            "id": "known_diabetes_history",
            "type": "boolean",
            "prompt": {
                "en": "Have you been diagnosed with Type 1 or Type 2 Diabetes?",
                "hi": "क्या आपको पहले से टाइप 1 या टाइप 2 मधुमेह (डायबिटीज) है?",
                "or": "ଆପଣଙ୍କର କ’ଣ ପୂର୍ବରୁ ମଧୁମେହ (ଡାୟାବେଟିସ୍) ରୋଗ ଅଛି?",
            },
        },
        {
            "id": "persistent_vomiting_fluids",
            "type": "boolean",
            "prompt": {
                "en": "Are you completely unable to keep water or fluids down due to frequent vomiting?",
                "hi": "क्या बार-बार उल्टी होने के कारण आप पानी भी नहीं पचा पा रहे हैं?",
                "or": "ଲଗାତାର ବାନ୍ତି ଯୋଗୁଁ ଆପଣ କ’ଣ ପାଣି ମଧ୍ୟ ରଖିପାରୁ ନାହାନ୍ତି?",
            },
        },
        {
            "id": "fruity_breath_odor",
            "type": "boolean",
            "prompt": {
                "en": "Have you or others noticed a sweet, fruity, or nail-polish-remover scent on your breath?",
                "hi": "क्या आपकी सांस में मीठी, फलों जैसी या नेल-पॉलिश रिमूवर जैसी गंध आ रही है?",
                "or": "ଆପଣଙ୍କ ନିଶ୍ୱାସରେ କ’ଣ ମିଠା ଫଳ ବା ରାସାୟନିକ ପରି ଗନ୍ଧ ଆସୁଛି?",
            },
        },
    ],
}
