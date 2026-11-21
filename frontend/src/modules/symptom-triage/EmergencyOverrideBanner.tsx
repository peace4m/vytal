import React from 'react';
import { AlertTriangle, PhoneCall, ShieldAlert, Clock } from 'lucide-react';

interface EmergencyOverrideBannerProps {
  actionText?: string;
  safetyNetting?: string;
  ruleNames?: string[];
}

export const EmergencyOverrideBanner: React.FC<EmergencyOverrideBannerProps> = ({
  actionText = 'CALL EMERGENCY SERVICES (108 / 112) IMMEDIATELY.',
  safetyNetting = 'Do not drive yourself. Stay seated quietly and await emergency medical personnel.',
  ruleNames = [],
}) => {
  const safeRuleNames = ruleNames || [];
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-2xl border-2 border-rose-600 dark:border-rose-500 bg-rose-50/95 dark:bg-rose-950/90 p-6 shadow-xl space-y-5"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-rose-600 text-white rounded-xl shadow-md shrink-0">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
            <ShieldAlert className="w-3.5 h-3.5" />
            Critical Emergency Red-Flag Triggered
          </div>
          <h2 className="text-xl md:text-2xl font-black text-rose-950 dark:text-rose-100 tracking-tight">
            IMMEDIATE EMERGENCY ACTION REQUIRED
          </h2>
          <p className="text-sm md:text-base font-semibold text-rose-900 dark:text-rose-200 leading-relaxed">
            {actionText}
          </p>
        </div>
      </div>

      {/* Emergency Action Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <a
          href="tel:108"
          className="inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-md transition-colors"
        >
          <PhoneCall className="w-5 h-5" />
          Call National Ambulance (108)
        </a>
        <a
          href="tel:112"
          className="inline-flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-md transition-colors"
        >
          <PhoneCall className="w-5 h-5" />
          Call Emergency Response (112)
        </a>
      </div>

      {/* Immediate Instructions & Triggered Rules */}
      <div className="bg-white/80 dark:bg-slate-900/80 rounded-xl p-4 border border-rose-200 dark:border-rose-900 space-y-2 text-sm text-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-2 font-semibold text-rose-950 dark:text-rose-200">
          <Clock className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          <span>Immediate Safety Guidance:</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300">{safetyNetting}</p>
        {safeRuleNames.length > 0 && (
          <div className="pt-2 border-t border-rose-100 dark:border-rose-900 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Triggered Protocols:</span>
            {safeRuleNames.map((name, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 text-xs font-medium"
              >
                {name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
