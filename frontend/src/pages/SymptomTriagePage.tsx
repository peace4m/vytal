import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { apiClient } from '@/services/api';

export const SymptomTriagePage: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const symptomOptions = [
    { key: 'chest_pain', label: 'Chest Pain or Discomfort' },
    { key: 'shortness_of_breath', label: 'Shortness of Breath / Dyspnea' },
    { key: 'facial_droop', label: 'Facial Drooping (Sudden onset)' },
    { key: 'arm_weakness', label: 'Arm or Leg Weakness (Sudden)' },
    { key: 'speech_difficulty', label: 'Difficulty Speaking or Understanding' },
    { key: 'stridor', label: 'High-pitched Wheeze / Stridor at Rest' },
    { key: 'mild_fatigue', label: 'Mild Fatigue / General Tiredness' },
  ];

  const toggleSymptom = (key: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleEvaluate = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    try {
      const data = await apiClient<any>('/triage/evaluate', {
        method: 'POST',
        body: JSON.stringify({
          primary_symptoms: selectedSymptoms,
          symptom_attributes: {
            chest_pain_nature: selectedSymptoms.includes('chest_pain') ? 'crushing_pressure' : '',
            radiates_to_jaw_or_left_arm: selectedSymptoms.includes('chest_pain'),
          },
        }),
      });
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
              MODULE 03
            </span>
            <Badge variant="normal">Deterministic Rules Ready</Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Symptom Triage & Red-Flag Guidance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deterministic rule engine. Life-threatening emergency red flags evaluate first and strictly override.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reported Symptoms</CardTitle>
            <CardDescription className="text-xs">
              Select symptoms you or the individual are currently experiencing:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {symptomOptions.map((opt) => {
              const isChecked = selectedSymptoms.includes(opt.key);
              return (
                <div
                  key={opt.key}
                  onClick={() => toggleSymptom(opt.key)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    isChecked
                      ? 'border-teal-500 bg-teal-50/50 text-teal-900 font-medium'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <span>{opt.label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer"
                  />
                </div>
              );
            })}

            <Button
              onClick={handleEvaluate}
              disabled={selectedSymptoms.length === 0}
              isLoading={loading}
              fullWidth
              className="mt-4"
            >
              Evaluate Triage Rules
            </Button>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card className={result?.emergency_override_triggered ? 'border-rose-300' : 'border-slate-200'}>
          <CardHeader>
            <CardTitle className="text-base">Triage Recommendation</CardTitle>
            <CardDescription className="text-xs">
              Transparent, audited rule executions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {result.emergency_override_triggered ? (
                  <Alert variant="emergency" title={result.action_required}>
                    {result.safety_netting}
                  </Alert>
                ) : (
                  <Alert variant="info" title="Routine Clinical Care">
                    {result.action_required}
                  </Alert>
                )}

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-700">Triggered Clinical Rules:</span>
                  {result.triggered_rules.map((rule: any) => (
                    <div key={rule.rule_id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-900">{rule.rule_name}</span>
                        <Badge variant={rule.priority === 'EMERGENCY_RED_FLAG' ? 'high' : 'neutral'} size="sm">
                          {rule.priority}
                        </Badge>
                      </div>
                      <p className="text-slate-600 text-[11px] mb-1">{rule.reason}</p>
                      <p className="text-slate-400 text-[10px]">Evidence: {rule.evidence_source}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Select symptoms on the left to evaluate deterministic triage guidelines.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
