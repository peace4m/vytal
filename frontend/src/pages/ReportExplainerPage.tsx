import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Upload, FileText, Plus, RotateCcw } from 'lucide-react';
import { apiClient } from '@/services/api';
import { ExtractionReviewGrid, ReviewItem } from '@/modules/report-explainer/ExtractionReviewGrid';
import { ManualEntryModal, ManualEntryItem } from '@/modules/report-explainer/ManualEntryModal';
import { ConfirmedExplanationCard, ExplanationItem } from '@/modules/report-explainer/ConfirmedExplanationCard';

export const ReportExplainerPage: React.FC = () => {
  const { i18n } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);
  const [extractedItems, setExtractedItems] = useState<ReviewItem[]>([]);
  const [explanations, setExplanations] = useState<ExplanationItem[] | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (!selected.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage('Only PDF documents are supported.');
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        setErrorMessage('File size exceeds 5 MB limit.');
        return;
      }
      setFile(selected);
      setErrorMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient<any>('/reports/upload', {
        method: 'POST',
        body: formData,
      });
      setReportId(res.report_id);
      setExtractedItems(res.extracted_items || []);
      setExplanations(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse PDF.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddManualItem = (item: ManualEntryItem) => {
    const newItem: ReviewItem = {
      temp_id: `manual-${Date.now()}`,
      analyte_name: item.analyte_name,
      observed_value: item.observed_value,
      observed_value_str: `${item.observed_value} ${item.unit}`.trim(),
      unit: item.unit,
      lab_reference_range: item.lab_reference_range,
      status_flag: item.status_flag,
    };
    setExtractedItems((prev) => [...prev, newItem]);
    if (!reportId) {
      setReportId(`manual-report-${Date.now()}`);
    }
  };

  const handleConfirm = async (confirmed: ReviewItem[]) => {
    if (!reportId || confirmed.length === 0) return;
    setIsConfirming(true);
    setErrorMessage(null);

    try {
      const currentLang = i18n.language || 'en';
      const payload = {
        report_id: reportId,
        confirmed_items: confirmed.map((item) => ({
          analyte_name: item.analyte_name,
          observed_value: item.observed_value,
          observed_value_str: item.observed_value_str,
          unit: item.unit,
          lab_reference_range: item.lab_reference_range,
          status_flag: item.status_flag,
        })),
      };

      const res = await apiClient<any>(`/reports/confirm?lang=${currentLang}`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setExplanations(res.explanations || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Confirmation failed.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setReportId(null);
    setExtractedItems([]);
    setExplanations(null);
    setErrorMessage(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
              MODULE 01
            </span>
            <Badge variant="normal">PyMuPDF In-Memory Engine</Badge>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
            01 — LabLens
          </h1>
          <p className="text-xs font-semibold text-teal-700 mt-0.5">
            Understand your reports.
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            Purpose: Laboratory report interpretation. Extracts test names, observed values, and printed reference ranges with mandatory human verification.
          </p>
        </div>

        {(extractedItems.length > 0 || explanations) && (
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Start Over
          </Button>
        )}
      </div>

      {errorMessage && (
        <Alert variant="warning" title="Notice">
          {errorMessage}
        </Alert>
      )}

      {/* Step 1: Upload Dropzone & Manual Intake (Shown when no items in review and no confirmed explanations) */}
      {extractedItems.length === 0 && !explanations && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload Laboratory Report</CardTitle>
              <CardDescription className="text-xs">
                Upload your digital laboratory test PDF report. The document is processed in volatile memory and deleted immediately.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-teal-400 transition-colors bg-slate-50/50">
                <input
                  type="file"
                  id="pdf-upload"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer block">
                  <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  {file ? (
                    <div>
                      <span className="text-sm font-semibold text-teal-800">{file.name}</span>
                      <p className="text-xs text-slate-400 mt-1">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB — Ready to parse
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        Choose a PDF laboratory report or drag here
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">Digital text PDFs up to 5 MB</p>
                    </div>
                  )}
                </label>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <Button
                  onClick={handleUpload}
                  disabled={!file}
                  isLoading={isUploading}
                  variant="primary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  <FileText className="w-4 h-4 mr-1.5" />
                  Extract Data from PDF
                </Button>

                <span className="text-xs text-slate-400 font-medium">OR</span>

                <Button
                  onClick={() => setIsManualModalOpen(true)}
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Enter Laboratory Tests Manually
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Extraction Review Grid (Mandatory Confirmation Gate) */}
      {extractedItems.length > 0 && !explanations && (
        <ExtractionReviewGrid
          items={extractedItems}
          onConfirm={handleConfirm}
          onOpenManualAdd={() => setIsManualModalOpen(true)}
          isConfirming={isConfirming}
        />
      )}

      {/* Step 3: Confirmed Explanations View */}
      {explanations && (
        <ConfirmedExplanationCard explanations={explanations} />
      )}

      {/* Manual Entry Modal */}
      <ManualEntryModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onAdd={handleAddManualItem}
      />
    </div>
  );
};
