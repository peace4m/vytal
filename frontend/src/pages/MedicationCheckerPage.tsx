import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Pill, Plus, Trash2 } from 'lucide-react';
import { apiClient } from '@/services/api';

export const MedicationCheckerPage: React.FC = () => {
  const [selectedMeds, setSelectedMeds] = useState<string[]>(['Metformin', 'Iodinated Radiocontrast']);
  const [newMed, setNewMed] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const addMed = () => {
    if (newMed.trim() && !selectedMeds.includes(newMed.trim())) {
      setSelectedMeds([...selectedMeds, newMed.trim()]);
      setNewMed('');
    }
  };

  const removeMed = (med: string) => {
    setSelectedMeds(selectedMeds.filter((m) => m !== med));
  };

  const handleCheck = async () => {
    if (selectedMeds.length < 2) return;
    setLoading(true);
    try {
      const data = await apiClient<any>('/medications/check', {
        method: 'POST',
        body: JSON.stringify({
          medications: selectedMeds.map((name) => ({ name })),
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
              MODULE 04
            </span>
            <Badge variant="normal">API Connected</Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Medication Interaction Checker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            RxNorm concept normalization and evidence-backed pairwise interaction reviews.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Medication Cohort</CardTitle>
            <CardDescription className="text-xs">
              Add at least two medications to evaluate interactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g. Aspirin, Metformin, Warfarin"
                value={newMed}
                onChange={(e) => setNewMed(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addMed()}
              />
              <Button onClick={addMed} size="sm" variant="outline" className="shrink-0">
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-500">Selected Drugs:</span>
              <div className="flex flex-wrap gap-2">
                {selectedMeds.map((med) => (
                  <span
                    key={med}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium border border-slate-200"
                  >
                    <Pill className="w-3.5 h-3.5 text-teal-600" />
                    <span>{med}</span>
                    <button
                      onClick={() => removeMed(med)}
                      className="text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCheck}
              disabled={selectedMeds.length < 2}
              isLoading={loading}
              fullWidth
              className="mt-2"
            >
              Check Interactions ({selectedMeds.length} drugs)
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className={result?.has_severe_warning ? 'border-rose-300' : 'border-slate-200'}>
          <CardHeader>
            <CardTitle className="text-base">Interaction Results</CardTitle>
            <CardDescription className="text-xs">
              Evidence sources & clinical guidance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {result.interactions.length > 0 ? (
                  result.interactions.map((interaction: any, idx: number) => (
                    <div key={idx} className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-950">
                          {interaction.drug_a} + {interaction.drug_b}
                        </span>
                        <Badge variant="high" size="sm">{interaction.severity}</Badge>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{interaction.clinical_description}</p>
                      {interaction.management_guidance && (
                        <p className="text-teal-900 font-medium bg-white/70 p-2 rounded border border-teal-100">
                          <strong>Management:</strong> {interaction.management_guidance}
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400">Source: {interaction.evidence_source}</p>
                    </div>
                  ))
                ) : (
                  <Alert variant="info" title="No Documented Interaction Found">
                    No interaction was found between these medications in the curated dataset.
                  </Alert>
                )}

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-normal">
                  <strong>Mandatory Disclaimer:</strong> {result.mandatory_disclaimer}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs">
                Click "Check Interactions" to review pairwise findings.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
