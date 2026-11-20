import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Activity, Languages, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const navLinks = [
    { path: '/dashboard', label: t('nav.dashboard') },
    { path: '/modules/report-explainer', label: t('nav.module1') },
    { path: '/modules/risk-score', label: t('nav.module2') },
    { path: '/modules/symptom-triage', label: t('nav.module3') },
    { path: '/modules/medication-check', label: t('nav.module4') },
    { path: '/modules/health-summary', label: t('nav.module5') },
    { path: '/research-dashboard', label: t('nav.research') },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">VYTAL</span>
                <Badge variant="info" size="sm" className="hidden sm:inline-flex">v0.1 Prototype</Badge>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {t('brand.tagline')}
              </p>
            </div>
          </Link>

          {/* Navigation Links for Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Controls: Language Selector & Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700">
              <Languages className="w-4 h-4 text-slate-400" />
              <select
                value={i18n.language}
                onChange={handleLanguageChange}
                className="bg-transparent border-none text-xs font-medium focus:outline-none cursor-pointer pr-1"
                aria-label="Select Language"
              >
                <option value="en">English (EN)</option>
                <option value="hi">हिन्दी (HI)</option>
                <option value="or">ଓଡ଼ିଆ (OR)</option>
              </select>
            </div>

            <Link
              to="/research-dashboard"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors border border-emerald-200/60"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Research Lab</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
