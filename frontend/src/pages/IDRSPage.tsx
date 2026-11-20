import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Ruler, Activity } from 'lucide-react';
import { apiClient } from '@/services/api';
import { WaistHelperModal } from '@/modules/risk-score/WaistHelperModal';
import { IDRSBreakdownVisualizer, IDRSResultData } from '@/modules/risk-score/IDRSBreakdownVisualizer';

export const IDRSPage: React.FC = () => {
  const { i18n } = useTranslation();

  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waist, setWaist] = useState<number>(92);
  const [activity, setActivity] = useState<'vigorous' | 'moderate' | 'sedentary'>('moderate');
  const [familyHistory, setFamilyHistory] = useState<'none' | 'one_parent' | 'both_parents'>('one_parent');

  const [isWaistHelperOpen, setIsWaistHelperOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IDRSResultData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCalculate = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const currentLang = i18n.language || 'en';
      const data = await apiClient<IDRSResultData>(`/idrs/calculate?lang=${currentLang}`, {
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
      setErrorMessage(err.message || 'Calculation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
              MODULE 02
            </span>
            <Badge variant="normal">CURES 2005 Methodology</Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Indian Diabetes Risk Score (IDRS)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent, validated screening calculator by Dr. V. Mohan et al. (JAPI 2005; 53:759–763).
          </p>
        </div>
      </div>

      <Alert variant="info" title="Educational Screening Tool">
        The Indian Diabetes Risk Score is a population screening tool, not a diagnostic test. A score ≥ 60 identifies elevated risk and warrants diagnostic blood glucose testing in consultation with a physician.
      </Alert>

      {errorMessage && (
        <Alert variant="warning" title="Validation Notice">
          {errorMessage}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Input Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scoring Parameters</CardTitle>
            <CardDescription className="text-xs">
              Enter the exact four risk factors required by the published scoring methodology.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Factor 1: Age */}
            <div>
              <Input
                label="1. Age (completed years)"
                type="number"
                min={1}
                max={120}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                helperText="< 35 yrs: 0 pts | 35–49 yrs: 20 pts | ≥ 50 yrs: 30 pts"
              />
            </div>

            {/* Factor 2: Gender & Waist Circumference */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Biological Sex (for waist threshold stratification)
              </label>
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">
                  2. Waist Circumference (cm)
                </label>
                <button
                  type="button"
                  onClick={() => setIsWaistHelperOpen(true)}
                  className="text-xs text-teal-700 hover:text-teal-800 font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>How to measure / Inches converter</span>
                </button>
              </div>
              <Input
                type="number"
                step="0.1"
                min={30}
                max={250}
                value={waist}
                onChange={(e) => setWaist(parseFloat(e.target.value) || 0)}
                helperText={
                  gender === 'female'
                    ? '< 80 cm: 0 pts | 80–89 cm: 10 pts | ≥ 90 cm: 20 pts'
                    : '< 90 cm: 0 pts | 90–99 cm: 10 pts | ≥ 100 cm: 20 pts'
                }
              />
            </div>

            {/* Factor 3: Physical Activity */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                3. Physical Activity Level
              </label>
              <select
                value={activity}
                onChange={(e: any) => setActivity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
              >
                <option value="vigorous">Regular Exercise AND Strenuous Manual Work (0 pts)</option>
                <option value="moderate">Regular Exercise OR Strenuous Manual Work (20 pts)</option>
                <option value="sedentary">No Exercise AND Sedentary Occupational Work (30 pts)</option>
              </select>
            </div>

            {/* Factor 4: Family History */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                4. Family History of Diabetes
              </label>
              <select
                value={familyHistory}
                onChange={(e: any) => setFamilyHistory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
              >
                <option value="none">No Family History / Neither Parent Diagnosed (0 pts)</option>
                <option value="one_parent">One Parent Diagnosed with Diabetes (10 pts)</option>
                <option value="both_parents">Both Parents Diagnosed with Diabetes (20 pts)</option>
              </select>
            </div>

            <Button
              onClick={handleCalculate}
              isLoading={loading}
              fullWidth
              size="md"
              className="mt-2"
            >
              Calculate IDRS Score
            </Button>
          </CardContent>
        </Card>

        {/* Results Visualizer */}
        {result ? (
          <IDRSBreakdownVisualizer data={result} />
        ) : (
          <Card className="border-dashed border-slate-200">
            <CardContent className="text-center py-16 space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Activity className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-slate-700">Awaiting Calculation</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Enter your age, waist measurement, activity tier, and family history to calculate your score.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Waist Helper Modal */}
      <WaistHelperModal
        isOpen={isWaistHelperOpen}
        onClose={() => setIsWaistHelperOpen(false)}
        onApplyCm={(val) => setWaist(val)}
        currentCm={waist}
      />
    </div>
  );
};
