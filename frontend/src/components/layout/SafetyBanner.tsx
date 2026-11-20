import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teal-400 shrink-0" />
          <span className="font-medium tracking-wide">
            {t('safety.banner')}
          </span>
        </div>
        <div className="text-slate-400 text-[11px]">
          {t('safety.emergencyCall')}
        </div>
      </div>
    </div>
  );
};
