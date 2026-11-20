import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Download } from 'lucide-react';
import { apiClient } from '@/services/api';

export const HealthSummaryPage: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await apiClient<any>('/summary/generate', { method: 'POST' });
        setSummary(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
              MODULE 05
            </span>
            <Badge variant="normal">Consolidated Brief</Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Health Summary & Clinical Brief
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Integrates verified findings across Modules 01 through 04 with uncertainty disclosures.
          </p>
        </div>

        <Button variant="primary" size="sm">
          <Download className="w-4 h-4 mr-1.5" />
          <span>Download PDF Brief</span>
        </Button>
      </div>

      <Alert variant="info" title="Educational Synthesis Only">
        This consolidated brief summarizes findings you have entered into the platform. It does NOT generate a medical diagnosis or infer causation.
      </Alert>

      {summary && (
        <div className="space-y-4">
          {summary.synthesis_items.map((item: any, idx: number) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-600">{item.category}</span>
                  <Badge variant="info" size="sm">{item.severity}</Badge>
                </div>
                <CardTitle className="text-base mt-1">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-600 space-y-2">
                <p>{item.details}</p>
                {item.boundary_notice && (
                  <p className="text-[11px] text-slate-400 italic">{item.boundary_notice}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
