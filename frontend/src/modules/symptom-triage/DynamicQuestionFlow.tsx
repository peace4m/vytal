import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { HelpCircle } from 'lucide-react';

export interface FollowUpQuestion {
  id: string;
  type: 'single_choice' | 'boolean';
  prompt: Record<string, string>;
  options?: Array<{
    value: string;
    label: Record<string, string>;
    risk_weight?: string;
  }>;
}

interface DynamicQuestionFlowProps {
  selectedSymptomIds: string[];
  adaptiveFollowUps: Record<string, FollowUpQuestion[]>;
  attributes: Record<string, any>;
  onAttributeChange: (key: string, value: any) => void;
  lang: string;
}

export const DynamicQuestionFlow: React.FC<DynamicQuestionFlowProps> = ({
  selectedSymptomIds,
  adaptiveFollowUps,
  attributes,
  onAttributeChange,
  lang,
}) => {
  // Filter questions for currently selected symptoms
  const relevantSections = selectedSymptomIds
    .filter((id) => adaptiveFollowUps[id] && adaptiveFollowUps[id].length > 0)
    .map((id) => ({
      symptomId: id,
      questions: adaptiveFollowUps[id],
    }));

  if (relevantSections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-slate-900">
          Step 2: Specific Follow-up Clinical Questions
        </h3>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
          Contextual Clarification
        </span>
      </div>

      <div className="space-y-4">
        {relevantSections.map((sec) => (
          <Card key={sec.symptomId} className="border-teal-100 bg-slate-50/50">
            <CardContent className="p-4 sm:p-5 space-y-4">
              {sec.questions.map((q) => {
                const promptText = q.prompt[lang] || q.prompt['en'] || q.id;

                if (q.type === 'single_choice' && q.options) {
                  return (
                    <div key={q.id} className="space-y-2">
                      <label className="block text-sm font-semibold text-slate-800">
                        {promptText}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt) => {
                          const isSelected = attributes[q.id] === opt.value;
                          const optLabel = opt.label[lang] || opt.label['en'] || opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => onAttributeChange(q.id, opt.value)}
                              className={`text-left p-3 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${
                                isSelected
                                  ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold'
                                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              {optLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                if (q.type === 'boolean') {
                  const currentValue = attributes[q.id];
                  return (
                    <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60 first:border-0 first:pt-0">
                      <div className="text-sm font-medium text-slate-800 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>{promptText}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => onAttributeChange(q.id, true)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            currentValue === true
                              ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => onAttributeChange(q.id, false)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            currentValue === false
                              ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
