import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

export interface ManualEntryItem {
  analyte_name: string;
  observed_value: number;
  unit: string;
  lab_reference_range: string;
  status_flag: string;
}

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: ManualEntryItem) => void;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [analyteName, setAnalyteName] = useState('');
  const [observedValue, setObservedValue] = useState('');
  const [unit, setUnit] = useState('mg/dL');
  const [referenceRange, setReferenceRange] = useState('');
  const [statusFlag, setStatusFlag] = useState('NORMAL');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analyteName.trim()) {
      setError('Test name is required.');
      return;
    }
    const numVal = parseFloat(observedValue);
    if (isNaN(numVal)) {
      setError('Valid observed numeric value is required.');
      return;
    }

    onAdd({
      analyte_name: analyteName.trim(),
      observed_value: numVal,
      unit: unit.trim(),
      lab_reference_range: referenceRange.trim() || 'Not specified by lab',
      status_flag: statusFlag,
    });

    // Reset and close
    setAnalyteName('');
    setObservedValue('');
    setReferenceRange('');
    setStatusFlag('NORMAL');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manually Add Laboratory Test">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Test Analyte Name"
          placeholder="e.g. Fasting Blood Sugar, HbA1c, Creatinine"
          value={analyteName}
          onChange={(e) => setAnalyteName(e.target.value)}
          errorMessage={error && !analyteName ? error : undefined}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Observed Value"
            type="number"
            step="any"
            placeholder="e.g. 110"
            value={observedValue}
            onChange={(e) => setObservedValue(e.target.value)}
          />
          <Input
            label="Measurement Unit"
            placeholder="e.g. mg/dL, %, g/dL"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        <Input
          label="Laboratory Printed Reference Range"
          placeholder="e.g. 70 - 100 mg/dL (Leave blank if not on report)"
          value={referenceRange}
          onChange={(e) => setReferenceRange(e.target.value)}
          helperText="Do not guess a range. Enter exactly what is printed on your lab report."
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Report Status Flag
          </label>
          <select
            value={statusFlag}
            onChange={(e) => setStatusFlag(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          >
            <option value="NORMAL">Normal / Within Range</option>
            <option value="HIGH">High / Above Reference Range</option>
            <option value="LOW">Low / Below Reference Range</option>
            <option value="INDETERMINATE">Indeterminate / Reference Range Unknown</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add Test
          </Button>
        </div>
      </form>
    </Modal>
  );
};
