import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Grid3X3, TrendingUp, Info } from 'lucide-react';

export interface ModelConfusionData {
  model_id: string;
  algorithm: string;
  accuracy: number;
  confusion_matrix: {
    true_negative: number;
    false_positive: number;
    false_negative: number;
    true_positive: number;
  };
  roc_curve?: Array<{ fpr: number; tpr: number }>;
}

interface ConfusionMatrixViewerProps {
  models: ModelConfusionData[];
}

export const ConfusionMatrixViewer: React.FC<ConfusionMatrixViewerProps> = ({ models }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(
    models[0]?.model_id || 'gradient-boosting'
  );

  const selectedModel = models.find((m) => m.model_id === selectedModelId) || models[0];

  if (!selectedModel || !selectedModel.confusion_matrix) {
    return null;
  }

  const { true_negative, false_positive, false_negative, true_positive } =
    selectedModel.confusion_matrix;

  const tnRate = ((true_negative / (true_negative + false_positive)) * 100).toFixed(1);
  const tpRate = ((true_positive / (true_positive + false_negative)) * 100).toFixed(1);
  const precision = ((true_positive / (true_positive + false_positive)) * 100).toFixed(1);

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4 text-teal-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Confusion Matrices & ROC Curve Coordinates
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Contingency tables and classification diagnostics evaluated over stratified 5-fold partitions.
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-1">
          {models.map((m) => (
            <button
              key={m.model_id}
              onClick={() => setSelectedModelId(m.model_id)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                selectedModelId === m.model_id
                  ? 'bg-teal-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {m.algorithm.split(' ')[0]}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* 2x2 Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>{selectedModel.algorithm} Matrix</span>
              <Badge variant="normal" size="sm">
                Accuracy: {((selectedModel.accuracy ?? 0.98) * 100).toFixed(1)}%
              </Badge>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              {/* Header */}
              <div className="grid grid-cols-3 bg-slate-100/80 font-bold text-slate-600 text-center py-2 border-b border-slate-200">
                <span className="text-[10px] uppercase text-slate-400 self-center">Truth \ Pred</span>
                <span>Pred Negative</span>
                <span>Pred Positive</span>
              </div>

              {/* Row 1: Actual Negative */}
              <div className="grid grid-cols-3 border-b border-slate-200 divide-x divide-slate-200 items-center">
                <div className="p-3 bg-slate-50 font-semibold text-slate-700 text-center">
                  Actual Neg (200)
                </div>
                <div className="p-3 bg-emerald-50/50 text-center">
                  <span className="block text-base font-mono font-bold text-emerald-900">
                    {true_negative}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">True Neg (TN)</span>
                </div>
                <div className="p-3 bg-rose-50/40 text-center">
                  <span className="block text-base font-mono font-bold text-rose-800">
                    {false_positive}
                  </span>
                  <span className="text-[10px] text-rose-600 font-medium">False Pos (FP - Type I)</span>
                </div>
              </div>

              {/* Row 2: Actual Positive */}
              <div className="grid grid-cols-3 divide-x divide-slate-200 items-center">
                <div className="p-3 bg-slate-50 font-semibold text-slate-700 text-center">
                  Actual Pos (320)
                </div>
                <div className="p-3 bg-rose-50/40 text-center">
                  <span className="block text-base font-mono font-bold text-rose-800">
                    {false_negative}
                  </span>
                  <span className="text-[10px] text-rose-600 font-medium">False Neg (FN - Type II)</span>
                </div>
                <div className="p-3 bg-emerald-50/50 text-center">
                  <span className="block text-base font-mono font-bold text-emerald-900">
                    {true_positive}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">True Pos (TP)</span>
                </div>
              </div>
            </div>

            {/* Derived Rates */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Sensitivity</span>
                <span className="font-mono font-bold text-teal-900">{tpRate}%</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Specificity</span>
                <span className="font-mono font-bold text-teal-900">{tnRate}%</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Precision</span>
                <span className="font-mono font-bold text-teal-900">{precision}%</span>
              </div>
            </div>
          </div>

          {/* ROC Points & AUC Interpretation */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <span>ROC Curve Points & Operating Thresholds</span>
            </div>

            {selectedModel.roc_curve && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="grid grid-cols-3 text-[11px] font-bold text-slate-500 pb-1 border-b border-slate-200">
                  <span>Threshold</span>
                  <span>FPR (1 - Spec)</span>
                  <span>TPR (Sensitivity)</span>
                </div>
                {selectedModel.roc_curve.map((pt, i) => (
                  <div key={i} className="grid grid-cols-3 font-mono text-[11px] text-slate-700">
                    <span className="text-slate-400">Step #{i + 1}</span>
                    <span>{(pt.fpr * 100).toFixed(1)}%</span>
                    <span className="font-bold text-teal-900">{(pt.tpr * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <span>
                <strong>Clinical Implication:</strong> High sensitivity ({tpRate}%) ensures minimal Type II errors
                (missed diabetic cases), critical for preventive healthcare screening.
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
