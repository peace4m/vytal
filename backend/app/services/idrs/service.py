"""
Indian Diabetes Risk Score Service (Module 02)
Implements Mohan et al. (Journal of the Association of Physicians of India, 2005; 53:759–763).
Provides verified scoring arithmetic, risk classification, sensitivity/specificity disclosures,
and multilingual patient education in English, Hindi, and Odia.
"""

import uuid
from typing import Optional, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.schemas.idrs import (
    IDRSCalculateRequest,
    IDRSScoreBreakdown,
    IDRSClinicalContext,
    IDRSCalculateResponse,
)
from backend.app.database.models.idrs import IDRSAssessmentModel
from backend.app.database.models.session import SessionModel


MULTILINGUAL_IDRS_GUIDANCE: Dict[str, Dict[str, Dict[str, str]]] = {
    "en": {
        "low": {
            "label": "Low Risk (< 30 points)",
            "interpretation": "A score below 30 indicates a low probability of undiagnosed diabetes based on CURES criteria.",
            "recommendation": "Maintain a balanced diet and regular physical activity. Re-screen annually.",
        },
        "moderate": {
            "label": "Moderate Risk (30–50 points)",
            "interpretation": "A score between 30 and 50 represents moderate risk. Early lifestyle intervention is effective in delaying metabolic risk.",
            "recommendation": "Adopt regular aerobic exercise (brisk walking at least 150 minutes/week) and discuss preventive screening at your next routine medical visit.",
        },
        "high": {
            "label": "High Risk (>= 60 points)",
            "interpretation": "A score of 60 or higher indicates a high probability of undiagnosed diabetes or prediabetes based on the Chennai Urban Rural Epidemiology Study.",
            "recommendation": "It is strongly advised to undergo definitive laboratory testing (Fasting Blood Glucose or HbA1c) in consultation with a qualified medical professional.",
        },
    },
    "hi": {
        "low": {
            "label": "कम जोखिम (< 30 अंक)",
            "interpretation": "30 से कम स्कोर CURES मानदंडों के अनुसार अज्ञात मधुमेह की कम संभावना दर्शाता है।",
            "recommendation": "संतुलित आहार और नियमित व्यायाम बनाए रखें। प्रतिवर्ष पुनः जांच करें।",
        },
        "moderate": {
            "label": "मध्यम जोखिम (30–50 अंक)",
            "interpretation": "30 से 50 के बीच का स्कोर मध्यम जोखिम दर्शाता है। जीवनशैली में सुधार मधुमेह के खतरे को टालने में अत्यधिक प्रभावी है।",
            "recommendation": "सप्ताह में कम से कम 150 मिनट तेज टहलने की आदत डालें और डॉक्टर से परामर्श लें।",
        },
        "high": {
            "label": "उच्च जोखिम (>= 60 अंक)",
            "interpretation": "60 या उससे अधिक का स्कोर अज्ञात मधुमेह या प्रीडायबिटीज की उच्च संभावना को दर्शाता है।",
            "recommendation": "यह सलाह दी जाती है कि डॉक्टर से परामर्श करके खाली पेट रक्त शर्करा (FBS) या HbA1c रक्त परीक्षण करवाएं।",
        },
    },
    "or": {
        "low": {
            "label": "କମ୍ ବିପଦ (< ୩୦ ପଏଣ୍ଟ)",
            "interpretation": "୩୦ ରୁ କମ୍ ସ୍କୋର ମଧୁମେହର କମ୍ ସମ୍ଭାବନା ଦର୍ଶାଏ।",
            "recommendation": "ସନ୍ତୁଳିତ ଆହାର ଏବଂ ନିୟମିତ ବ୍ୟାୟାମ ଜାରି ରଖନ୍ତୁ।",
        },
        "moderate": {
            "label": "ମଧ୍ୟମ ବିପଦ (୩୦–୫୦ ପଏଣ୍ଟ)",
            "interpretation": "୩୦ ରୁ ୫୦ ମଧ୍ୟରେ ସ୍କୋର ମଧ୍ୟମ ଧରଣର ବିପଦ ଦର୍ଶାଏ।",
            "recommendation": "ନିୟମିତ ବ୍ୟାୟାମ କରନ୍ତୁ ଏବଂ ଖାଦ୍ୟପେୟରେ ସନ୍ତୁଳନ ରକ୍ଷା କରନ୍ତୁ।",
        },
        "high": {
            "label": "ଉଚ୍ଚ ବିପଦ (>= ୬୦ ପଏଣ୍ଟ)",
            "interpretation": "୬୦ ବା ତଦୁର୍ଦ୍ଧ୍ୱ ସ୍କୋର ମଧୁମେହର ଉଚ୍ଚ ସମ୍ଭାବନା ଦର୍ଶାଏ।",
            "recommendation": "ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନେଇ ତୁରନ୍ତ ରକ୍ତ ଶର୍କରା (FBS) କିମ୍ବା HbA1c ପରୀକ୍ଷା କରାଇନିଅନ୍ତୁ।",
        },
    },
}


