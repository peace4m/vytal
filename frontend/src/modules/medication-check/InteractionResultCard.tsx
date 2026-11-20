import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, AlertOctagon, BookOpen, Stethoscope } from 'lucide-react';

export interface InteractionItem {
  drug_a: string;
  drug_b: string;
  severity: string;
  clinical_description: string;
  evidence_source: string;
  management_guidance?: string;
}

interface InteractionResultCardProps {
  interaction: InteractionItem;
}

export const InteractionResultCard: React.FC<InteractionResultCardProps> = ({ interaction }) => {
  const { drug_a, drug_b, severity, clinical_description, evidence_source, management_guidance } =
    interaction;

  const isContraindicated = severity === 'CONTRAINDICATED';
  const isSevere = severity === 'SEVERE';
  const isModerate = severity === 'MODERATE';

  const badgeVariant = isContraindicated
    ? 'emergency'
    : isSevere
    ? 'high'
    : isModerate
    ? 'warning'
    : 'normal';

  const borderClass = isContraindicated
    ? 'border-rose-400 bg-rose-50/20'
    : isSevere
    ? 'border-amber-400 bg-amber-50/20'
    : 'border-yellow-200 bg-white';

  return (
    <Card className={`border-2 shadow-xs transition-shadow hover:shadow-sm ${borderClass}`}>
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          {isContraindicated || isSevere ? (
            <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          )}
          <CardTitle className="text-base font-bold text-slate-900">
            {drug_a} + {drug_b}
          </CardTitle>
        </div>
        <Badge variant={badgeVariant}>{severity}</Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-4 text-sm">
        {/* Clinical Description */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Clinical Mechanism & Consequence
          </span>
          <p className="text-slate-800 leading-relaxed font-medium">
            {clinical_description}
          </p>
        </div>

        {/* Management Guidance if available */}
        {management_guidance && (
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-800">
              <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
              <span>Standard Clinical Management Guidance</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {management_guidance}
            </p>
          </div>
        )}

        {/* Evidence Source */}
        <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-xs text-slate-500">
          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-700">Evidence Source: </strong>
            {evidence_source}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
