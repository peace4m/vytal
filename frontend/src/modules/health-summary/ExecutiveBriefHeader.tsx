import React, { useState } from 'react';
import { Download, Loader2, Calendar, FileText, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { downloadClientSummaryReport } from './clientPdfGenerator';

interface ExecutiveBriefHeaderProps {
  summaryId?: string;
  generatedAt?: string;
  highestAcuity?: string;
  pdfExportUrl?: string;
  summaryData?: any;
}

export const ExecutiveBriefHeader: React.FC<ExecutiveBriefHeaderProps> = ({
  summaryId = 'BRIEF-SUMMARY',
  generatedAt = new Date().toISOString(),
  highestAcuity = 'ROUTINE',
  pdfExportUrl,
  summaryData,
}) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      if (pdfExportUrl && !pdfExportUrl.startsWith('data:')) {
        const response = await fetch(pdfExportUrl);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `VYTAL_Health_Summary_${(summaryId || 'BRIEF').slice(0, 8)}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return;
        }
      }
      // If backend PDF export is unavailable or running client-side:
      downloadClientSummaryReport(summaryData || { summary_id: summaryId, generated_at: generatedAt, highest_acuity: highestAcuity });
    } catch (err) {
      console.warn('Falling back to client-side document report', err);
      downloadClientSummaryReport(summaryData || { summary_id: summaryId, generated_at: generatedAt, highest_acuity: highestAcuity });
    } finally {
      setDownloading(false);
    }
  };

  const isEmergency = highestAcuity === 'EMERGENCY';
  const isHighAcuity = highestAcuity === 'HIGH_ACUITY';
  const isModerate = highestAcuity === 'MODERATE';

  const badgeVariant = isEmergency
    ? 'emergency'
    : isHighAcuity
    ? 'high'
    : isModerate
    ? 'warning'
    : 'normal';

  const formattedDate = new Date(generatedAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
              CONSOLIDATED BRIEF
            </span>
            <Badge variant={badgeVariant}>{highestAcuity} ACUITY</Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Clinical Decision-Support Executive Brief
          </h2>
          <div className="flex items-center gap-4 text-xs text-slate-300 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              Generated: {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 font-mono">
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              ID: {(summaryId || 'BRIEF').slice(0, 8)}
            </span>
          </div>
        </div>

        <Button
          onClick={handleDownloadPdf}
          disabled={downloading}
          variant="primary"
          className="bg-teal-600 hover:bg-teal-500 text-white font-bold shadow-md shrink-0 self-start sm:self-auto"
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          <span>Download PDF Brief</span>
        </Button>
      </div>

      <div className="pt-3 border-t border-slate-700/60 flex items-center gap-2 text-xs text-slate-400">
        <Activity className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        <span>
          Includes confirmed lab results, IDRS score, triage red-flag protocols, and drug interactions.
        </span>
      </div>
    </div>
  );
};
