import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { RotateCcw, Stethoscope, ArrowRight } from 'lucide-react';
import { apiClient } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { SymptomSelector, SymptomItem } from '@/modules/symptom-triage/SymptomSelector';
import { DynamicQuestionFlow, FollowUpQuestion } from '@/modules/symptom-triage/DynamicQuestionFlow';
import { EmergencyOverrideBanner } from '@/modules/symptom-triage/EmergencyOverrideBanner';
import { TriageResultCard, TriageResultData } from '@/modules/symptom-triage/TriageResultCard';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const FALLBACK_SYMPTOMS: SymptomItem[] = [
  {
    id: 'chest_pain',
    category: 'cardiovascular',
    label: {
      en: 'Chest Pain, Pressure, or Discomfort',
      hi: 'सीने में दर्द, दबाव या बेचैनी',
      or: 'ଛାତିରେ ଯନ୍ତ୍ରଣା, ଚାପ ବା ଅସ୍ୱସ୍ଥି',
    },
    description: {
      en: 'Tightness, squeezing, or heaviness in center or left chest',
      hi: 'छाती के बीच या बाईं ओर भारीपन या खिंचाव',
      or: 'ଛାତିର ମଝିରେ ବା ବାମ ପାଖରେ ଭାରୀପଣ ବା ଚାପ',
    },
    icon: 'Heart',
    red_flag_alert: true,
  },
  {
    id: 'facial_droop_or_weakness',
    category: 'neurological',
    label: {
      en: 'Facial Droop, Arm Weakness, or Slurred Speech',
      hi: 'चेहरे का टेढ़ापन, हाथ की कमजोरी, या लड़खड़ाती आवाज',
      or: 'ମୁହଁ ବଙ୍କା ହେବା, ହାତ ଦୁର୍ବଳତା, ବା କଥା ଅସ୍ପଷ୍ଟ ହେବା',
    },
    description: {
      en: 'Sudden weakness on one side of face or body, difficulty speaking',
      hi: 'अचानक चेहरे या शरीर के एक हिस्से में कमजोरी, बोलने में कठिनाई',
      or: 'ହଠାତ୍ ମୁହଁ ବା ଶରୀରର ଗୋଟିଏ ପାଖ ଦୁର୍ବଳ ହେବା, କହିବାରେ ଅସୁବିଧା',
    },
    icon: 'Brain',
    red_flag_alert: true,
  },
  {
    id: 'severe_shortness_of_breath',
    category: 'respiratory',
    label: {
      en: 'Shortness of Breath or Breathing Difficulty',
      hi: 'सांस फूलना या सांस लेने में गंभीर कठिनाई',
      or: 'ଶ୍ୱାସକଷ୍ଟ ବା ନିଶ୍ୱାସ ନେବାରେ ଗୁରୁତର ଅସୁବିଧା',
    },
    description: {
      en: 'Inability to speak full sentences without gasping, wheezing at rest',
      hi: 'विश्राम में भी सांस फूलना या एक वाक्य पूरा न बोल पाना',
      or: 'ବିଶ୍ରାମ ସମୟରେ ମଧ୍ୟ ଶ୍ୱାସକଷ୍ଟ ବା କଥା କହି ନପାରିବା',
    },
    icon: 'Wind',
    red_flag_alert: true,
  },
  {
    id: 'acute_allergic_reaction',
    category: 'immunological',
    label: {
      en: 'Sudden Swelling, Rash, or Allergic Reaction',
      hi: 'अचानक सूजन, त्वचा पर चकत्ते, या एलर्जी',
      or: 'ହଠାତ୍ ଫୁଲିବା, ଚର୍ମରେ କୁଣ୍ଡିଆ, ବା ଏଲର୍ଜି',
    },
    description: {
      en: 'Swelling of lips, tongue, or throat following food, sting, or medicine',
      hi: 'दवा, भोजन या डंक के बाद होंठ या गले में सूजन',
      or: 'ଔଷଧ, ଖାଦ୍ୟ ବା କୀଟ କାମୁଡ଼ା ପରେ ଗଳା ଫୁଲିବା',
    },
    icon: 'ShieldAlert',
    red_flag_alert: true,
  },
  {
    id: 'thunderclap_headache',
    category: 'neurological',
    label: {
      en: 'Severe Sudden Headache or Stiff Neck with Fever',
      hi: 'अचानक असहनीय सिरदर्द या बुखार के साथ गर्दन में अकड़न',
      or: 'ହଠାତ୍ ଅସହ୍ୟ ମୁଣ୍ଡବିନ୍ଧା ବା ଜ୍ୱର ସହ ବେକ ଟାଣ ହେବା',
    },
    description: {
      en: 'Worst headache of life peaking in under 1 minute',
      hi: '1 मिनट से भी कम समय में अत्यधिक तेज असहनीय सिरदर्द',
      or: 'ଗୋଟିଏ ମିନିଟ୍ ମଧ୍ୟରେ ଅସହ୍ୟ ମୁଣ୍ଡବିନ୍ଧା',
    },
    icon: 'Zap',
    red_flag_alert: true,
  },
  {
    id: 'excessive_thirst_and_vomiting',
    category: 'metabolic',
    label: {
      en: 'Severe Thirst, Frequent Urination & Vomiting',
      hi: 'अत्यधिक प्यास, बार-बार पेशाब और उल्टी',
      or: 'ଅତ୍ୟଧିକ ଶୋଷ, ବାରମ୍ବାର ପରିସ୍ରା ଏବଂ ବାନ୍ତି',
    },
    description: {
      en: 'Rapid onset of unquenchable thirst, abdominal pain, nausea/vomiting',
      hi: 'अचानक बहुत प्यास लगना, पेट दर्द और उल्टी होना',
      or: 'ଅତ୍ୟଧିକ ଶୋଷ, ପେଟ ଯନ୍ତ୍ରଣା ଏବଂ ବାନ୍ତି',
    },
    icon: 'Droplets',
    red_flag_alert: false,
  },
  {
    id: 'mild_fatigue_or_gradual_symptoms',
    category: 'metabolic',
    label: {
      en: 'Gradual Fatigue, Mild Weight Changes, or General Malaise',
      hi: 'हल्की थकान, धीरे-धीरे वजन में बदलाव, या सामान्य सुस्ती',
      or: 'ସାମାନ୍ୟ କ୍ଲାନ୍ତି, ଧୀରେ ଧୀରେ ଓଜନ ପରିବର୍ତ୍ତନ, ବା ସାଧାରଣ ଦୁର୍ବଳତା',
    },
    description: {
      en: 'Chronic or gradual symptoms persisting over weeks without acute distress',
      hi: 'हफ्तों से बनी रहने वाली हल्की सुस्ती या थकान',
      or: 'ସପ୍ତାହ ଧରି ଲାଗି ରହିଥିବା ସାଧାରଣ କ୍ଲାନ୍ତି ବା ଦୁର୍ବଳତା',
    },
    icon: 'Activity',
    red_flag_alert: false,
  },
];

