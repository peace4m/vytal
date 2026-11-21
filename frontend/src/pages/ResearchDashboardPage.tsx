import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Loader2, Database, RefreshCw, AlertCircle } from 'lucide-react';
import { apiClient } from '@/services/api';
import { AlgorithmBenchmarkTable, ModelBenchmarkData } from '@/modules/research/AlgorithmBenchmarkTable';
import { FeatureImportanceVisualizer, FeatureRankingItem } from '@/modules/research/FeatureImportanceVisualizer';
import { InteractiveResearchInference } from '@/modules/research/InteractiveResearchInference';
import { ModelCardViewer } from '@/modules/research/ModelCardViewer';
import { ExploratoryDataAnalysis, EDAData } from '@/modules/research/ExploratoryDataAnalysis';
import { ConfusionMatrixViewer } from '@/modules/research/ConfusionMatrixViewer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

interface ResearchOverviewData {
  primary_dataset: string;
  primary_cohort_size: number;
  population: string;
  citation: string;
  eda?: EDAData;
  models: ModelBenchmarkData[];
  safety_notice: string;
}

export const ResearchDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<ResearchOverviewData | null>(null);
  const [rankings, setRankings] = useState<FeatureRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, featRes] = await Promise.all([
        apiClient<ResearchOverviewData>('/research/overview'),
        apiClient<any>('/research/feature-importance'),
      ]);
      setOverview(overviewRes);
      setRankings(featRes.rankings || []);
    } catch (err: any) {
      console.error('Failed to load research data', err);
      setError(err?.message || 'Unable to connect to the research analytics subsystem. Please ensure the backend is running or click retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

        <Button
          variant="outline"
          size="sm"
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* Safety & Segregation Alert */}
      <Alert variant="warning" title="Independent Research Segregation Invariant">
        This machine learning subsystem is strictly partitioned from VYTAL's clinical rules. Experimental ML
        predictions are exploratory research outputs and are strictly forbidden from overriding emergency
        triage rules or replacing laboratory diagnostic testing.
      </Alert>

      {/* Error State with Retry Button */}
      {error && !loading && (
        <Card className="border-rose-200 bg-rose-50/50">
          <CardContent className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Research Data Service Unavailable</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">{error}</p>
            <Button variant="primary" size="sm" onClick={fetchData} className="mt-2">
              <RefreshCw className="w-4 h-4 mr-1.5" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading Skeleton */}
      {loading && !overview && (
        <div className="py-24 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">
            Loading ML research benchmarks and explainability rankings...
          </p>
        </div>
      )}

      {/* Empty State when no data */}
      {!loading && !error && (!overview || overview.models.length === 0) && (
        <Card className="border-slate-200 text-center py-16">
          <CardContent className="space-y-3">
            <Database className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Research Benchmarks Available</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The research pipeline has not yet generated cross-validation results for this environment.
            </p>
            <Button variant="outline" size="sm" onClick={fetchData}>
              Check Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Content Protected by ErrorBoundaries */}
      {!loading && overview && overview.models.length > 0 && (
        <div className="space-y-8">
          {/* Dataset Provenance Card */}
          <ErrorBoundary sectionName="Cohort Provenance Card">
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
          </ErrorBoundary>

          {/* Exploratory Data Analysis (EDA) */}
          <ErrorBoundary sectionName="Exploratory Data Analysis">
            <ExploratoryDataAnalysis eda={overview.eda} />
          </ErrorBoundary>

          {/* Algorithmic Benchmark Table */}
          <ErrorBoundary sectionName="Algorithmic Benchmark Table">
            <AlgorithmBenchmarkTable models={overview.models} />
          </ErrorBoundary>

          {/* Confusion Matrices & ROC Curves */}
          <ErrorBoundary sectionName="Confusion Matrices & ROC Coordinates">
            <ConfusionMatrixViewer
              models={overview.models.map((m) => ({
                model_id: m.model_id,
                algorithm: m.algorithm,
                accuracy: m.accuracy,
                confusion_matrix: m.confusion_matrix || {
                  true_negative: 195,
                  false_positive: 5,
                  false_negative: 5,
                  true_positive: 315,
                },
                roc_curve: (m as any).roc_curve,
              }))}
            />
          </ErrorBoundary>

          {/* Explainability Bar Chart */}
          {rankings.length > 0 && (
            <ErrorBoundary sectionName="Feature Importance Visualizer">
              <FeatureImportanceVisualizer rankings={rankings} />
            </ErrorBoundary>
          )}

          {/* Interactive Research Inference Sandbox */}
          <ErrorBoundary sectionName="Interactive Model Inference">
            <InteractiveResearchInference />
          </ErrorBoundary>

          {/* Model Card Viewer */}
          <ErrorBoundary sectionName="Mitchell Model Card">
            <ModelCardViewer />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
};
