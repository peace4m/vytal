import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Alert } from '@/components/ui/Alert';
import { apiClient } from '@/services/api';

export const ResearchDashboardPage: React.FC = () => {
  const [researchData, setResearchData] = useState<any>(null);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const data = await apiClient<any>('/research/overview');
        setResearchData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResearch();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              RESEARCH SUBSYSTEM
            </span>
            <Badge variant="normal">Stratified 5-Fold CV</Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Machine Learning Research & Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Exploratory modeling and explainability pipeline decoupled from clinical decision logic.
          </p>
        </div>
      </div>

      <Alert variant="warning" title="Strict Decoupling Invariant">
        This research analytics environment is strictly decoupled from the five healthcare modules. Predictions from experimental ML algorithms are never used to make emergency triage decisions.
      </Alert>

      {/* Dataset Provenance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Target South Asian Cohort Provenance</CardTitle>
            <Badge variant="info">UCI Machine Learning Repository</Badge>
          </div>
          <CardDescription className="text-xs">
            Ground-truth training dataset: Early Stage Diabetes Risk Prediction (UCI ID: 529, Islam et al. 2020).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 font-medium">Population Cohort</span>
            <div className="font-semibold text-slate-900 mt-0.5">South Asian (Sylhet, Bangladesh)</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 font-medium">Sample Size</span>
            <div className="font-semibold text-slate-900 mt-0.5">520 Clinical Instances</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-400 font-medium">Feature Dimension</span>
            <div className="font-semibold text-slate-900 mt-0.5">16 Clinical Signs & Symptoms</div>
          </div>
        </CardContent>
      </Card>

      {/* Model Benchmark Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Algorithmic Benchmarks (Stratified 5-Fold Cross-Validation)</CardTitle>
          <CardDescription className="text-xs">
            Evaluated with zero data leakage: train/test split fixed at random seed 42.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {researchData ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Algorithm</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Precision</TableHead>
                  <TableHead>Recall (Sens)</TableHead>
                  <TableHead>F1-Score</TableHead>
                  <TableHead>ROC-AUC</TableHead>
                  <TableHead>Brier Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {researchData.models.map((m: any) => (
                  <TableRow key={m.model_id}>
                    <TableCell className="font-medium text-slate-900">{m.algorithm}</TableCell>
                    <TableCell>{(m.accuracy * 100).toFixed(1)}%</TableCell>
                    <TableCell>{(m.precision * 100).toFixed(1)}%</TableCell>
                    <TableCell className="font-bold text-teal-700">{(m.recall * 100).toFixed(1)}%</TableCell>
                    <TableCell>{m.f1_score.toFixed(3)}</TableCell>
                    <TableCell className="font-semibold text-emerald-700">{m.roc_auc.toFixed(3)}</TableCell>
                    <TableCell className="text-slate-500">{m.brier_score.toFixed(3)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">Loading benchmark models...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
