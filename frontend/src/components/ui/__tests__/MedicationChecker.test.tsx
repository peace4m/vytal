import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InteractionResultCard, InteractionItem } from '@/modules/medication-check/InteractionResultCard';
import { SafetyDisclaimerCallout } from '@/modules/medication-check/SafetyDisclaimerCallout';

describe('InteractionResultCard', () => {
  it('renders pair header, contraindicated badge, mechanism and evidence source', () => {
    const mockInteraction: InteractionItem = {
      drug_a: 'Metformin',
      drug_b: 'Iodinated Radiocontrast',
      severity: 'CONTRAINDICATED',
      clinical_description: 'Contrast-induced acute kidney injury risks lactic acidosis.',
      evidence_source: 'FDA Boxed Warning & ACR Contrast Manual',
      management_guidance: 'Withhold metformin prior to procedure and re-evaluate eGFR at 48 hours.',
    };

    render(<InteractionResultCard interaction={mockInteraction} />);

    expect(screen.getByText(/Metformin \+ Iodinated Radiocontrast/i)).toBeInTheDocument();
    expect(screen.getByText(/CONTRAINDICATED/i)).toBeInTheDocument();
    expect(screen.getByText(/Contrast-induced acute kidney injury/i)).toBeInTheDocument();
    expect(screen.getByText(/FDA Boxed Warning & ACR Contrast Manual/i)).toBeInTheDocument();
    expect(screen.getByText(/Withhold metformin prior to procedure/i)).toBeInTheDocument();
  });
});

describe('SafetyDisclaimerCallout', () => {
  it('renders mandatory negative finding disclaimer and prescription non-interference notice', () => {
    render(
      <SafetyDisclaimerCallout
        hasInteractions={false}
        mandatoryDisclaimer="No interaction was found in the available dataset. This does NOT establish that the combination is safe."
      />
    );

    expect(screen.getByText(/No Interaction Found in Available Dataset/i)).toBeInTheDocument();
    expect(
      screen.getByText(/This does NOT establish that the combination is safe/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Never stop, start, or alter the dosage of any prescribed medication/i)
    ).toBeInTheDocument();
  });
});
