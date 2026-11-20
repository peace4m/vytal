import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, ShieldCheck, Cpu } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div>
        <Badge variant="info">Informatics Research</Badge>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
          About VYTAL & Methodological Foundations
        </h1>
        <p className="text-slate-600 text-sm mt-2 leading-relaxed">
          {t('brand.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-teal-600" />
              <CardTitle className="text-base">Deterministic Safety Rules</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 leading-relaxed space-y-2">
            <p>
              In high-stakes clinical decision-support, statistical machine learning models must never be trusted with emergent life-or-death decisions.
            </p>
            <p>
              VYTAL's triage logic is built on audited, versioned clinical guidelines (NICE Clinical Guideline CG95, WHO ETAT). Life-threatening emergency red flags evaluate first and strictly override lower-priority advice.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-base">Independent ML Subsystem</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 leading-relaxed space-y-2">
            <p>
              The machine learning research engine is an autonomous data science pipeline exploring diabetes risk classification on South Asian clinical cohorts (Islam et al., 2020, UCI 529).
            </p>
            <p>
              It incorporates SHAP explainability (Lundberg & Lee) and Mitchell et al. Model Cards, completely decoupled from the patient triage rules.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-base">Primary Literature Citations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-xs text-slate-600 space-y-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <h5 className="font-semibold text-slate-900">Indian Diabetes Risk Score (IDRS)</h5>
            <p className="text-slate-500 mt-0.5">
              Mohan V, Deepa R, Deepa M, Somannavar S, Datta M. <em>A simplified Indian Diabetes Risk Score for screening for undiagnosed diabetic subjects</em>. <strong>Journal of the Association of Physicians of India</strong> (JAPI). 2005 Sep;53:759–63. PMID: 16334622.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <h5 className="font-semibold text-slate-900">South Asian Clinical Benchmark Dataset</h5>
            <p className="text-slate-500 mt-0.5">
              Islam MMF, Ferdousi R, Rahman S, Bushra HY. <em>Likelihood Prediction of Diabetes at Early Stage Using Data Mining Techniques</em>. <strong>Computer Methods and Programs in Biomedicine</strong> (UCI ID: 529, Sylhet Diabetes Hospital, Bangladesh).
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <h5 className="font-semibold text-slate-900">Explainable AI Attribution</h5>
            <p className="text-slate-500 mt-0.5">
              Lundberg SM, Lee SI. <em>A Unified Approach to Interpreting Model Predictions</em>. <strong>Advances in Neural Information Processing Systems (NeurIPS 30)</strong>; 2017.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
