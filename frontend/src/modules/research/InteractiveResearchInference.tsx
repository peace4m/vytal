import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Play, Loader2, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { apiClient } from '@/services/api';

interface AttributionItem {
  feature: string;
  raw_value: number;
  contribution_score: number;
  effect_direction: string;
}

interface PredictResultData {
  model_used: string;
  predicted_probability: number;
  predicted_risk_tier: string;
  top_contributing_factors: AttributionItem[];
  experimental_disclaimer: string;
}

export const InteractiveResearchInference: React.FC = () => {
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [polyuria, setPolyuria] = useState<'Yes' | 'No'>('No');
  const [polydipsia, setPolydipsia] = useState<'Yes' | 'No'>('No');
  const [weightLoss, setWeightLoss] = useState<'Yes' | 'No'>('No');
  const [weakness, setWeakness] = useState<'Yes' | 'No'>('No');
  const [polyphagia, setPolyphagia] = useState<'Yes' | 'No'>('No');
  const [visualBlurring, setVisualBlurring] = useState<'Yes' | 'No'>('No');

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictResultData | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const data = await apiClient<PredictResultData>('/research/predict', {
        method: 'POST',
        body: JSON.stringify({
          Age: age,
          Gender: gender,
          Polyuria: polyuria,
          Polydipsia: polydipsia,
          sudden_weight_loss: weightLoss,
          weakness: weakness,
          Polyphagia: polyphagia,
          visual_blurring: visualBlurring,
        }),
      });
      setPrediction(data);
    } catch (err) {
      console.error('Inference error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-teal-200/80 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Interactive Model Inference & Local Attribution (XAI)
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Test experimental inference and inspect real-time feature attributions.
          </CardDescription>
        </div>
        <Badge variant="warning" size="sm">Experimental Sandbox</Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Input Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Age */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Age (Years)</label>
            <input
              type="number"
              min={18}
              max={90}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Polyuria */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Polyuria (Frequent Urine)</label>
            <select
              value={polyuria}
              onChange={(e) => setPolyuria(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Polydipsia */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Polydipsia (Severe Thirst)</label>
            <select
              value={polydipsia}
              onChange={(e) => setPolydipsia(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Weight Loss */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Sudden Weight Loss</label>
            <select
              value={weightLoss}
              onChange={(e) => setWeightLoss(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Weakness */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Weakness</label>
            <select
              value={weakness}
              onChange={(e) => setWeakness(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Polyphagia */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Polyphagia (Excess Hunger)</label>
            <select
              value={polyphagia}
              onChange={(e) => setPolyphagia(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Blurring */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Visual Blurring</label>
            <select
              value={visualBlurring}
              onChange={(e) => setVisualBlurring(e.target.value as any)}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm bg-white"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handlePredict}
          disabled={loading}
          variant="primary"
          className="w-full sm:w-auto"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Run Research Inference
        </Button>

        {/* Prediction Output & Attribution Breakdown */}
        {prediction && (
          <div className="pt-4 border-t border-slate-200/80 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400">
                  Model Estimated Probability
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-slate-900 font-mono">
                    {(prediction.predicted_probability * 100).toFixed(1)}%
                  </span>
                  <Badge
                    variant={
                      prediction.predicted_risk_tier === 'HIGH'
                        ? 'high'
                        : prediction.predicted_risk_tier === 'MODERATE'
                        ? 'warning'
                        : 'normal'
                    }
                  >
                    {prediction.predicted_risk_tier} RISK TIER
                  </Badge>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-mono">
                Architecture: {prediction.model_used}
              </div>
            </div>

            {/* Local Feature Attribution */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase">
                Top Local Attribution Factors (Why Model Produced This Probability):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {prediction.top_contributing_factors.map((item) => (
                  <div
                    key={item.feature}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-800">{item.feature}</span>
                    <span
                      className={`font-mono font-bold flex items-center gap-0.5 ${
                        item.effect_direction === 'RISK_INCREASING'
                          ? 'text-rose-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {item.effect_direction === 'RISK_INCREASING' ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      {item.contribution_score > 0 ? `+${item.contribution_score}` : item.contribution_score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Research Boundary Disclaimer */}
            <Alert variant="warning" title="Experimental Research Boundary Notice">
              {prediction.experimental_disclaimer}
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
