import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { RotateCcw, Loader2, ShieldCheck } from 'lucide-react';
import { apiClient } from '@/services/api';
import { ExecutiveBriefHeader } from '@/modules/health-summary/ExecutiveBriefHeader';
import { CrossModuleInsights, CrossModuleInsightItem } from '@/modules/health-summary/CrossModuleInsights';
import { ModuleFindingsAccordion } from '@/modules/health-summary/ModuleFindingsAccordion';

interface HealthSummaryResponseData {
  summary_id: string;
  generated_at: string;
  highest_acuity: string;
  module_01_report: any;
  module_02_idrs: any;
  module_03_triage: any;
  module_04_medications: any;
  cross_module_insights: CrossModuleInsightItem[];
  pdf_export_url: string;
  mandatory_safety_disclaimer: string;
}

export const HealthSummaryPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const [summary, setSummary] = useState<HealthSummaryResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await apiClient<HealthSummaryResponseData>(
        `/summary/generate?lang=${currentLang}`,
        { method: 'POST' }
      );
      setSummary(data);
    } catch (err: any) {
      console.error('Failed to generate health summary', err);
      setErrorMessage(err.message || 'Unable to consolidate session health brief.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [currentLang]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              MODULE 05
            </span>
            <Badge variant="normal">Multi-Module Clinical Synthesis</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Health Summary & Clinical Brief
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Synthesizes confirmed laboratory observations, IDRS diabetes risk, symptom triage protocols,
            and medication interactions into a prioritized decision-support brief.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchSummary}
          disabled={loading}
          className="self-start sm:self-auto text-slate-600"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
          ) : (
            <RotateCcw className="w-4 h-4 mr-1.5" />
          )}
          Refresh Summary
        </Button>
      </div>

      {/* Safety Notice */}
      <Alert variant="info" title="Educational & Research Decision-Support Synthesis">
        This consolidated brief summarizes findings entered across VYTAL's modules during your session.
        It does not formulate a medical diagnosis, establish causality, or prescribe medication.
        Share this summary with your qualified healthcare provider for informed clinical consultations.
      </Alert>

      {/* Error Alert */}
      {errorMessage && (
        <Alert variant="emergency" title="Summary Consolidation Error">
          {errorMessage}
        </Alert>
      )}

      {loading && !summary && (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">
            Consolidating multi-module session brief...
          </p>
        </div>
      )}

      {summary && (
        <div className="space-y-8">
          {/* Executive Brief Header & Download */}
          <ExecutiveBriefHeader
            summaryId={summary.summary_id}
            generatedAt={summary.generated_at}
            highestAcuity={summary.highest_acuity}
            pdfExportUrl={summary.pdf_export_url}
          />

          {/* Cross-Module Synthesized Observations */}
          <CrossModuleInsights insights={summary.cross_module_insights} />

          {/* Module-by-Module Audit Trail Accordion */}
          <ModuleFindingsAccordion
            module01={summary.module_01_report}
            module02={summary.module_02_idrs}
            module03={summary.module_03_triage}
            module04={summary.module_04_medications}
          />

          {/* Final Legal & Clinical Safety Disclaimer */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 leading-relaxed space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Mandatory Decision-Support Boundary Notice</span>
            </div>
            <p>{summary.mandatory_safety_disclaimer}</p>
          </div>
        </div>
      )}
    </div>
  );
};
