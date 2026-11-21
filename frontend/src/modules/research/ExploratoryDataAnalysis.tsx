import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BarChart2, CheckCircle2, Users, GitCommit, Layers } from 'lucide-react';

export interface EDAData {
  total_records: number;
  features_count: number;
  missing_values: {
    total_missing: number;
    pct_missing: number;
    imputation_required: boolean;
  };
  class_balance: {
    positive_count: number;
    positive_pct: number;
    negative_count: number;
    negative_pct: number;
  };
  demographics: {
    age_mean: number;
    age_std: number;
    age_min: number;
    age_max: number;
    male_count: number;
    male_pct: number;
    female_count: number;
    female_pct: number;
  };
  top_correlations_with_target: Array<{
    feature: string;
    pearson_r: number;
  }>;
}

interface ExploratoryDataAnalysisProps {
  eda?: EDAData;
}

export const ExploratoryDataAnalysis: React.FC<ExploratoryDataAnalysisProps> = ({ eda }) => {
  const data: EDAData = eda || {
    total_records: 520,
    features_count: 16,
    missing_values: { total_missing: 0, pct_missing: 0.0, imputation_required: false },
    class_balance: { positive_count: 320, positive_pct: 61.5, negative_count: 200, negative_pct: 38.5 },
    demographics: {
      age_mean: 48.0,
      age_std: 12.1,
      age_min: 16,
      age_max: 90,
      male_count: 328,
      male_pct: 63.1,
      female_count: 192,
      female_pct: 36.9,
    },
    top_correlations_with_target: [
      { feature: 'Polyuria (Excess Urination)', pearson_r: 0.67 },
      { feature: 'Polydipsia (Excess Thirst)', pearson_r: 0.65 },
      { feature: 'Biological Gender (Female)', pearson_r: 0.45 },
      { feature: 'Sudden Weight Loss', pearson_r: 0.44 },
      { feature: 'Partial Paresis', pearson_r: 0.43 },
      { feature: 'Polyphagia (Excess Hunger)', pearson_r: 0.34 },
    ],
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Exploratory Data Analysis (EDA) & Cohort Characterization
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            Dataset distribution, missingness verification, and bivariate Pearson correlations ($n={data.total_records}$).
          </CardDescription>
        </div>
        <Badge variant="info" size="sm">Empirical Verification</Badge>
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Missing Value Card */}
          <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                Missing Values
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-emerald-950 dark:text-emerald-100 font-mono">
                {data.missing_values.total_missing}
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">(0.00% missingness)</span>
            </div>
            <p className="text-[11px] text-emerald-800/90 dark:text-emerald-300 leading-tight">
              Zero imputation needed; 100% complete records across all {data.features_count} feature vectors.
            </p>
          </div>

          {/* Class Distribution Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Class Distribution
              </span>
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {data.class_balance.positive_pct}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Positive / {data.class_balance.negative_pct}% Negative</span>
            </div>
            {/* Visual ratio bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden flex">
              <div
                className="bg-teal-600 h-full"
                style={{ width: `${data.class_balance.positive_pct}%` }}
                title={`Positive: ${data.class_balance.positive_count}`}
              />
              <div
                className="bg-slate-400 dark:bg-slate-500 h-full"
                style={{ width: `${data.class_balance.negative_pct}%` }}
                title={`Negative: ${data.class_balance.negative_count}`}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {data.class_balance.positive_count} Diabetic vs {data.class_balance.negative_count} Non-diabetic patients.
            </p>
          </div>

          {/* Demographics Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Demographics
              </span>
              <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {data.demographics.age_mean} yrs
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">(±{data.demographics.age_std} SD)</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Age range {data.demographics.age_min}–{data.demographics.age_max} | {data.demographics.male_pct}% Male, {data.demographics.female_pct}% Female
            </p>
          </div>
        </div>

        {/* Feature Correlation Analysis */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              Bivariate Pearson Correlation Coefficients with Diabetes Target ($r$)
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Statistical Significance $p &lt; 0.001$</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {data.top_correlations_with_target.map((item) => {
              const widthPct = Math.round(item.pearson_r * 100);
              return (
                <div key={item.feature} className="p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.feature}</span>
                    <span className="font-mono font-bold text-teal-900 dark:text-teal-300">
                      +{item.pearson_r.toFixed(2)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-600 h-full rounded-full"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
