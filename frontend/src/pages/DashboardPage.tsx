import React, { useState } from 'react';
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
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { getStoredSessionToken, purgeSession } from '@/services/api';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const sessionToken = getStoredSessionToken();

  const handlePurge = async () => {
    if (!sessionToken) return;
    setIsPurging(true);
    try {
      await purgeSession(sessionToken);
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to purge session:', err);
    } finally {
      setIsPurging(false);
    }
  };

  const moduleItems = [
    {
      num: '01',
      title: 'Report Explainer',
      route: '/modules/report-explainer',
      status: 'Ready',
      desc: 'Extract lab test values and printed reference ranges from PDF or manual intake.',
      icon: <FileText className="w-5 h-5 text-teal-600" />,
    },
    {
      num: '02',
      title: 'Indian Diabetes Risk Score',
      route: '/modules/risk-score',
      status: 'Ready',
      desc: 'Compute validated 4-parameter IDRS based on Mohan et al. (JAPI 2005).',
      icon: <Activity className="w-5 h-5 text-teal-600" />,
    },
    {
      num: '03',
      title: 'Symptom Triage',
      route: '/modules/symptom-triage',
      status: 'Ready',
      desc: 'Deterministic symptom questionnaire with prioritized emergency red-flag screening.',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
    },
    {
      num: '04',
      title: 'Medication Interaction Checker',
      route: '/modules/medication-check',
      status: 'Ready',
      desc: 'Pairwise medication interaction check with RxNorm normalization & negative disclaimers.',
      icon: <Pill className="w-5 h-5 text-teal-600" />,
    },
    {
      num: '05',
      title: 'Health Summary',
      route: '/modules/health-summary',
      status: 'Ready',
      desc: 'Consolidated clinical synthesis and downloadable timestamped PDF brief.',
      icon: <ClipboardCheck className="w-5 h-5 text-emerald-600" />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Decision-Support Workspace
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access the five healthcare modules in sequential order, or explore the independent ML research engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {sessionToken && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePurge}
              isLoading={isPurging}
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              <span>{t('actions.clearData')}</span>
            </Button>
          )}
          <Link to="/research-dashboard">
            <Button variant="secondary" size="sm">
              <Sparkles className="w-4 h-4 mr-1.5" />
              <span>Research Lab</span>
            </Button>
          </Link>
        </div>
      </div>

      {purgeSuccess && (
        <Alert variant="success" title="Session Purged">
          All temporary session data and observations have been permanently wiped from the database.
        </Alert>
      )}

      {/* Module Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Core Healthcare Modules (Fixed Sequence)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {moduleItems.map((m) => (
            <Card key={m.num} className="hover:border-teal-300 hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                    MODULE {m.num}
                  </span>
                  <Badge variant="normal" size="sm">{m.status}</Badge>
                </div>
                <div className="flex items-center gap-2.5 mt-1">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    {m.icon}
                  </div>
                  <CardTitle className="text-base">{m.title}</CardTitle>
                </div>
                <CardDescription className="text-xs mt-2 leading-relaxed">
                  {m.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <Link to={m.route}>
                  <Button variant="outline" size="sm" fullWidth className="group justify-between">
                    <span>Open Module {m.num}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
