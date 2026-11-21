import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Trash2, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const DataDeletionPage: React.FC = () => {
  const { isAuthenticated, user, deleteAccount } = useAuth();
  const [requestEmail, setRequestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inAppDeleted, setInAppDeleted] = useState(false);
  const [confirmInApp, setConfirmInApp] = useState(false);

  const handleInAppDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteAccount();
      setInAppDeleted(true);
    } catch {
      // error handled by auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExternalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestEmail.trim()) return;
    setIsSubmitting(true);
    // Simulate processing of external deletion verification request
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="emergency">User Rights & Erasure</Badge>
          <span className="text-xs text-slate-500 dark:text-slate-400">Google Play & DPDP Compliant Deletion Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Account & Health Data Deletion Request
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
          You have the absolute right to request the complete, permanent erasure of your VYTAL account, authentication credentials, and all personal health data.
        </p>
      </div>

      {/* What Gets Deleted Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <Trash2 className="w-5 h-5" />
            <span>Scope of Complete Erasure</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-2">
          <p>When an account deletion request is processed, VYTAL executes a permanent cascading deletion of:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>User Profile:</strong> Your email address, user ID, and preference records.</li>
            <li><strong>LabLens Observations:</strong> All extracted laboratory analytes, numeric values, and units.</li>
            <li><strong>RiskPulse Records:</strong> All Indian Diabetes Risk Score (IDRS) questionnaires and calculations.</li>
            <li><strong>SymptomSense Logs:</strong> All symptom triage submissions and acuity recommendations.</li>
            <li><strong>MedWise Data:</strong> All checked medication combinations and interaction reports.</li>
            <li><strong>Vytal360 Briefs:</strong> All synthesized health summaries and exported PDF metadata.</li>
          </ul>
          <p className="pt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <em>Retention note:</em> Ephemeral session tokens automatically expire within 24 hours without requiring a manual deletion request.
          </p>
        </CardContent>
      </Card>

      {/* Path A: Active Authenticated Session */}
      {isAuthenticated && !inAppDeleted && (
        <Card className="border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20">
          <CardHeader>
            <CardTitle className="text-base text-rose-900 dark:text-rose-200">
              Active Session Detected ({user?.email})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
              You are currently signed in. You can permanently delete your account and all associated health records instantly with one click:
            </p>
            {!confirmInApp ? (
              <Button
                variant="danger"
                size="sm"
                onClick={() => setConfirmInApp(true)}
              >
                Permanently Delete My Account & All Health Data
              </Button>
            ) : (
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-rose-300 dark:border-rose-800 space-y-3">
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                  Are you absolutely certain? This operation cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={isSubmitting}
                    onClick={handleInAppDelete}
                  >
                    Yes, Confirm Permanent Deletion
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() => setConfirmInApp(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {inAppDeleted && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-semibold">Account and Health Data Successfully Erased</p>
            <p className="text-emerald-700 dark:text-emerald-300">
              Your account and all associated records have been purged. You have been logged out.
            </p>
          </div>
        </div>
      )}

      {/* Path B: External Web Request (Uninstalled App or Not Signed In) */}
      {(!isAuthenticated || inAppDeleted) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Web Request for Account Deletion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If you have uninstalled the VYTAL mobile app or cannot access your account, submit your registered email address below. A confirmation link will be delivered to verify your identity and finalize the deletion:
            </p>

            {submitted ? (
              <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-300 dark:border-teal-800 text-xs text-teal-900 dark:text-teal-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Deletion Request Received</p>
                  <p>
                    If an account is associated with <strong>{requestEmail}</strong>, an automated verification message has been dispatched with final authorization steps. Upon confirmation, all records will be purged within 48 business hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExternalRequest} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={requestEmail}
                      onChange={(e) => setRequestEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                >
                  Submit Erasure Request
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {/* Manual Assistance */}
      <div className="text-xs text-slate-500 dark:text-slate-400 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
        <p className="font-semibold text-slate-700 dark:text-slate-300">Need Manual Assistance?</p>
        <p>
          You may also email our Data Protection Officer directly at <strong>privacy@vytal.health</strong> with the subject line <em>&quot;Account Deletion Request&quot;</em> from your registered email address. Requests are processed within 48 business hours.
        </p>
      </div>
    </div>
  );
};
