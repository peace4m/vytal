import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';

interface SafetyDisclaimerCalloutProps {
  mandatoryDisclaimer?: string;
  hasInteractions: boolean;
}

export const SafetyDisclaimerCallout: React.FC<SafetyDisclaimerCalloutProps> = ({
  mandatoryDisclaimer,
  hasInteractions,
}) => {
  return (
    <div className="space-y-4">
      {/* If No Interactions Detected -> Mandatory Negative Finding Callout */}
      {!hasInteractions && (
        <Alert variant="warning" title="No Interaction Found in Available Dataset">
          <p className="text-xs sm:text-sm leading-relaxed">
            {mandatoryDisclaimer ||
              'No interaction was found in the available dataset for the queried combination. This does NOT establish that the combination is safe. Many dietary supplements, herbal compounds, over-the-counter remedies, and specialized formulations may have interactions that are not catalogued in this educational database. Always verify medication safety with your prescribing physician or pharmacist.'}
          </p>
        </Alert>
      )}

      {/* Mandatory Prescription Non-Interference Clause (Always Visible) */}
      <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 text-amber-950 text-xs sm:text-sm space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>IMPORTANT CLINICAL SAFETY NOTICE</span>
        </div>
        <p className="leading-relaxed text-amber-900/90 text-xs">
          <strong>Never stop, start, or alter the dosage of any prescribed medication</strong> based on
          information from this tool. Doing so without direct medical supervision can lead to severe
          adverse health consequences or death. Discuss all concerns directly with your prescribing physician or clinical pharmacist.
        </p>
      </div>
    </div>
  );
};
