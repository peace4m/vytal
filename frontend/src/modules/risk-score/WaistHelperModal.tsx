import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Ruler, Check, HelpCircle } from 'lucide-react';

interface WaistHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCm: (cmValue: number) => void;
  currentCm: number;
}

export const WaistHelperModal: React.FC<WaistHelperModalProps> = ({
  isOpen,
  onClose,
  onApplyCm,
  currentCm,
}) => {
  const [inches, setInches] = useState<string>((currentCm / 2.54).toFixed(1));
  const [cm, setCm] = useState<string>(currentCm.toFixed(1));

  const handleInchesChange = (val: string) => {
    setInches(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setCm((num * 2.54).toFixed(1));
    }
  };

  const handleCmChange = (val: string) => {
    setCm(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setInches((num / 2.54).toFixed(1));
    }
  };

  const handleApply = () => {
    const numCm = parseFloat(cm);
    if (!isNaN(numCm)) {
      onApplyCm(numCm);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Measure Waist Circumference">
      <div className="space-y-4 text-xs text-slate-700">
        <div className="p-3 bg-teal-50 rounded-xl border border-teal-200/80 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-teal-900">
            <Ruler className="w-4 h-4 text-teal-700 shrink-0" />
            <span>WHO & CURES Measurement Guidelines</span>
          </div>
          <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-teal-950">
            <li>Stand upright with feet together and relax your abdominal muscles.</li>
            <li>Locate the measurement landmark: <strong>midway between the bottom of your lowest rib and the top of your hip bone (iliac crest)</strong>.</li>
            <li>Do not measure around your belt line or trousers waistline, as these are typically lower than anatomical waist circumference.</li>
            <li>Wrap a flexible tape measure snugly around the body without compressing the skin.</li>
            <li>Breathe out gently and take the measurement at the end of normal exhalation.</li>
          </ol>
        </div>

        {/* Live Inches to Centimeters Converter */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Inches to Centimeters Live Calculator</span>
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Measurement in Inches"
              type="number"
              step="0.1"
              value={inches}
              onChange={(e) => handleInchesChange(e.target.value)}
            />
            <Input
              label="Measurement in Centimeters"
              type="number"
              step="0.1"
              value={cm}
              onChange={(e) => handleCmChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleApply}>
            <Check className="w-4 h-4 mr-1" />
            Apply {cm} cm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
