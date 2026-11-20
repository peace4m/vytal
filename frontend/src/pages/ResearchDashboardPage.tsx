import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Loader2, Database } from 'lucide-react';
import { apiClient } from '@/services/api';
import { AlgorithmBenchmarkTable, ModelBenchmarkData } from '@/modules/research/AlgorithmBenchmarkTable';
import { FeatureImportanceVisualizer, FeatureRankingItem } from '@/modules/research/FeatureImportanceVisualizer';
import { InteractiveResearchInference } from '@/modules/research/InteractiveResearchInference';
import { ModelCardViewer } from '@/modules/research/ModelCardViewer';

interface ResearchOverviewData {
  primary_dataset: string;
  primary_cohort_size: number;
  population: string;
  citation: string;
  models: ModelBenchmarkData[];
  safety_notice: string;
}

export const ResearchDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<ResearchOverviewData | null>(null);
  const [rankings, setRankings] = useState<FeatureRankingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [overviewRes, featRes] = await Promise.all([
          apiClient<ResearchOverviewData>('/research/overview'),
          apiClient<any>('/research/feature-importance'),
        ]);
        setOverview(overviewRes);
        setRankings(featRes.rankings || []);
      } catch (err) {
        console.error('Failed to load research data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              INDEPENDENT ML SUBSYSTEM
            </span>
            <Badge variant="normal">Stratified 5-Fold Cross-Validation</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Machine Learning Research & Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Independent research pipeline evaluating 4 predictive algorithms, model explainability (XAI),
            and feature attributions on a South Asian outpatient diabetes cohort.
          </p>
        </div>
      </div>

      {/* Safety & Segregation Alert */}
      <Alert variant="warning" title="Independent Research Segregation Invariant">
        This machine learning subsystem is strictly partitioned from VYTAL's clinical rules. Experimental ML
        predictions are exploratory research outputs and are strictly forbidden from overriding emergency
        triage rules or replacing laboratory diagnostic testing.
      </Alert>

      {loading && !overview ? (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">
            Loading ML research benchmarks and explainability rankings...
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Dataset Provenance Card */}
          <Card className="border-slate-200 shadow-2xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-teal-600" />
                <CardTitle className="text-base font-bold text-slate-900">
                  Target Cohort Dataset Provenance
                </CardTitle>
              </div>
              <Badge variant="info">UCI Machine Learning Repository #529</Badge>
            </CardHeader>
            <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">
                  Target Population
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {overview?.population || 'South Asian (Sylhet, Bangladesh)'}
                </p>
                <p className="text-[11px] text-slate-500">
                  Sylhet Diabetes Hospital Outpatient Facility
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">
                  Cohort Dimension
                </span>
                <p className="font-bold text-slate-900 text-sm">
                  {overview?.primary_cohort_size || 520} Verified Clinical Instances
                </p>
                <p className="text-[11px] text-slate-500">
                  320 Positive (61.5%) / 200 Negative (38.5%)
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">
                  Evaluated Features
                </span>
                <p className="font-bold text-slate-900 text-sm">16 Clinical Signs & Symptoms</p>
                <p className="text-[11px] text-slate-500">
                  Age, Gender, Polyuria, Polydipsia, Weight Loss, etc.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Algorithmic Benchmark Table */}
          {overview && <AlgorithmBenchmarkTable models={overview.models} />}

          {/* Explainability Bar Chart */}
          {rankings.length > 0 && <FeatureImportanceVisualizer rankings={rankings} />}

          {/* Interactive Research Inference Sandbox */}
          <InteractiveResearchInference />

          {/* Model Card Viewer */}
          <ModelCardViewer />
        </div>
      )}
    </div>
  );
};