class IDRSService:

    @classmethod
    async def calculate_score(
        cls,
        request: IDRSCalculateRequest,
        session_token: Optional[str],
        lang: str,
        db: AsyncSession,
    ) -> IDRSCalculateResponse:
        """
        Executes strict 4-factor scoring arithmetic.
        """
        if lang not in ["en", "hi", "or"]:
            lang = "en"

        # 1. Age Points
        if request.age < 35:
            age_points = 0
            age_tier = "< 35 years"
        elif request.age <= 49:
            age_points = 20
            age_tier = "35-49 years"
        else:
            age_points = 30
            age_tier = ">= 50 years"

        # 2. Waist Circumference Points
        if request.gender == "female":
            if request.waist_circumference_cm < 80.0:
                waist_points = 0
                waist_tier = "< 80 cm"
            elif request.waist_circumference_cm <= 89.0:
                waist_points = 10
                waist_tier = "80-89 cm"
            else:
                waist_points = 20
                waist_tier = ">= 90 cm"
        else:  # male
            if request.waist_circumference_cm < 90.0:
                waist_points = 0
                waist_tier = "< 90 cm"
            elif request.waist_circumference_cm <= 99.0:
                waist_points = 10
                waist_tier = "90-99 cm"
            else:
                waist_points = 20
                waist_tier = ">= 100 cm"

        # 3. Physical Activity Points
        if request.physical_activity_tier == "vigorous":
            activity_points = 0
            activity_desc = "Regular exercise AND strenuous occupational work"
        elif request.physical_activity_tier == "moderate":
            activity_points = 20
            activity_desc = "Regular exercise OR strenuous occupational work"
        else:
            activity_points = 30
            activity_desc = "No exercise AND sedentary occupational work"

        # 4. Family History Points
        if request.family_history_tier == "none":
            family_points = 0
            family_desc = "No family history (neither parent diagnosed)"
        elif request.family_history_tier == "one_parent":
            family_points = 10
            family_desc = "One parent diagnosed with diabetes"
        else:
            family_points = 20
            family_desc = "Both parents diagnosed with diabetes"

        total_score = age_points + waist_points + activity_points + family_points

        if total_score < 30:
            risk_category = "low"
        elif total_score <= 50:
            risk_category = "moderate"
        else:
            risk_category = "high"

        guidance = MULTILINGUAL_IDRS_GUIDANCE.get(lang, MULTILINGUAL_IDRS_GUIDANCE["en"])[risk_category]

        assessment_id = str(uuid.uuid4())

        # If a valid session token exists, persist assessment in DB
        if session_token:
            stmt = select(SessionModel).where(SessionModel.session_token == session_token)
            res = await db.execute(stmt)
            sess = res.scalar_one_or_none()
            if sess:
                model_obj = IDRSAssessmentModel(
                    id=assessment_id,
                    session_id=sess.id,
                    age=request.age,
                    age_points=age_points,
                    gender=request.gender,
                    waist_circumference_cm=request.waist_circumference_cm,
                    waist_points=waist_points,
                    physical_activity_tier=request.physical_activity_tier,
                    activity_points=activity_points,
                    family_history_tier=request.family_history_tier,
                    family_history_points=family_points,
                    total_score=total_score,
                    risk_category=risk_category,
                )
                db.add(model_obj)
                await db.flush()

        return IDRSCalculateResponse(
            assessment_id=assessment_id,
            breakdown=IDRSScoreBreakdown(
                age_input=request.age,
                age_tier=age_tier,
                age_points=age_points,
                gender=request.gender,
                waist_circumference_cm=request.waist_circumference_cm,
                waist_tier=waist_tier,
                waist_points=waist_points,
                physical_activity_tier=request.physical_activity_tier,
                activity_description=activity_desc,
                activity_points=activity_points,
                family_history_tier=request.family_history_tier,
                family_history_description=family_desc,
                family_history_points=family_points,
            ),
            total_score=total_score,
            risk_category=risk_category,
            clinical_context=IDRSClinicalContext(
                risk_label=guidance["label"],
                interpretation=guidance["interpretation"],
                sensitivity="72.5%",
                specificity="60.1%",
                recommendation=guidance["recommendation"],
                bibliographic_citation="Mohan V, Deepa R, Deepa M, Somannavar S, Datta M. A simplified Indian Diabetes Risk Score for screening for undiagnosed diabetic subjects. J Assoc Physicians India. 2005 Sep;53:759-63.",
            ),
        )
