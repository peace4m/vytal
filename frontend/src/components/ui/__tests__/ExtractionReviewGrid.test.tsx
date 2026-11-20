import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExtractionReviewGrid, ReviewItem } from '@/modules/report-explainer/ExtractionReviewGrid';

const sampleItems: ReviewItem[] = [
  {
    temp_id: 'item-1',
    analyte_name: 'Fasting Blood Sugar (Glucose)',
    observed_value: 126.0,
    observed_value_str: '126 mg/dL',
    unit: 'mg/dL',
    lab_reference_range: '70 - 100 mg/dL',
    status_flag: 'HIGH',
  },
  {
    temp_id: 'item-2',
    analyte_name: 'HbA1c',
    observed_value: 6.8,
    observed_value_str: '6.8 %',
    unit: '%',
    lab_reference_range: '< 5.7 %',
    status_flag: 'HIGH',
  },
];

describe('ExtractionReviewGrid Component', () => {
  it('renders extracted laboratory rows', () => {
    const handleConfirm = vi.fn();
    const handleAdd = vi.fn();

    render(
      <ExtractionReviewGrid
        items={sampleItems}
        onConfirm={handleConfirm}
        onOpenManualAdd={handleAdd}
      />
    );

    expect(screen.getByText('Fasting Blood Sugar (Glucose)')).toBeInTheDocument();
    expect(screen.getByText('HbA1c')).toBeInTheDocument();
    expect(screen.getByText('70 - 100 mg/dL')).toBeInTheDocument();
  });

  it('triggers onConfirm when confirm button is clicked', () => {
    const handleConfirm = vi.fn();
    const handleAdd = vi.fn();

    render(
      <ExtractionReviewGrid
        items={sampleItems}
        onConfirm={handleConfirm}
        onOpenManualAdd={handleAdd}
      />
    );

    const confirmBtn = screen.getByRole('button', { name: /confirm extracted results/i });
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledWith(sampleItems);
  });
});
