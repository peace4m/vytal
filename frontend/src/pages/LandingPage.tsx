import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Activity,
  AlertTriangle,
  Pill,
  ClipboardCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  const modules = [
    {
      num: '01',
      title: 'Report Explainer',
      desc: 'Understand laboratory reports in plain language. Extracts test values, units, and laboratory-printed reference ranges with mandatory user confirmation.',
      icon: <FileText className="w-5 h-5 text-teal-600" />,
      link: '/modules/report-explainer',
      evidence: 'AACC Clinical Reference Protocols',
    },
    {
      num: '02',
      title: 'Indian Diabetes Risk Score',
      desc: 'Transparent implementation of the published 4-parameter scoring tool by Dr. V. Mohan et al. (JAPI 2005) with exact sensitivity/specificity disclosures.',
      icon: <Activity className="w-5 h-5 text-teal-600" />,
      link: '/modules/risk-score',
      evidence: 'Mohan et al. (JAPI 2005; 53:759–63)',
    },
    {
      num: '03',
      title: 'Symptom Triage',
      desc: 'Deterministic clinical triage where life-threatening emergency red flags evaluate first and strictly override lower-priority recommendations.',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      link: '/modules/symptom-triage',
      evidence: 'NICE CG95 & WHO ETAT Protocols',
    },
    {
      num: '04',
      title: 'Medication Interaction Checker',
      desc: 'Evidence-backed pairwise drug interaction checks using RxNorm normalization, ONC high-priority lists, and mandatory coverage limitation disclaimers.',
      icon: <Pill className="w-5 h-5 text-teal-600" />,
      link: '/modules/medication-check',
      evidence: 'NIH RxNorm & ONC High-Priority List',
    },
    {
      num: '05',
      title: 'Health Summary',
      desc: 'Consolidates verified findings from all modules into a prioritized, downloadable clinical brief with timestamped source citations.',
      icon: <ClipboardCheck className="w-5 h-5 text-emerald-600" />,
      link: '/modules/health-summary',
      evidence: 'Cross-Module Synthesis Engine',
    },
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Evidence-Based Healthcare Informatics Research</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
          Your Health, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Decoded.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          {t('brand.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/dashboard">
            <Button size="lg" className="w-full sm:w-auto shadow-md">
              <span>{t('actions.getStarted')}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <span>{t('actions.learnMore')}</span>
            </Button>
          </Link>
        </div>

        {/* Feature Checkpoints */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Zero Hallucinations Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100% Deterministic Clinical Rules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Multilingual: EN, HI, OR</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Ephemeral Privacy-by-Design</span>
          </div>
        </div>
      </section>

      {/* The Five Healthcare Modules in Sequential Order */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="info">Sequential Workflow</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Five Integrated Healthcare Modules
          </h2>
          <p className="text-sm text-slate-500">
            Designed to guide individuals from raw diagnostic data to a consolidated, auditable health brief.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((m) => (
            <Card key={m.num} className="hover:border-teal-300/80 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                    MODULE {m.num}
                  </span>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    {m.icon}
                  </div>
                </div>
                <CardTitle className="text-base">{m.title}</CardTitle>
                <CardDescription className="line-clamp-3 text-xs leading-relaxed">
                  {m.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium truncate max-w-[180px]">
                    {m.evidence}
                  </span>
                  <Link
                    to={m.link}
                    className="text-teal-700 hover:text-teal-800 font-semibold inline-flex items-center gap-1"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Special Card for ML Research Subsystem */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-800 shadow-md flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  RESEARCH SUBSYSTEM
                </span>
                <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <CardTitle className="text-base text-white">Independent ML Research</CardTitle>
              <CardDescription className="text-slate-300 text-xs leading-relaxed">
                Autonomous data science pipeline benchmarking Logistic Regression, Decision Trees, Random Forests, and SVM on South Asian cohorts with SHAP explainability.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Sylhet Cohort (UCI 529)
                </span>
                <Link
                  to="/research-dashboard"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Explore Models</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
