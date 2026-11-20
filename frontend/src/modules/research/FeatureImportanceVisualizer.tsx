import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BarChart3, Info } from 'lucide-react';

export interface FeatureRankingItem {
  feature: string;
  raw_importance: number;
  relative_percentage: number;
}

interface FeatureImportanceVisualizerProps {
  rankings: FeatureRankingItem[];
}

export const FeatureImportanceVisualizer: React.FC<FeatureImportanceVisualizerProps> = ({
  rankings,
}) => {
  const top10 = rankings.slice(0, 10);
  const maxPct = top10.length > 0 ? top10[0].relative_percentage : 1;

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <CardTitle className="text-base font-bold text-slate-900">
              Global Feature Importance (Gini Impurity Ranking)
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Derived from 100-tree Random Forest ensemble on the 520-instance South Asian cohort.
          </CardDescription>
        </div>
        <Badge variant="info" size="sm">Explainable AI (XAI)</Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-3.5">
        <div className="space-y-2.5">
          {top10.map((item, idx) => {
            const barWidth = `${Math.min(100, Math.round((item.relative_percentage / maxPct) * 100))}%`;
            const isTopTier = idx < 2;

            return (
              <div key={item.feature} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-medium text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono text-slate-400 text-[10px]">#{idx + 1}</span>
                    <strong className={isTopTier ? 'text-teal-950 font-bold' : 'text-slate-800'}>
                      {item.feature}
                    </strong>
                  </span>
                  <span className="font-mono text-slate-500">
                    {item.relative_percentage.toFixed(1)}% (score: {item.raw_importance.toFixed(3)})
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isTopTier ? 'bg-teal-600' : 'bg-slate-400'
                    }`}
                    style={{ width: barWidth }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <span>
            <strong>Pathophysiological Concordance:</strong> The heavy weighting of Polyuria (excessive urination)
            and Polydipsia (excessive thirst) mirrors classical osmotic diuresis caused by plasma glucose exceeding the renal threshold (~180 mg/dL).
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
