import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ReportExplainerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
              MODULE 01
            </span>
            <Badge variant="info">Foundation Ready</Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            Report Explainer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Understand medical laboratory reports in simple English, Hindi, and Odia.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Laboratory Report Intake</CardTitle>
          <CardDescription className="text-xs">
            Upload your laboratory test report in PDF format or enter values manually.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-teal-400 transition-colors bg-slate-50/50">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800">Drag and drop your PDF report here</h4>
            <p className="text-xs text-slate-400 mt-1">Maximum file size: 5 MB (Digital text PDFs)</p>
            <div className="mt-4">
              <Button size="sm" variant="outline">Browse Files</Button>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Mandatory Safety Requirement:</strong> Extracted values will be displayed in an editable table for your active verification. VYTAL never assumes or invents missing values or laboratory reference ranges.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
