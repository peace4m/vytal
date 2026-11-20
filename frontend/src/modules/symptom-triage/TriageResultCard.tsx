import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { BookOpen, Info, Stethoscope, Clock } from 'lucide-react';

export interface TriggeredRuleItem {
  rule_id: string;
  rule_name: string;
  priority: string;
  evidence_source: string;
  reason: string;
}

export interface TriageResultData {
  triage_id: string;
  primary_acuity: string;
  emergency_override_triggered: boolean;
  action_required: string;
  triggered_rules: TriggeredRuleItem[];
  safety_netting: string;
  uncertainty_notes: string[];
}

interface TriageResultCardProps {
  result: TriageResultData;
}

export const TriageResultCard: React.FC<TriageResultCardProps> = ({ result }) => {
  const {
    primary_acuity,
    emergency_override_triggered,
    action_required,
    triggered_rules,
    safety_netting,
    uncertainty_notes,
  } = result;

  const isEmergency = emergency_override_triggered || primary_acuity === 'EMERGENCY';
  const isHighAcuity = primary_acuity === 'HIGH_ACUITY';

  const badgeVariant = isEmergency
    ? 'emergency'
    : isHighAcuity
    ? 'high'
    : 'normal';

  const acuityLabel = isEmergency
    ? 'EMERGENCY RED FLAG'
    : isHighAcuity
    ? 'HIGH ACUITY (URGENT EVALUATION)'
    : 'ROUTINE CLINICAL EVALUATION';

  return (
    <div className="space-y-6">
      {/* Acuity Status & Action Card */}
      <Card
        className={`shadow-md border-2 ${
          isEmergency
            ? 'border-rose-400 bg-rose-50/30'
            : isHighAcuity
            ? 'border-amber-400 bg-amber-50/30'
            : 'border-teal-200 bg-white'
        }`}
      >
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg ${
                isEmergency
                  ? 'bg-rose-600 text-white'
                  : isHighAcuity
                  ? 'bg-amber-600 text-white'
                  : 'bg-teal-600 text-white'
              }`}
            >
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Determined Clinical Acuity
              </span>
              <div className="flex items-center gap-2">
                <Badge variant={badgeVariant}>{acuityLabel}</Badge>
              </div>
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400">
            ID: {result.triage_id.slice(0, 8)}
          </span>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Recommended Clinical Action
            </span>
            <p
              className={`text-base font-bold leading-relaxed ${
                isEmergency ? 'text-rose-950' : isHighAcuity ? 'text-amber-950' : 'text-slate-900'
              }`}
            >
              {action_required}
            </p>
          </div>

          {/* Safety Netting */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Mandatory Safety-Netting Advice</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{safety_netting}</p>
          </div>
        </CardContent>
      </Card>

      {/* Uncertainty Notice if applicable */}
      {uncertainty_notes.length > 0 && (
        <Alert variant="warning" title="Clinical Uncertainty / Missing Information Disclosed">
          <ul className="list-disc list-inside space-y-1 text-xs">
            {uncertainty_notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Triggered Decision Rules & Evidence Register */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-base">
              Triggered Clinical Rules & Evidence Audit Trail
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {triggered_rules.map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2.5 text-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="font-bold text-slate-900">{rule.rule_name}</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 w-fit">
                  {rule.rule_id}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">Clinical Logic: </span>
                {rule.reason}
              </p>

              <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-700">Source: </strong>
                  {rule.evidence_source}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
