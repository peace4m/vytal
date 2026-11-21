import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Languages, Sparkles, LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { VytalLogo } from '@/components/brand/VytalLogo';
import { useAuth } from '@/context/AuthContext';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userProfile, signOut } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeLang = i18n.resolvedLanguage ? i18n.resolvedLanguage.split('-')[0] : 'en';

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut();
    navigate('/', { replace: true });
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

  const publicLinks = [
    { path: '/about', label: 'About' },
    { path: '/safety', label: 'Safety' },
    { path: '/privacy', label: 'Privacy' },
  ];

  const userInitial = userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <header className="bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity & Wordmark */}
          <Link to="/" className="group flex items-center">
            <VytalLogo size="md" showTagline={true} />
          </Link>

          {/* Navigation Links for Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {(isAuthenticated ? navLinks : publicLinks).map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200/60 dark:border-teal-800/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Controls: Language Selector, Theme Toggle, Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 transition-colors">
              <Languages className="w-4 h-4 text-slate-400 dark:text-slate-400" />
              <select
                value={activeLang}
                onChange={handleLanguageChange}
                className="bg-transparent border-none text-xs font-medium focus:outline-none cursor-pointer pr-1 text-slate-800 dark:text-slate-200"
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

            {/* Research Lab Quick Link (Authenticated) */}
            {isAuthenticated && (
              <Link
                to="/research-dashboard"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors border border-emerald-200/60 dark:border-emerald-800/60"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Research Lab</span>
              </Link>
            )}

            {/* Authentication Controls */}
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold flex items-center justify-center text-[11px] shadow-2xs">
                    {userInitial}
                  </div>
                  <span className="max-w-[100px] truncate font-medium hidden sm:inline">
                    {userProfile?.fullName || 'User'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {userProfile?.fullName}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {userProfile?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>My Dashboard</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-400" />
                        <span>Profile & Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl shadow-xs shadow-teal-500/20 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
