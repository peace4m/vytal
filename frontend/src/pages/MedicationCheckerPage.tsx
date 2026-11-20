import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Pill, RotateCcw, ArrowRight, Zap } from 'lucide-react';
import { apiClient } from '@/services/api';
import { MedicationSearchAutocomplete } from '@/modules/medication-check/MedicationSearchAutocomplete';
import { SelectedMedicationChips, SelectedMedication } from '@/modules/medication-check/SelectedMedicationChips';
import { InteractionResultCard, InteractionItem } from '@/modules/medication-check/InteractionResultCard';
import { SafetyDisclaimerCallout } from '@/modules/medication-check/SafetyDisclaimerCallout';

interface MedicationCheckResponseData {
  check_id: string;
  total_medications: number;
  interaction_count: number;
  has_severe_warning: boolean;
  interactions: InteractionItem[];
  mandatory_disclaimer: string;
}

export const MedicationCheckerPage: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const [selectedMeds, setSelectedMeds] = useState<SelectedMedication[]>([
    { id: '1', name: 'Metformin', rxcui: '6809', drug_class: 'Biguanide' },
    { id: '2', name: 'Iodinated Radiocontrast', rxcui: '6038', drug_class: 'Diagnostic Agent' },
  ]);
  const [result, setResult] = useState<MedicationCheckResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddMedication = (med: SelectedMedication) => {
    if (!selectedMeds.some((m) => m.name.toLowerCase() === med.name.toLowerCase())) {
      setSelectedMeds((prev) => [...prev, med]);
      setResult(null);
    }
  };

  const handleRemoveMedication = (id: string) => {
    setSelectedMeds((prev) => prev.filter((m) => m.id !== id));
    setResult(null);
  };

  const handleClearAll = () => {
    setSelectedMeds([]);
    setResult(null);
    setErrorMessage(null);
  };

  const handlePresetExample = (drugA: string, drugB: string) => {
    setSelectedMeds([
      { id: 'ex-1', name: drugA },
      { id: 'ex-2', name: drugB },
    ]);
    setResult(null);
  };

  const handleCheck = async () => {
    if (selectedMeds.length < 2) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      const data = await apiClient<MedicationCheckResponseData>(
        `/medications/check?lang=${currentLang}`,
        {
          method: 'POST',
          body: JSON.stringify({
            medications: selectedMeds.map((m) => ({ name: m.name, rxcui: m.rxcui })),
          }),
        }
      );
      setResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to check medication interactions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              MODULE 04
            </span>
            <Badge variant="normal">RxNorm Normalization & Evidence Checks</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Medication Interaction Checker
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Evidence-backed pairwise drug interaction reviews with brand normalization, clinical
            mechanism descriptions, and mandatory safety notices.
          </p>
        </div>

        {selectedMeds.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll} className="self-start sm:self-auto text-slate-500">
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Reset Regimen
          </Button>
        )}
      </div>

      {/* Preset Quick Test Buttons */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-600 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Test Known Pairs:
        </span>
        <button
          type="button"
          onClick={() => handlePresetExample('Metformin', 'Iodinated Radiocontrast')}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 transition-colors text-slate-700 font-medium"
        >
          Metformin + Contrast
        </button>
        <button
          type="button"
          onClick={() => handlePresetExample('Aspirin', 'Warfarin')}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 transition-colors text-slate-700 font-medium"
        >
          Aspirin + Warfarin
        </button>
        <button
          type="button"
          onClick={() => handlePresetExample('Clopidogrel', 'Omeprazole')}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 transition-colors text-slate-700 font-medium"
        >
          Clopidogrel + Omeprazole
        </button>
        <button
          type="button"
          onClick={() => handlePresetExample('Metformin', 'Paracetamol')}
          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-700 transition-colors text-slate-700 font-medium"
        >
          Metformin + Paracetamol
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <Alert variant="emergency" title="Check Error">
          {errorMessage}
        </Alert>
      )}

      {/* Input Section */}
      <Card className="border-teal-200/80 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            <CardTitle className="text-lg">Build Medication Regimen</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Add two or more medications below. You can enter generic names or common Indian trade names.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <MedicationSearchAutocomplete
            onSelectMedication={handleAddMedication}
            alreadySelectedNames={selectedMeds.map((m) => m.name)}
          />

          <SelectedMedicationChips
            medications={selectedMeds}
            onRemove={handleRemoveMedication}
            onClear={handleClearAll}
          />

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {selectedMeds.length < 2
                ? 'Add at least 2 medications to check pairwise interactions.'
                : `${selectedMeds.length} medications selected. Ready for evaluation.`}
            </div>
            <Button
              onClick={handleCheck}
              disabled={selectedMeds.length < 2 || loading}
              isLoading={loading}
              size="lg"
              className="w-full sm:w-auto"
            >
              <span>Check Interactions</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results View */}
      {result && (
        <div className="space-y-6 pt-2">
          {/* Summary Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Evaluation Findings
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {result.interaction_count === 0
                  ? 'No Interactions Catalogued in Current Dataset'
                  : `${result.interaction_count} Potential Interaction(s) Identified`}
              </h3>
            </div>
            <Badge
              variant={
                result.has_severe_warning
                  ? 'emergency'
                  : result.interaction_count > 0
                  ? 'warning'
                  : 'normal'
              }
            >
              {result.has_severe_warning
                ? 'Severe Warning'
                : result.interaction_count > 0
                ? 'Moderate Interaction'
                : 'No Dataset Hits'}
            </Badge>
          </div>

          {/* Interactions List */}
          {result.interactions.length > 0 && (
            <div className="space-y-4">
              {result.interactions.map((interaction, idx) => (
                <InteractionResultCard key={idx} interaction={interaction} />
              ))}
            </div>
          )}

          {/* Mandatory Disclaimers */}
          <SafetyDisclaimerCallout
            mandatoryDisclaimer={result.mandatory_disclaimer}
            hasInteractions={result.interactions.length > 0}
          />
        </div>
      )}
    </div>
  );
};
