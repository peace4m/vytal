import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { CheckCircle2, XCircle } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div>
        <Badge variant="emergency">Mandatory Safety Position</Badge>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
          Safety Boundaries & Non-Device Determination
        </h1>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          VYTAL is strictly an educational and informatics research prototype. It is not a medical device.
        </p>
      </div>

      <Alert variant="emergency" title="Emergency Protocol">
        {t('safety.emergencyCall')}
      </Alert>

      {/* Negative Scope vs Positive Scope */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="border-rose-200 bg-rose-50/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" />
              <CardTitle className="text-base text-rose-900">What VYTAL NEVER Does</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-slate-700 space-y-2.5">
            <div className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Never Diagnoses Disease</strong>: The system does not confirm or rule out illness.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Never Prescribes Medication</strong>: The system never advises drug initiation or dosage titration.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Never Tells You to Stop Medication</strong>: All prescription changes must be clinician-directed.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Never Overrides Emergency Care</strong>: ML models never modify clinical triage warnings.</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-teal-50/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <CardTitle className="text-base text-teal-900">What VYTAL Provides</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-slate-700 space-y-2.5">
            <div className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span><strong>Plain-Language Biomarker Education</strong>: Simple explanations of laboratory test results.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span><strong>Validated Screening Scores</strong>: Transparent implementation of Mohan et al. IDRS.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span><strong>Emergency Warning Screening</strong>: Red-flag triage matching established NICE/WHO guidance.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">•</span>
              <span><strong>Drug Interaction Context</strong>: Normalization via RxNorm & documented evidence tables.</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Regulatory Non-Device Determination</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-slate-600 leading-relaxed space-y-2">
          <p>
            Under Section 3060 of the 21st Century Cures Act and the US FDA Clinical Decision Support (CDS) Guidance (September 2022), VYTAL meets all four Non-Device criteria:
          </p>
          <ol className="list-decimal pl-4 space-y-1 text-slate-700">
            <li>It does not acquire, process, or analyze medical images or physiological signals.</li>
            <li>It displays and analyzes confirmed laboratory information and published scoring factors.</li>
            <li>It provides decision-support information to support health literacy.</li>
            <li>It enables the user and their healthcare professional to independently review the basis of every recommendation through complete literature citations and transparent scoring arithmetic.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
