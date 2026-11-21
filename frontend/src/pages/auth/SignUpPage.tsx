/**
 * VYTAL Sign Up / Create Account Page
 * Comprehensive registration portal with client-side password strength evaluation,
 * terms consent, duplicate detection, and email verification handling.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { VytalLogo } from '@/components/brand/VytalLogo';

export const SignUpPage: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    resendVerificationEmail,
    error: authError,
    clearError,
  } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Email verification state
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Password Strength Calculation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteriaMet = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  const getStrengthMeta = () => {
    if (password.length === 0) return { label: '', color: 'bg-slate-200 dark:bg-slate-700', width: '0%' };
    if (criteriaMet <= 2) return { label: 'Weak', color: 'bg-rose-500', width: '33%' };
    if (criteriaMet <= 4) return { label: 'Good', color: 'bg-amber-500', width: '66%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getStrengthMeta();

  const validateForm = (): boolean => {
    setLocalError(null);
    clearError();

    if (!fullName.trim()) {
      setLocalError('Please enter your full name.');
      return false;
    }
    if (!email.trim()) {
      setLocalError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError('Please enter a valid email address.');
      return false;
    }
    if (!hasMinLength) {
      setLocalError('Password must contain at least 8 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match. Please verify both fields.');
      return false;
    }
    if (!agreedToTerms) {
      setLocalError('You must agree to the Terms of Service and Privacy Policy to create an account.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const { error, requiresVerification: verificationNeeded } = await signUpWithEmail(
      email.trim(),
      password,
      fullName.trim(),
      i18n.language || 'en'
    );
    setIsSubmitting(false);

    if (!error) {
      if (verificationNeeded) {
        setRegisteredEmail(email.trim());
        setRequiresVerification(true);
      } else {
        // Direct session created (demo or pre-confirmed provider)
        navigate('/dashboard', { replace: true });
      }
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0 || !registeredEmail) return;
    setResendSuccess(false);
    const { error } = await resendVerificationEmail(registeredEmail);
    if (!error) {
      setResendSuccess(true);
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const displayError = localError || authError;

  // View: Email Verification Required
  if (requiresVerification) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6 bg-white dark:bg-[#0f172a] p-8 sm:p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none text-center transition-colors">
          <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mx-auto border border-teal-200 dark:border-teal-800">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Verify your email
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              We have sent an authentication verification link to{' '}
              <strong className="text-slate-900 dark:text-white font-semibold">{registeredEmail}</strong>.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Please click the link in your email to activate your VYTAL healthcare decision-support account.
            </p>
          </div>

          {resendSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-center gap-2 border border-emerald-200 dark:border-emerald-800">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verification email sent again. Check your inbox.</span>
            </div>
          )}

          <div className="pt-2 space-y-3">
            <Button
              variant="outline"
              onClick={handleResendVerification}
              disabled={resendCooldown > 0}
              className="w-full text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-2 ${resendCooldown > 0 ? 'animate-spin' : ''}`} />
              {resendCooldown > 0 ? `Resend email in ${resendCooldown}s` : 'Resend verification email'}
            </Button>

            <Link
              to="/login"
              className="block w-full text-center py-2 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-[#0f172a] p-8 sm:p-10 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <VytalLogo size="lg" showTagline={false} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white pt-2">
            Create your account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join VYTAL for transparent, explainable healthcare analytics.
          </p>
        </div>

        {/* Error Alert */}
        {displayError && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">
              <span>{displayError}</span>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Rajesh Sharma"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh@example.com"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Password strength:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{ width: strength.width }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-1">
                  <div className={`flex items-center gap-1 ${hasMinLength ? 'text-teal-600 dark:text-teal-400 font-medium' : ''}`}>
                    {hasMinLength ? <Check className="w-3 h-3" /> : '•'} 8+ characters
                  </div>
                  <div className={`flex items-center gap-1 ${hasUppercase ? 'text-teal-600 dark:text-teal-400 font-medium' : ''}`}>
                    {hasUppercase ? <Check className="w-3 h-3" /> : '•'} Uppercase letter
                  </div>
                  <div className={`flex items-center gap-1 ${hasNumber ? 'text-teal-600 dark:text-teal-400 font-medium' : ''}`}>
                    {hasNumber ? <Check className="w-3 h-3" /> : '•'} Number
                  </div>
                  <div className={`flex items-center gap-1 ${hasSpecial ? 'text-teal-600 dark:text-teal-400 font-medium' : ''}`}>
                    {hasSpecial ? <Check className="w-3 h-3" /> : '•'} Special symbol
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Terms & Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-700 dark:bg-slate-800"
              />
              <span className="leading-relaxed">
                I agree to the{' '}
                <Link to="/safety" className="font-semibold text-teal-600 dark:text-teal-400 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-semibold text-teal-600 dark:text-teal-400 underline">
                  Privacy Policy
                </Link>
                , and consent to processing my clinical metrics for educational decision support.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !agreedToTerms}
            className="w-full mt-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-teal-500/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Social Authentication Providers */}
        <div className="space-y-4 pt-1">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-[#0f172a] px-3 text-slate-400 font-medium">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.8C6.5 7.2 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.4C.7 9.8 0 12.5 0 15.3c0 2.9.7 5.6 1.9 8l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.2-6.4-5.2L1.9 16.5C3.7 20.3 7.5 23.5 12 23.5z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={() => signInWithApple()}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs transition-colors"
            >
              <svg className="w-4 h-4 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.93-.91.04-2.02.61-2.67 1.38-.57.66-.99 1.74-.86 2.8.97.08 2.02-.51 2.59-1.25z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>
        </div>

        {/* Link to Login */}
        <div className="pt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          Already registered?{' '}
          <Link
            to="/login"
            className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline underline-offset-2"
          >
            Sign in here
          </Link>
        </div>

        {/* Security Notice */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Patient data privacy adhering to Indian DPDP Act & HIPAA security rules.</span>
        </div>
      </div>
    </div>
  );
};
