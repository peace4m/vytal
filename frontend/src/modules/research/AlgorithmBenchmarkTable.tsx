import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Trophy, CheckCircle2 } from 'lucide-react';

export interface ModelBenchmarkData {
  model_id: string;
  algorithm: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  brier_score: number;
  cv_strategy: string;
}

interface AlgorithmBenchmarkTableProps {
  models: ModelBenchmarkData[];
}

export const AlgorithmBenchmarkTable: React.FC<AlgorithmBenchmarkTableProps> = ({ models }) => {
  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <CardTitle className="text-base font-bold text-slate-900">
              Comparative Algorithmic Benchmarks
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Stratified 5-Fold Cross-Validation evaluated with zero data leakage (random seed 42).
          </CardDescription>
        </div>
        <Badge variant="normal" size="sm">4 Algorithms Benchmarked</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Algorithm & Architecture</TableHead>
              <TableHead>Accuracy</TableHead>
              <TableHead>Precision</TableHead>
              <TableHead>Recall (Sens)</TableHead>
              <TableHead>F1-Score</TableHead>
              <TableHead>ROC-AUC</TableHead>
              <TableHead>Brier Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((m) => {
              const isBest = m.model_id === 'random-forest';

              return (
                <TableRow key={m.model_id} className={isBest ? 'bg-teal-50/30' : undefined}>
                  <TableCell className="font-semibold text-slate-900 flex items-center gap-2">
                    {isBest && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                    <span>{m.algorithm}</span>
                  </TableCell>
                  <TableCell className="font-mono">{(m.accuracy * 100).toFixed(1)}%</TableCell>
                  <TableCell className="font-mono">{(m.precision * 100).toFixed(1)}%</TableCell>
                  <TableCell className="font-mono font-bold text-teal-900">
                    {(m.recall * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="font-mono">{(m.f1_score * 100).toFixed(1)}%</TableCell>
                  <TableCell className="font-mono font-bold text-teal-900">
                    {m.roc_auc.toFixed(3)}
                  </TableCell>
                  <TableCell className="font-mono text-slate-500">
                    {m.brier_score.toFixed(3)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
