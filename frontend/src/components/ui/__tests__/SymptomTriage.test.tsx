import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmergencyOverrideBanner } from '@/modules/symptom-triage/EmergencyOverrideBanner';
import { TriageResultCard, TriageResultData } from '@/modules/symptom-triage/TriageResultCard';

describe('EmergencyOverrideBanner', () => {
  it('renders critical emergency callout and 108 / 112 phone links', () => {
    render(
      <EmergencyOverrideBanner
        actionText="SEEK IMMEDIATE EMERGENCY MEDICAL CARE (108 / 112)"
        safetyNetting="Rest quietly in comfortable seated position. Do not drive yourself."
        ruleNames={['Suspected Acute Coronary Syndrome (ACS) Red Flag']}
      />
    );

    expect(screen.getByText(/IMMEDIATE EMERGENCY ACTION REQUIRED/i)).toBeInTheDocument();
    expect(screen.getByText(/SEEK IMMEDIATE EMERGENCY MEDICAL CARE/i)).toBeInTheDocument();
    expect(screen.getByText(/Call National Ambulance \(108\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Call Emergency Response \(112\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Suspected Acute Coronary Syndrome/i)).toBeInTheDocument();
  });
});

describe('TriageResultCard', () => {
  it('renders clinical acuity, evidence citation and safety-netting advice', () => {
    const mockResult: TriageResultData = {
      triage_id: 'tri-12345678',
      primary_acuity: 'ROUTINE_CLINICAL',
      emergency_override_triggered: false,
      action_required: 'Schedule an elective outpatient consultation with your primary care physician.',
      triggered_rules: [
        {
          rule_id: 'RULE-ROUT-METAB-008',
          rule_name: 'Routine Primary Care Evaluation & Lifestyle Review',
          priority: 'ROUTINE',
          evidence_source: 'ICMR Guidelines for Management of Type 2 Diabetes (2018)',
          reason: 'Non-acute subacute symptoms reported without emergency red flags.',
        },
      ],
      safety_netting: 'MANDATORY SAFETY-NET: If symptoms worsen, seek emergency care.',
      uncertainty_notes: ['Onset speed was not provided; evaluated conservatively.'],
    };

    render(<TriageResultCard result={mockResult} />);

    expect(screen.getByText(/ROUTINE CLINICAL EVALUATION/i)).toBeInTheDocument();
    expect(screen.getByText(/Schedule an elective outpatient consultation/i)).toBeInTheDocument();
    expect(screen.getByText(/ICMR Guidelines for Management of Type 2 Diabetes/i)).toBeInTheDocument();
    expect(screen.getByText(/Onset speed was not provided/i)).toBeInTheDocument();
  });
});
