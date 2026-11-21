import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, BookOpen, Lock } from 'lucide-react';
import { VytalLogo } from '@/components/brand/VytalLogo';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="md:col-span-2">
            <div className="mb-3">
              <VytalLogo size="sm" showTagline={false} />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md mb-3">
              {t('brand.subtitle')}
            </p>
            <p className="text-[11px] text-slate-500 leading-normal">
              Educational and research decision-support prototype. Non-device software exempt under US FDA CDS Guidance (2022) & EU MDR Annex VIII.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider mb-3">
              Platform & Architecture
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>About & Methodology</span>
                </Link>
              </li>
              <li>
                <Link to="/safety" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Safety & Limitations</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Privacy & Ephemeral Data</span>
                </Link>
              </li>
              <li>
                <Link to="/research-dashboard" className="hover:text-teal-400 transition-colors">
                  Independent ML Research
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinical Evidence Citations */}
          <div>
            <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wider mb-3">
              Core Clinical Citations
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>Mohan et al. IDRS (JAPI 2005; 53:759–63)</li>
              <li>NICE Clinical Guideline CG95 (Chest Pain)</li>
              <li>WHO Emergency Triage (ETAT) Protocols</li>
              <li>NIH RxNorm & ONC High-Priority DDI List</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© 2026 VYTAL Research Project. Open-access academic informatics prototype.</p>
          <div className="flex gap-4">
            <Link to="/safety" className="hover:underline">Clinical Disclaimer</Link>
            <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/about" className="hover:underline">Research Documentation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
