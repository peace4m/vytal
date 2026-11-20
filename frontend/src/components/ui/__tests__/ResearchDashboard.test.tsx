import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AlgorithmBenchmarkTable, ModelBenchmarkData } from '@/modules/research/AlgorithmBenchmarkTable';
import { FeatureImportanceVisualizer } from '@/modules/research/FeatureImportanceVisualizer';
import { ModelCardViewer } from '@/modules/research/ModelCardViewer';

describe('AlgorithmBenchmarkTable', () => {
  it('renders comparative algorithmic benchmarks across models', () => {
    const mockModels: ModelBenchmarkData[] = [
      {
        model_id: 'random-forest',
        algorithm: 'Random Forest (100 Trees Ensemble)',
        accuracy: 0.975,
        precision: 0.978,
        recall: 0.984,
        f1_score: 0.981,
        roc_auc: 0.995,
        brier_score: 0.024,
        cv_strategy: 'Stratified 5-Fold CV',
      },
      {
        model_id: 'logreg-baseline',
        algorithm: 'Logistic Regression (L2)',
        accuracy: 0.932,
        precision: 0.941,
        recall: 0.952,
        f1_score: 0.946,
        roc_auc: 0.978,
        brier_score: 0.052,
        cv_strategy: 'Stratified 5-Fold CV',
      },
    ];

    render(<AlgorithmBenchmarkTable models={mockModels} />);

    expect(screen.getByText(/Comparative Algorithmic Benchmarks/i)).toBeInTheDocument();
    expect(screen.getByText(/Random Forest \(100 Trees Ensemble\)/i)).toBeInTheDocument();
    expect(screen.getByText(/97.5%/i)).toBeInTheDocument();
    expect(screen.getByText(/0.995/i)).toBeInTheDocument();
  });
});

describe('FeatureImportanceVisualizer', () => {
  it('renders ranked clinical predictors and percentage bars', () => {
    const mockRankings = [
      { feature: 'Polyuria', raw_importance: 0.224, relative_percentage: 22.4 },
      { feature: 'Polydipsia', raw_importance: 0.201, relative_percentage: 20.1 },
      { feature: 'Age', raw_importance: 0.098, relative_percentage: 9.8 },
    ];

    render(<FeatureImportanceVisualizer rankings={mockRankings} />);

    expect(screen.getByText(/Global Feature Importance/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Polyuria/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Polydipsia/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/22.4%/i)).toBeInTheDocument();
  });
});

describe('ModelCardViewer', () => {
  it('toggles expansion to display Mitchell et al. model card specifications', () => {
    render(<ModelCardViewer />);

    expect(screen.getByText(/Formal Model Card/i)).toBeInTheDocument();
    // Click header to expand
    const header = screen.getByText(/Formal Model Card/i);
    fireEvent.click(header);

    expect(screen.getByText(/1. Model Details/i)).toBeInTheDocument();
    expect(screen.getByText(/vytal-ml-diabetes-risk-v1/i)).toBeInTheDocument();
    expect(screen.getByText(/OUT-OF-SCOPE AND PROHIBITED USE/i)).toBeInTheDocument();
  });
});
