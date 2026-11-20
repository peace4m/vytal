import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiClient } from '@/services/api';

export const IDRSPage: React.FC = () => {
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waist, setWaist] = useState<number>(92);
  const [activity, setActivity] = useState<'vigorous' | 'moderate' | 'sedentary'>('moderate');
  const [familyHistory, setFamilyHistory] = useState<'none' | 'one_parent' | 'both_parents'>('one_parent');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient<any>('/idrs/calculate', {
        method: 'POST',
        body: JSON.stringify({
          age,
          gender,
          waist_circumference_cm: waist,
          physical_activity_tier: activity,
          family_history_tier: familyHistory,
        }),
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Calculation error');
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
              MODULE 02
            </span>
            <Badge variant="normal">API Connected</Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Indian Diabetes Risk Score (IDRS)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Published screening tool by Dr. V. Mohan et al. (JAPI 2005; 53:759–63).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scoring Parameters</CardTitle>
            <CardDescription className="text-xs">
              Enter the exact 4 parameters defined in the original peer-reviewed publication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input
                label="Age (years)"
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={gender === 'male' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setGender('male')}
                >
                  Male
                </Button>
                <Button
                  type="button"
                  variant={gender === 'female' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setGender('female')}
                >
                  Female
                </Button>
              </div>
            </div>

            <div>
              <Input
                label="Waist Circumference (cm)"
                type="number"
                step="0.5"
                min={30}
                max={200}
                value={waist}
                onChange={(e) => setWaist(parseFloat(e.target.value) || 0)}
                helperText="Measured midway between lowest rib and top of hip bone."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Physical Activity Tier</label>
              <select
                value={activity}
                onChange={(e: any) => setActivity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="vigorous">Regular Exercise AND Strenuous Manual Work (0 pts)</option>
                <option value="moderate">Regular Exercise OR Strenuous Manual Work (20 pts)</option>
                <option value="sedentary">No Exercise AND Sedentary Occupational Work (30 pts)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Family History of Diabetes</label>
              <select
                value={familyHistory}
                onChange={(e: any) => setFamilyHistory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="none">No Family History / Neither Parent (0 pts)</option>
                <option value="one_parent">One Parent Diagnosed (10 pts)</option>
                <option value="both_parents">Both Parents Diagnosed (20 pts)</option>
              </select>
            </div>

            <Button onClick={handleCalculate} isLoading={loading} fullWidth className="mt-2">
              Calculate IDRS Score
            </Button>
            {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className={result ? 'border-teal-300 shadow-md' : 'border-slate-200'}>
          <CardHeader>
            <CardTitle className="text-base">IDRS Assessment Result</CardTitle>
            <CardDescription className="text-xs">
              Score breakdown and statistical risk tier.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Score</span>
                  <div className="text-5xl font-black text-slate-900 mt-1">
                    {result.total_score}<span className="text-2xl text-slate-400 font-normal">/100</span>
                  </div>
                  <div className="mt-2">
                    <Badge
                      variant={result.risk_category === 'high' ? 'high' : result.risk_category === 'moderate' ? 'warning' : 'normal'}
                      size="md"
                    >
                      {result.clinical_context.risk_label}
                    </Badge>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-2">
                  <p><strong>Interpretation:</strong> {result.clinical_context.interpretation}</p>
                  <p><strong>Sensitivity:</strong> {result.clinical_context.sensitivity} | <strong>Specificity:</strong> {result.clinical_context.specificity}</p>
                  <p className="text-slate-500 text-[11px] pt-2 border-t border-slate-100">
                    {result.clinical_context.bibliographic_citation}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Enter parameters on the left and click "Calculate IDRS Score" to evaluate.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
