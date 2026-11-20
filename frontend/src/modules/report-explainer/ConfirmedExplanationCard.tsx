import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Info } from 'lucide-react';

export interface ExplanationItem {
  analyte_name: string;
  observed_value_str: string;
  status: string;
  explanation: string;
  safety_note: string;
}

interface ConfirmedExplanationCardProps {
  explanations: ExplanationItem[];
}

export const ConfirmedExplanationCard: React.FC<ConfirmedExplanationCardProps> = ({
  explanations,
}) => {
  return (
    <div className="space-y-6">
      <Alert variant="info" title="User-Confirmed Laboratory Findings">
        The explanations below reflect the laboratory test results you confirmed. These plain-language explanations are educational and intended to prepare you for informed discussions with your doctor.
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {explanations.map((exp, idx) => {
          const isHigh = exp.status === 'HIGH';
          const isLow = exp.status === 'LOW';

          return (
            <Card
              key={idx}
              className={
                isHigh
                  ? 'border-amber-200/80 bg-amber-50/10'
                  : isLow
                  ? 'border-blue-200/80 bg-blue-50/10'
                  : 'border-slate-200'
              }
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Confirmed Biomarker
                  </span>
                  <Badge
                    variant={isHigh ? 'warning' : isLow ? 'info' : 'normal'}
                    size="sm"
                  >
                    {exp.status}
                  </Badge>
                </div>
                <CardTitle className="text-base text-slate-900 mt-1">
                  {exp.analyte_name}
                </CardTitle>
                <div className="text-sm font-semibold text-teal-800">
                  Observed Value: {exp.observed_value_str}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs leading-relaxed text-slate-700">
                <p>{exp.explanation}</p>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{exp.safety_note}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
