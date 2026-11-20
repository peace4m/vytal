import React from 'react';
import { Pill, X, Trash2 } from 'lucide-react';

export interface SelectedMedication {
  id: string;
  name: string;
  rxcui?: string;
  drug_class?: string;
}

interface SelectedMedicationChipsProps {
  medications: SelectedMedication[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const SelectedMedicationChips: React.FC<SelectedMedicationChipsProps> = ({
  medications,
  onRemove,
  onClear,
}) => {
  if (medications.length === 0) {
    return (
      <div className="p-5 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-1 bg-slate-50/50">
        <Pill className="w-6 h-6 text-slate-300 mx-auto mb-1" />
        <p className="text-sm font-semibold text-slate-600">No medications selected yet</p>
        <p className="text-xs text-slate-400">
          Search and add at least two medications to check for potential interactions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Active Medication Regimen ({medications.length})</span>
        {medications.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {medications.map((med) => (
          <div
            key={med.id}
            className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-teal-200 bg-teal-50/80 text-teal-950 text-xs font-medium shadow-2xs"
          >
            <Pill className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold">{med.name}</span>
              {med.drug_class && (
                <span className="text-[10px] text-teal-700 leading-tight">
                  {med.drug_class}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemove(med.id)}
              className="p-1 rounded-md text-teal-700 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
              aria-label={`Remove ${med.name}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
