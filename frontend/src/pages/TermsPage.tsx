import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert, Scale, AlertTriangle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="warning">Terms of Service</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">Effective: November 2026 • Version 1.0</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service & Clinical Decision-Support Agreement
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
          Please review these Terms of Service carefully before utilizing VYTAL. By creating an account, accessing our web application, or running our mobile apps, you acknowledge and agree to these terms.
        </p>
      </div>

      {/* Mandatory Emergency & Medical Notice */}
      <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900/80 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm">CRITICAL HEALTHCARE & EMERGENCY NOTICE</p>
          <p className="leading-relaxed">
            VYTAL IS AN EDUCATIONAL AND HEALTHCARE DECISION-SUPPORT PROTOTYPE. IT IS <strong>NOT A MEDICAL DEVICE</strong>, DOES NOT FORMULATE MEDICAL DIAGNOSES, AND DOES NOT PRESCRIBE DRUGS OR MEDICAL TREATMENTS.
          </p>
          <p className="leading-relaxed pt-1 font-semibold">
            IF YOU OR SOMEONE NEAR YOU IS EXPERIENCING A MEDICAL EMERGENCY (SUCH AS ACUTE CHEST PAIN, DIFFICULTY BREATHING, SEVERE BLEEDING, OR SUDDEN NUMBNESS), IMMEDIATELY CALL LOCAL EMERGENCY SERVICES (108 OR 112 IN INDIA, 911 IN THE US, 999 IN THE UK) OR VISIT THE NEAREST HOSPITAL EMERGENCY DEPARTMENT. NEVER DELAY PROFESSIONAL MEDICAL CONSULTATION DUE TO INFORMATION DISPLAYED IN THIS APPLICATION.
          </p>
        </div>
      </div>

      {/* Flag for Legal Review */}
      <div className="p-3.5 rounded-xl border border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Legal Review Status:</strong> These terms govern the active academic prototype. They are scheduled for formal review by qualified legal counsel prior to public commercial distribution.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Nature of the Software & Intended Use</CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed space-y-2">
            <p>
              VYTAL provides transparent, explainable decision-support algorithms designed to assist patients in understanding their own health reports and exploring potential health risk factors.
            </p>
            <p>
              All five clinical modules (LabLens, RiskPulse, SymptomSense, MedWise, and Vytal360) implement published, literature-backed scoring protocols and deterministic guidelines. The software is intended to facilitate more informed discussions between patients and their qualified healthcare providers, not to replace clinical judgment.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. User Eligibility & Account Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed space-y-2">
            <p>
              By accessing VYTAL, you represent that you are at least 18 years of age (or have explicit parental/guardian consent) and have the legal capacity to enter into these terms.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your authentication credentials. You agree to notify VYTAL immediately if you detect any unauthorized access to your account.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Acceptable Use Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed space-y-2">
            <p>You agree that you will NOT:</p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              <li>Upload malicious files, corrupted PDFs, or scripts designed to compromise application security.</li>
              <li>Attempt to probe, scan, or breach system vulnerabilities or bypass Row Level Security controls.</li>
              <li>Use VYTAL for automated commercial diagnostic claims without authorized institutional licensing.</li>
              <li>Input unauthorized third-party personal health information without valid legal consent.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">4. Intellectual Property & Academic Attribution</CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed space-y-2">
            <p>
              The VYTAL brand identity, logo, geometric waveform emblem, and user experience are proprietary property of the VYTAL project authors.
            </p>
            <p>
              Open-source software libraries, clinical formulas (such as the Indian Diabetes Risk Score authored by Dr. V. Mohan et al.), and clinical triage rules (NICE, WHO, AHA) remain under their respective licenses and clinical authorships with full citation preserved.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">5. Disclaimer of Warranties & Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed space-y-2">
            <p>
              VYTAL IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR ACCURACY OF EXTRACTION.
            </p>
            <p>
              IN NO EVENT SHALL THE AUTHORS, CONTRIBUTORS, OR AFFILIATED RESEARCHERS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR HEALTHCARE-RELATED DAMAGES ARISING FROM THE USE OF OR INABILITY TO USE THIS APPLICATION.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <CardTitle className="text-lg">6. Termination & Inquiries</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-xs leading-relaxed space-y-3">
            <p>
              You may terminate your agreement with VYTAL at any time by ceasing usage and deleting your account and associated health records via your <Link to="/profile" className="text-teal-600 dark:text-teal-400 underline font-medium">Account Settings</Link> or our <Link to="/data-deletion" className="text-teal-600 dark:text-teal-400 underline font-medium">Data Deletion Portal</Link>.
            </p>
            <p>
              For legal inquiries or questions regarding these terms, contact: <strong>legal@vytal.health</strong>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
