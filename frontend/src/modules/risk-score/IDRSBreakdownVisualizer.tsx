import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Info } from 'lucide-react';

export interface IDRSResultData {
  assessment_id: string;
  breakdown: {
    age_input: number;
    age_tier: string;
    age_points: number;
    gender: string;
    waist_circumference_cm: number;
    waist_tier: string;
    waist_points: number;
    physical_activity_tier: string;
    activity_description: string;
    activity_points: number;
    family_history_tier: string;
    family_history_description: string;
    family_history_points: number;
  };
  total_score: number;
  risk_category: 'low' | 'moderate' | 'high';
  clinical_context: {
    risk_label: string;
    interpretation: string;
    sensitivity: string;
    specificity: string;
    recommendation: string;
    bibliographic_citation: string;
  };
}

interface IDRSBreakdownVisualizerProps {
  data: IDRSResultData;
}

export const IDRSBreakdownVisualizer: React.FC<IDRSBreakdownVisualizerProps> = ({ data }) => {
  const { total_score, risk_category, breakdown, clinical_context } = data;

  const badgeVariant =
    risk_category === 'high' ? 'high' : risk_category === 'moderate' ? 'warning' : 'normal';

  const meterColor =
    risk_category === 'high'
      ? 'bg-rose-500'
      : risk_category === 'moderate'
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <div className="space-y-6">
      {/* Score Summary Dial Card */}
      <Card className="border-teal-200/80 shadow-sm overflow-hidden">
        <div className="p-6 bg-gradient-to-b from-slate-50 to-white text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Indian Diabetes Risk Score
          </span>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-6xl font-black text-slate-900 tracking-tight">{total_score}</span>
            <span className="text-2xl text-slate-400 font-semibold">/100</span>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full max-w-md mx-auto bg-slate-200 h-3 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full ${meterColor} transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(100, Math.max(0, total_score))}%` }}
            />
          </div>

          <div className="flex justify-between max-w-md mx-auto text-[10px] text-slate-400 font-medium px-1">
            <span>0 (Low)</span>
            <span>30 (Moderate)</span>
            <span>60 (High Cutoff)</span>
            <span>100</span>
          </div>

          <div className="pt-2">
            <Badge variant={badgeVariant} size="md">
              {clinical_context.risk_label}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Factor Breakdown Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Factor-by-Factor Points Contribution</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk Factor</TableHead>
                <TableHead>Your Value</TableHead>
                <TableHead>Classification Tier</TableHead>
                <TableHead className="text-right">Points Assigned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold text-slate-900">1. Age</TableCell>
                <TableCell>{breakdown.age_input} years</TableCell>
                <TableCell className="text-slate-500">{breakdown.age_tier}</TableCell>
                <TableCell className="text-right font-bold text-teal-700">+{breakdown.age_points}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-slate-900">2. Abdominal Obesity</TableCell>
                <TableCell>{breakdown.waist_circumference_cm} cm ({breakdown.gender})</TableCell>
                <TableCell className="text-slate-500">{breakdown.waist_tier}</TableCell>
                <TableCell className="text-right font-bold text-teal-700">+{breakdown.waist_points}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-slate-900">3. Physical Activity</TableCell>
                <TableCell className="capitalize">{breakdown.physical_activity_tier}</TableCell>
                <TableCell className="text-slate-500 text-xs">{breakdown.activity_description}</TableCell>
                <TableCell className="text-right font-bold text-teal-700">+{breakdown.activity_points}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-slate-900">4. Family History</TableCell>
                <TableCell className="capitalize">{breakdown.family_history_tier.replace('_', ' ')}</TableCell>
                <TableCell className="text-slate-500 text-xs">{breakdown.family_history_description}</TableCell>
                <TableCell className="text-right font-bold text-teal-700">+{breakdown.family_history_points}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Interpretation & Guidance */}
      <Card className="border-slate-200">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-base">Clinical Interpretation & Next Steps</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs leading-relaxed text-slate-700">
          <p><strong>Interpretation:</strong> {clinical_context.interpretation}</p>
          <p><strong>Recommendation:</strong> {clinical_context.recommendation}</p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium">Screening Sensitivity (Cut-off ≥ 60)</span>
              <div className="text-base font-bold text-teal-800">{clinical_context.sensitivity}</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Captures ~3 out of 4 undiagnosed diabetes cases.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium">Screening Specificity (Cut-off ≥ 60)</span>
              <div className="text-base font-bold text-teal-800">{clinical_context.specificity}</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Correctly filters out 60% of non-diabetic individuals.</p>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 pt-3 border-t border-slate-100">
            <strong>Source Citation:</strong> {clinical_context.bibliographic_citation}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
