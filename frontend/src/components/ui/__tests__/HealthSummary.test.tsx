import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExecutiveBriefHeader } from '@/modules/health-summary/ExecutiveBriefHeader';
import { CrossModuleInsights } from '@/modules/health-summary/CrossModuleInsights';
import { ModuleFindingsAccordion } from '@/modules/health-summary/ModuleFindingsAccordion';

describe('ExecutiveBriefHeader', () => {
  it('renders executive brief title, acuity badge, and download button', () => {
    render(
      <ExecutiveBriefHeader
        summaryId="sum-12345678"
        generatedAt="2026-11-21T02:00:00Z"
        highestAcuity="ROUTINE"
        pdfExportUrl="/api/v1/summary/export-pdf"
      />
    );

    expect(screen.getByText(/Clinical Decision-Support Executive Brief/i)).toBeInTheDocument();
    expect(screen.getByText(/ROUTINE ACUITY/i)).toBeInTheDocument();
    expect(screen.getByText(/Download PDF Brief/i)).toBeInTheDocument();
  });
});

describe('CrossModuleInsights', () => {
  it('renders cross-module correlation title, details and evidence source', () => {
    const mockInsights = [
      {
        category: 'Metabolic / Glycemic Risk Correlation',
        severity: 'WARNING',
        title: 'Elevated Glucose Observation with High IDRS Profile',
        details: 'Elevated blood glucose coincides with high IDRS score (>=60).',
        evidence_source: 'ICMR Guidelines for Management of Type 2 Diabetes',
        boundary_notice: 'Educational observation. Not a diagnosis.',
      },
    ];

    render(<CrossModuleInsights insights={mockInsights} />);

    expect(screen.getByText(/Elevated Glucose Observation with High IDRS Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/ICMR Guidelines for Management of Type 2 Diabetes/i)).toBeInTheDocument();
    expect(screen.getByText(/Educational observation. Not a diagnosis./i)).toBeInTheDocument();
  });
});

describe('ModuleFindingsAccordion', () => {
  it('renders module headers and confirmed lab observation table', () => {
    render(
      <ModuleFindingsAccordion
        module01={{
          has_data: true,
          confirmed_observations_count: 1,
          observations: [
            {
              analyte_name: 'Fasting Blood Glucose',
              value: '135',
              unit: 'mg/dL',
              reference_range: '70-99',
              status: 'HIGH',
            },
          ],
        }}
        module02={{
          has_data: true,
          total_score: 60,
          risk_category: 'high',
          citation: 'Mohan et al.',
        }}
        module03={{
          has_data: false,
        }}
        module04={{
          has_data: false,
          total_medications: 0,
          interaction_count: 0,
          has_severe_warning: false,
        }}
      />
    );

    expect(screen.getByText(/Module 01: Confirmed Laboratory Observations/i)).toBeInTheDocument();
    expect(screen.getByText(/Fasting Blood Glucose/i)).toBeInTheDocument();
    expect(screen.getByText(/Module 02: Indian Diabetes Risk Score/i)).toBeInTheDocument();
    expect(screen.getAllByText(/60 \/ 100/i).length).toBeGreaterThanOrEqual(1);
  });
});
