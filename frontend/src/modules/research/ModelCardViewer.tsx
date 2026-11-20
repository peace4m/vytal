import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

export const ModelCardViewer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-slate-200 shadow-2xs">
      <CardHeader
        onClick={() => setIsOpen(!isOpen)}
        className="py-4 px-5 cursor-pointer hover:bg-slate-50/70 transition-colors flex flex-row items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-slate-900">
                Formal Model Card (Mitchell et al. 2019 Standard)
              </span>
              <Badge variant="normal" size="sm">Audit Ready</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Model provenance, intended uses, quantitative benchmarks, and ethical boundaries.
            </p>
          </div>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </CardHeader>

      {isOpen && (
        <CardContent className="p-6 border-t border-slate-100 space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: Model Details */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">1. Model Details</h4>
            <p>
              <strong>Identifier:</strong> vytal-ml-diabetes-risk-v1 | <strong>Version:</strong> 1.0.0 (2026-11-21)
            </p>
            <p>
              <strong>Framework:</strong> Scikit-Learn 1.6 / Python 3.14. Algorithms evaluated: Logistic Regression (L2),
              Decision Tree (CART), Random Forest (100 Trees Ensemble), and Support Vector Machine (RBF Kernel).
            </p>
          </div>

          {/* Section 2: Intended Use & Boundaries */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">2. Intended Use & Clinical Scope</h4>
            <p>
              <strong>Primary Use:</strong> Research benchmarking and academic exploration of symptom-based risk
              stratification in South Asian outpatient cohorts.
            </p>
            <p className="text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
              <strong>OUT-OF-SCOPE AND PROHIBITED USE:</strong> Never use for standalone medical diagnosis,
              treatment prescription, or medication adjustment. Machine learning outputs are strictly partitioned
              from deterministic emergency triage rules and can NEVER override emergency red flags.
            </p>
          </div>

          {/* Section 3: Training & Evaluation Cohort */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">3. Dataset Provenance & Demographics</h4>
            <p>
              <strong>Cohort:</strong> 520 patients screened at Sylhet Diabetes Hospital, Sylhet, Bangladesh
              (UCI ID: 529; Islam et al., 2020). Prevalences: 320 Positive (61.5%), 200 Negative (38.5%).
            </p>
            <p>
              <strong>Evaluation Methodology:</strong> Stratified 5-Fold Cross-Validation with fixed seed (42).
              Zero data leakage between preprocessing transformers and test folds.
            </p>
          </div>

          {/* Section 4: Ethical Considerations */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm">4. Ethical Considerations & Limitations</h4>
            <p>
              <strong>Geographic Generalizability:</strong> The training dataset represents patients presenting at a specialized hospital in Sylhet, Bangladesh. Performance in asymptomatic community screening may differ.
            </p>
            <p>
              <strong>Pediatric Scope:</strong> Evaluated only on adults aged 16 to 90. Uncalibrated for juvenile Type 1 Diabetes.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
