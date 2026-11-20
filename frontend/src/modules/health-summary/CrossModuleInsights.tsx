import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Info, BookOpen } from 'lucide-react';

export interface CrossModuleInsightItem {
  category: string;
  severity: string;
  title: string;
  details: string;
  evidence_source?: string;
  boundary_notice?: string;
}

interface CrossModuleInsightsProps {
  insights: CrossModuleInsightItem[];
}

export const CrossModuleInsights: React.FC<CrossModuleInsightsProps> = ({ insights }) => {
  if (insights.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-teal-600" />
        <h3 className="text-lg font-bold text-slate-900">
          Cross-Module Synthesized Observations
        </h3>
      </div>

      <div className="space-y-3.5">
        {insights.map((item, idx) => {
          const isCritical = item.severity === 'CRITICAL';
          const isWarning = item.severity === 'WARNING';

          const badgeVariant = isCritical
            ? 'emergency'
            : isWarning
            ? 'warning'
            : 'info';

          return (
            <Card
              key={idx}
              className={`border-2 transition-all ${
                isCritical
                  ? 'border-rose-300 bg-rose-50/20 shadow-xs'
                  : isWarning
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                    {item.category}
                  </span>
                  <CardTitle className="text-base text-slate-900">{item.title}</CardTitle>
                </div>
                <Badge variant={badgeVariant}>{item.severity}</Badge>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-3 text-xs sm:text-sm">
                <p className="text-slate-700 leading-relaxed font-medium">{item.details}</p>

                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                  {item.evidence_source && (
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>
                        <strong className="text-slate-600">Source: </strong>
                        {item.evidence_source}
                      </span>
                    </div>
                  )}
                  {item.boundary_notice && (
                    <div className="flex items-center gap-1.5 italic text-slate-500">
                      <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{item.boundary_notice}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
