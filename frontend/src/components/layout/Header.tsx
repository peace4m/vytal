import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const activeLang = i18n.resolvedLanguage ? i18n.resolvedLanguage.split('-')[0] : 'en';

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
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden p-1.5 border border-slate-200 dark:border-slate-700">
              <img src="/branding/vytal-symbol.svg" alt="VYTAL Logo Mark" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100 font-sans">
                  VYTAL
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                <Badge variant="info" size="sm" className="hidden sm:inline-flex">Decision Support</Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
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

          {/* Controls: Language Selector & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700">
              <Languages className="w-4 h-4 text-slate-400" />
              <select
                value={activeLang}
                onChange={handleLanguageChange}
                className="bg-transparent border-none text-xs font-medium focus:outline-none cursor-pointer pr-1"
                aria-label="Select Language"
              >
                <optgroup label="Indian Languages">
                  <option value="en">English (EN)</option>
                  <option value="hi">हिन्दी (HI)</option>
                  <option value="bn">বাংলা (BN)</option>
                  <option value="mr">मराठी (MR)</option>
                  <option value="te">తెలుగు (TE)</option>
                  <option value="ta">தமிழ் (TA)</option>
                  <option value="gu">ગુજરાતી (GU)</option>
                  <option value="ur">اردو (UR)</option>
                  <option value="kn">ಕನ್ನಡ (KN)</option>
                  <option value="or">ଓଡ଼ିଆ (OR)</option>
                  <option value="ml">മലയാളം (ML)</option>
                  <option value="pa">ਪੰਜਾਬੀ (PA)</option>
                  <option value="as">অসমীয়া (AS)</option>
                </optgroup>
                <optgroup label="Global Languages">
                  <option value="es">Español (ES)</option>
                  <option value="fr">Français (FR)</option>
                  <option value="ar">العربية (AR)</option>
                  <option value="de">Deutsch (DE)</option>
                  <option value="pt">Português (PT)</option>
                  <option value="zh">简体中文 (ZH)</option>
                </optgroup>
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
