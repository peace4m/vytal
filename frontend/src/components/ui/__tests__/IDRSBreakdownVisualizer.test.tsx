import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IDRSBreakdownVisualizer, IDRSResultData } from '@/modules/risk-score/IDRSBreakdownVisualizer';

const sampleResult: IDRSResultData = {
  assessment_id: 'sample-uuid',
  breakdown: {
    age_input: 45,
    age_tier: '35-49 years',
    age_points: 20,
    gender: 'male',
    waist_circumference_cm: 95.0,
    waist_tier: '90-99 cm',
    waist_points: 10,
    physical_activity_tier: 'moderate',
    activity_description: 'Regular exercise OR strenuous work',
    activity_points: 20,
    family_history_tier: 'one_parent',
    family_history_description: 'One parent diagnosed with diabetes',
    family_history_points: 10,
  },
  total_score: 60,
  risk_category: 'high',
  clinical_context: {
    risk_label: 'High Risk (Score >= 60)',
    interpretation: 'High probability of undiagnosed diabetes.',
    sensitivity: '72.5%',
    specificity: '60.1%',
    recommendation: 'Consult a physician for definitive blood glucose testing.',
    bibliographic_citation: 'Mohan V, Deepa R, Deepa M, Somannavar S, Datta M. J Assoc Physicians India. 2005 Sep;53:759-63.',
  },
};

describe('IDRSBreakdownVisualizer Component', () => {
  it('renders total score dial', () => {
    render(<IDRSBreakdownVisualizer data={sampleResult} />);
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByText('/100')).toBeInTheDocument();
    expect(screen.getByText('High Risk (Score >= 60)')).toBeInTheDocument();
  });

  it('renders factor points breakdown', () => {
    render(<IDRSBreakdownVisualizer data={sampleResult} />);
    expect(screen.getByText('1. Age')).toBeInTheDocument();
    expect(screen.getByText('2. Abdominal Obesity')).toBeInTheDocument();
    expect(screen.getByText('3. Physical Activity')).toBeInTheDocument();
    expect(screen.getByText('4. Family History')).toBeInTheDocument();
    expect(screen.getByText('72.5%')).toBeInTheDocument();
    expect(screen.getByText('60.1%')).toBeInTheDocument();
  });
});
