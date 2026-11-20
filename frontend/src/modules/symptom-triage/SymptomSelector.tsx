import React from 'react';
import { Heart, Brain, Wind, ShieldAlert, Zap, Thermometer, Droplets, Activity, Check } from 'lucide-react';

export interface SymptomItem {
  id: string;
  category: string;
  label: Record<string, string>;
  description: Record<string, string>;
  icon: string;
  red_flag_alert: boolean;
}

interface SymptomSelectorProps {
  symptoms: SymptomItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  lang: string;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Heart,
  Brain,
  Wind,
  ShieldAlert,
  Zap,
  Thermometer,
  Droplets,
  Activity,
};

export const SymptomSelector: React.FC<SymptomSelectorProps> = ({
  symptoms,
  selectedIds,
  onToggle,
  lang,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Step 1: Select Any Symptoms Experienced
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          {selectedIds.length} symptom{selectedIds.length === 1 ? '' : 's'} selected
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5">
        {symptoms.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const IconComp = ICON_MAP[item.icon] || Activity;
          const labelText = item.label[lang] || item.label['en'] || item.id;
          const descText = item.description[lang] || item.description['en'] || '';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/60 shadow-sm ring-1 ring-teal-600/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : item.red_flag_alert
                      ? 'bg-rose-50 text-rose-600 border border-rose-100'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="space-y-1 pr-6">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 text-sm leading-snug">
                      {labelText}
                    </span>
                    {item.red_flag_alert && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800">
                        High Priority
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {descText}
                  </p>
                </div>
              </div>

              {/* Checkmark Indicator */}
              <div
                className={`absolute top-3.5 right-3.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-teal-600 text-white'
                    : 'border border-slate-300 bg-white text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
