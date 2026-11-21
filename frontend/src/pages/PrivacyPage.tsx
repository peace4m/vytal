import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Lock, FileCheck, Trash2, ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div>
        <Badge variant="info">Privacy by Design</Badge>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
          Privacy Policy & Ephemeral Data Handling
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
          Health data is sensitive personal information. VYTAL operates under a strict minimal-retention architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardHeader>
            <div className="p-2 bg-teal-50 dark:bg-teal-950/60 rounded-lg w-fit text-teal-600 dark:text-teal-400 mb-2">
              <FileCheck className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Ephemeral PDF Processing</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Uploaded PDF reports are parsed in volatile memory and immediately deleted. Raw documents are never stored on disk or database.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-lg w-fit text-emerald-600 dark:text-emerald-400 mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Zero Mandatory PII</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            No name, national ID, phone number, or date of birth is required. Interactions use anonymous, cryptographically random session tokens.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/60 rounded-lg w-fit text-rose-600 dark:text-rose-400 mb-2">
              <Trash2 className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Right to Immediate Erasure</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Users can click "Clear My Data" at any time. This executes a cascading SQL deletion of all observations, scores, and triage records.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <CardTitle className="text-base">Zero Third-Party AI Transmission</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
          <p>
            VYTAL does <strong>not</strong> send patient laboratory results, symptom descriptions, or medication lists to commercial third-party LLMs or external AI APIs (e.g., OpenAI, Anthropic, or external translation services).
          </p>
          <p>
            All clinical calculations, deterministic rule evaluations, and multilingual translations run locally inside the self-contained platform environment.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
