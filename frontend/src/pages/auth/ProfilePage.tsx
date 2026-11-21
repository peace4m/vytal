/**
 * VYTAL User Profile & Account Settings Page
 * Manage user profile, multilingual preferences, theme selection,
 * secure credential updates, and compliant account deletion.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  User as UserIcon,
  Languages,
  SunMoon,
  Calendar,
  Lock,
  LogOut,
  Trash2,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';

export const ProfilePage: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { userProfile, updateUserProfile, updatePassword, signOut, deleteAccount } = useAuth();

  // Form states
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [preferredLanguage, setPreferredLanguage] = useState(userProfile?.preferredLanguage || i18n.language || 'en');
  const [preferredTheme, setPreferredTheme] = useState(userProfile?.preferredTheme || theme);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password update states
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Deletion modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(false);

    // Apply theme
    if (preferredTheme !== theme) {
      setTheme(preferredTheme as 'light' | 'dark' | 'system');
    }

    const { error } = await updateUserProfile({
      fullName,
      preferredLanguage,
      preferredTheme,
    });

    setSavingProfile(false);
    if (!error) {
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    const { error } = await updatePassword(newPassword);
    setSavingPassword(false);

    if (!error) {
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    await deleteAccount();
    setIsDeleting(false);
    setShowDeleteModal(false);
    navigate('/', { replace: true });
  };

  const formattedDate = userProfile?.createdAt
    ? new Date(userProfile.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active Session';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-teal-500/20">
            {fullName ? fullName.charAt(0).toUpperCase() : 'V'}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {fullName || 'My Account'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {userProfile?.email}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="self-start sm:self-auto text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border-slate-200 dark:border-slate-700"
        >
          <LogOut className="w-4 h-4 mr-1.5" />
          Sign Out
        </Button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Profile & Preferences */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Form */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Personal Information & Preferences</span>
            </h2>

            {profileSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profile preferences updated and synchronized successfully.</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={userProfile?.email || ''}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Email changes require re-authentication and administrative verification.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preferred Language</span>
                  </label>
                  <select
                    value={preferredLanguage}
                    onChange={(e) => setPreferredLanguage(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <optgroup label="Indian Languages">
                      <option value="en">English (EN)</option>
                      <option value="hi">हिन्दी (HI)</option>
                      <option value="or">ଓଡ଼ିଆ (OR)</option>
                      <option value="bn">বাংলা (BN)</option>
                      <option value="mr">मराठी (MR)</option>
                      <option value="te">తెలుగు (TE)</option>
                      <option value="ta">தமிழ் (TA)</option>
                      <option value="gu">ગુજરાતી (GU)</option>
                    </optgroup>
                    <optgroup label="Global Languages">
                      <option value="es">Español (ES)</option>
                      <option value="fr">Français (FR)</option>
                      <option value="ar">العربية (AR)</option>
                      <option value="de">Deutsch (DE)</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <SunMoon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Theme Preference</span>
                  </label>
                  <select
                    value={preferredTheme}
                    onChange={(e) => setPreferredTheme(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Navy Mode</option>
                    <option value="system">Follow System Theme</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <Button
                  type="submit"
                  disabled={savingProfile}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-5 py-2 rounded-xl"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 mr-1.5" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Security & Password Update */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-7 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Security & Password</span>
            </h2>

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 border border-rose-200 dark:border-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password updated successfully.</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={savingPassword || !newPassword}
                  variant="outline"
                  className="text-xs px-5 py-2 rounded-xl text-slate-700 dark:text-slate-200"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Change Password'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Account Meta & Data Protection */}
        <div className="space-y-6">
          {/* Account Details Box */}
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Account Summary
            </h3>

            <div className="space-y-2.5 text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Member Since
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span>Account Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active & Verified
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span>Data Isolation</span>
                <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                  DPDP Protected
                </span>
              </div>
            </div>
          </div>

          {/* Privacy & Health Data Policy */}
          <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Healthcare Data Protection</span>
            </div>
            <p>
              Under Indian Digital Personal Data Protection (DPDP) Act and HIPAA security guidelines,
              your uploaded laboratory data and triage evaluations are encrypted and strictly bound to your user identity.
            </p>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-5 space-y-3">
            <h4 className="text-xs font-bold text-rose-800 dark:text-rose-400 uppercase tracking-wider">
              Danger Zone
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-400 leading-relaxed">
              Permanently delete your VYTAL account and purge all associated laboratory records, triage logs, and risk assessments.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
              className="w-full text-xs text-rose-600 border-rose-300 dark:border-rose-800 hover:bg-rose-100/60 dark:hover:bg-rose-900/40"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete Account & Health Data
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Delete Account Permanently?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                This action is irreversible. All your profile information, session records, uploaded PDF lab findings,
                IDRS calculations, triage histories, and medication reviews will be permanently purged in accordance with our data retention policy.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Confirm Deletion'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