export const SymptomTriagePage: React.FC = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const currentLang = i18n.language || 'en';

  const [symptomsCatalog, setSymptomsCatalog] = useState<SymptomItem[]>(FALLBACK_SYMPTOMS);
  const [followUpsCatalog, setFollowUpsCatalog] = useState<Record<string, FollowUpQuestion[]>>({});
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResultData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch dynamic questions on mount or lang change
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await apiClient<any>(`/triage/questions?lang=${currentLang}`);
        if (data.primary_symptoms) {
          setSymptomsCatalog(data.primary_symptoms);
        }
        if (data.adaptive_follow_ups) {
          setFollowUpsCatalog(data.adaptive_follow_ups);
        }
      } catch (err) {
        // Fallback already preloaded
        console.warn('Using local fallback questionnaire schema');
      }
    };
    fetchQuestions();
  }, [currentLang]);

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    // Clear previous results on change
    setResult(null);
  };

  const handleAttributeChange = (key: string, value: any) => {
    setAttributes((prev) => ({
      ...prev,
      [key]: value,
    }));
    setResult(null);
  };

  const handleEvaluate = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await apiClient<TriageResultData>(`/triage/evaluate?lang=${currentLang}`, {
        method: 'POST',
        body: JSON.stringify({
          primary_symptoms: selectedSymptoms,
          symptom_attributes: attributes,
          patient_context: {},
        }),
      });
      setResult(data);
      try {
        localStorage.setItem('vytal_assessment_triage', JSON.stringify({ ...data, user_id: user?.id }));
      } catch {
        // Ignore local storage error
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to evaluate symptom triage rules.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setAttributes({});
    setResult(null);
    setErrorMessage(null);
    try {
      localStorage.removeItem('vytal_assessment_triage');
    } catch {
      // Ignore
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              MODULE 03
            </span>
            <Badge variant="normal">Deterministic Clinical Rule Engine</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            03 — SymptomSense
          </h1>
          <p className="text-xs font-semibold text-teal-700 mt-0.5">
            Understand symptoms and warning signs.
          </p>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Purpose: Explainable, rule-based symptom triage. A transparent clinical rule engine governed by emergency-first evaluation. Life-threatening
            red flags evaluate first and cannot be overridden by lower-priority or routine findings.
          </p>
        </div>

        {selectedSymptoms.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="self-start sm:self-auto text-slate-500">
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Reset Questionnaire
          </Button>
        )}
      </div>

      {/* Safety Notice Banner */}
      <Alert variant="warning" title="Educational Safety Protocol (Not a Diagnosis)">
        VYTAL is an educational decision-support tool, not a medical practitioner. If you are experiencing
        an immediate life-threatening medical event, call 108 or 112 immediately without completing questionnaires.
      </Alert>

      {/* Emergency Override Banner if triggered */}
      {result && result.emergency_override_triggered && (
        <ErrorBoundary sectionName="Emergency Alert Banner">
          <EmergencyOverrideBanner
            actionText={result.action_required}
            safetyNetting={result.safety_netting}
            ruleNames={(result.triggered_rules || []).map((r) => r.rule_name)}
          />
        </ErrorBoundary>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <Alert variant="emergency" title="Evaluation Error">
          {errorMessage}
        </Alert>
      )}

      {/* Main Flow Grid */}
      <div className="space-y-6">
        <Card className="border-teal-200/80 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-teal-600" />
              <CardTitle className="text-lg">Clinical Symptom Assessment</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Check all applicable symptoms below. Adaptive follow-up questions will appear dynamically.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Step 1: Primary Symptoms */}
            <SymptomSelector
              symptoms={symptomsCatalog}
              selectedIds={selectedSymptoms}
              onToggle={toggleSymptom}
              lang={currentLang}
            />

            {/* Step 2: Dynamic Follow-Ups */}
            <DynamicQuestionFlow
              selectedSymptomIds={selectedSymptoms}
              adaptiveFollowUps={followUpsCatalog}
              attributes={attributes}
              onAttributeChange={handleAttributeChange}
              lang={currentLang}
            />

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                {selectedSymptoms.length === 0
                  ? 'Select at least one symptom to evaluate rules.'
                  : `${selectedSymptoms.length} symptom(s) ready for deterministic rule evaluation.`}
              </div>
              <Button
                onClick={handleEvaluate}
                disabled={selectedSymptoms.length === 0 || loading}
                isLoading={loading}
                size="lg"
                className="w-full sm:w-auto"
              >
                <span>Evaluate Clinical Rules</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Component */}
        {result && (
          <div className="space-y-6 pt-4">
            <ErrorBoundary sectionName="SymptomSense Assessment Results">
              <TriageResultCard result={result} />
            </ErrorBoundary>
          </div>
        )}
      </div>
    </div>
  );
};
