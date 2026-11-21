import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Lock, FileCheck, Trash2, Mail, AlertTriangle } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="info">Privacy & Data Governance</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">Effective: November 2026 • Version 1.0</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy & Ephemeral Data Handling
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
          Health information is inherently sensitive personal data. VYTAL is engineered around a strict minimal-retention, privacy-by-design architecture aligned with the Digital Personal Data Protection (DPDP) Act 2023 principles and international health privacy guidelines.
        </p>
      </div>

      {/* Flag for Legal Review */}
      <div className="p-4 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">Notice Regarding Legal Review & Regulatory Status</p>
          <p className="leading-relaxed">
            This document outlines the operational data flows and security safeguards implemented in VYTAL. It is flagged for qualified legal counsel review before commercial clinical deployment.
          </p>
        </div>
      </div>

      {/* Core Privacy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <CardHeader>
            <div className="p-2 bg-teal-50 dark:bg-teal-950/60 rounded-lg w-fit text-teal-600 dark:text-teal-400 mb-2">
              <FileCheck className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Ephemeral PDF Processing</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Uploaded laboratory reports are parsed in volatile RAM using native extraction libraries and destroyed immediately after processing. Raw PDF binary files are never written to disk or persistent cloud buckets without explicit affirmative user opt-in.
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
            No Aadhaar number, national health ID, phone number, physical address, or date of birth is required. Demonstrations and anonymous evaluations utilize pseudonymous session tokens that expire after 24 hours.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/60 rounded-lg w-fit text-rose-600 dark:text-rose-400 mb-2">
              <Trash2 className="w-5 h-5" />
            </div>
            <CardTitle className="text-base">Right to Absolute Erasure</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            You maintain complete sovereignty over your data. Clicking &quot;Delete Account & Data&quot; in settings triggers an immediate cascading deletion of all associated laboratory observations, risk assessments, and account profiles across all active datastores.
          </CardContent>
        </Card>
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Information We Collect & Process</CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed space-y-3">
            <p>
              Depending on how you use VYTAL (as an anonymous visitor or registered user), we process the following categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300">
              <li><strong>Account Credentials:</strong> Email address, encrypted password hash (via Supabase Auth), optional display name, and preferred UI language/theme.</li>
              <li><strong>Laboratory Report Data (LabLens):</strong> Analytes extracted from user-supplied laboratory reports (such as fasting blood glucose, HbA1c, lipid fractions), observed values, measurement units, and laboratory reference ranges.</li>
              <li><strong>Cardiometabolic Risk Parameters (RiskPulse):</strong> Self-reported age bracket, waist circumference range, physical activity level, and immediate family history of diabetes for Indian Diabetes Risk Score (IDRS) calculation.</li>
              <li><strong>Symptom Reports (SymptomSense):</strong> Self-selected symptom descriptions, onset duration, age, and pregnancy status to evaluate against emergency triage short-circuiting rules.</li>
              <li><strong>Medication Check Lists (MedWise):</strong> Self-entered brand or generic drug names mapped against standardized RxNorm concept identifiers to identify clinically documented drug-drug interactions.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Purpose of Processing & Computational Architecture</CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed space-y-2">
            <p>
              Information is collected solely to generate transparent, educational decision-support evaluations, explain complex laboratory reports in plain language, and synthesize integrated personal health summaries.
            </p>
            <p>
              <strong>Zero External Commercial LLM Transmission:</strong> VYTAL does <em>not</em> transmit user health measurements, symptoms, or medication queries to third-party commercial large language models (such as OpenAI ChatGPT, Anthropic Claude, or public cloud generative APIs). All clinical rule evaluations, scoring algorithms, and translations run locally within the controlled application environment.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Data Storage, Retention & Cloud Infrastructure</CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed space-y-2">
            <p>
              <strong>Hosting Location:</strong> Cloud databases and authentication servers are hosted in designated secure data centers with regional isolation (primary cloud database hosted in the Asia-South region).
            </p>
            <p>
              <strong>Retention Periods:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              <li><strong>Anonymous Session Records:</strong> Automatically purged after 24 hours of inactivity.</li>
              <li><strong>Raw PDF Files:</strong> Not retained. In-memory buffer is flushed immediately upon parsing completion.</li>
              <li><strong>Registered User Health Data:</strong> Retained until the user requests account deletion or manually clears individual module records.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">4. User Rights, Consent Withdrawal & Data Deletion</CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed space-y-3">
            <p>
              Under applicable data protection laws, including India&apos;s DPDP Act 2023, you have clear rights regarding your personal health data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Consent Withdrawal</p>
                <p className="text-slate-500 dark:text-slate-400">You may withdraw processing consent at any time from your Account Settings. Withdrawing consent deactivates health analytics processing and triggers data purge workflows.</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white mb-1">Permanent Deletion</p>
                <p className="text-slate-500 dark:text-slate-400">
                  Delete your account and all associated health records instantly via in-app profile controls or via our public <Link to="/data-deletion" className="text-teal-600 dark:text-teal-400 underline font-medium">Data Deletion Request Page</Link>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <CardTitle className="text-lg">5. Grievance Redressal Officer & Inquiries</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed space-y-3">
            <p>
              In accordance with the Digital Personal Data Protection Act, VYTAL designates an official Grievance Redressal mechanism for handling privacy inquiries, data subject access requests, and security concerns:
            </p>
            <div className="p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
              <p><strong>Designation:</strong> Data Protection & Grievance Officer, Project VYTAL</p>
              <p><strong>Official Contact Email:</strong> privacy@vytal.health (or via GitHub Security Advisories at peace4m/vytal)</p>
              <p><strong>Expected Acknowledgement Timeline:</strong> Within 48 business hours</p>
              <p><strong>Resolution Timeline:</strong> Within 30 calendar days</p>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">
              If a grievance is not resolved satisfactorily within the stipulated timeline, you have the right to escalate the matter to the Data Protection Board of India or your relevant regional data protection supervisory authority.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
