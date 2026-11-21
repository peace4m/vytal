/**
 * VYTAL Authentication Context & Hook
 * Provides full authentication state, Supabase integration, session persistence,
 * route guard support, user profile management, and account lifecycle controls.
 */

import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';
import { supabase, isSupabaseConfigured, localAuthService } from '../services/supabase';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  preferredLanguage: string;
  preferredTheme: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    fullName: string,
    preferredLanguage?: string
  ) => Promise<{ error: AuthError | null; user: User | null; requiresVerification?: boolean }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithApple: () => Promise<{ error: AuthError | null }>;
  sendPasswordReset: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateUserProfile: (updates: {
    fullName?: string;
    preferredLanguage?: string;
    preferredTheme?: string;
  }) => Promise<{ error: Error | null }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [, startTransition] = useTransition();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  const syncProfileFromUser = (currentUser: User | null) => {
    if (!currentUser) {
      setUserProfile(null);
      return;
    }
    const meta = currentUser.user_metadata || {};
    const profile: UserProfile = {
      id: currentUser.id,
      email: currentUser.email || '',
      fullName: meta.full_name || meta.name || currentUser.email?.split('@')[0] || 'VYTAL User',
      preferredLanguage: meta.preferred_language || i18n.language || 'en',
      preferredTheme: meta.preferred_theme || 'system',
      createdAt: currentUser.created_at || new Date().toISOString(),
    };
    setUserProfile(profile);

    // Apply language preference if set
    if (profile.preferredLanguage && profile.preferredLanguage !== i18n.language) {
      startTransition(() => {
        i18n.changeLanguage(profile.preferredLanguage);
      });
    }
  };

  useEffect(() => {
    if (isConfigured) {
      // Check if URL returned with an OAuth error
      const currentHash = window.location.hash;
      if (currentHash.includes('error_description=')) {
        try {
          const params = new URLSearchParams(currentHash.replace(/^#/, ''));
          const desc = params.get('error_description');
          if (desc) setError(decodeURIComponent(desc.replace(/\+/g, ' ')));
        } catch {
          // ignore parsing error
        }
      }

      // 1. Live Supabase Session Check
      supabase.auth.getSession().then(({ data: { session: curSession } }) => {
        setSession(curSession);
        setUser(curSession?.user ?? null);
        syncProfileFromUser(curSession?.user ?? null);
        setIsLoading(false);
        if (curSession && window.location.hash.includes('access_token=')) {
          window.location.hash = '#/dashboard';
        }
      });

      // 2. Auth State Listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        syncProfileFromUser(newSession?.user ?? null);
        setIsLoading(false);

        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && newSession) {
          if (
            window.location.hash.includes('access_token=') ||
            window.location.hash === '#/login' ||
            window.location.hash === '#/signup'
          ) {
            window.location.hash = '#/dashboard';
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local In-Browser Dev Mode
      const curSession = localAuthService.getCurrentSession();
      setSession(curSession);
      setUser(curSession?.user ?? null);
      syncProfileFromUser(curSession?.user ?? null);
      setIsLoading(false);
    }
  }, [isConfigured]);

  const clearError = () => setError(null);

  // Email + Password Sign In
  const signInWithEmail = async (email: string, password: string, _rememberMe: boolean = true) => {
    clearError();
    setIsLoading(true);

    if (isConfigured) {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authErr) {
        setError(authErr.message);
        setIsLoading(false);
        return { error: authErr };
      }

      setSession(data.session);
      setUser(data.user);
      syncProfileFromUser(data.user);
      setIsLoading(false);
      return { error: null };
    } else {
      const { user: localUser, session: localSession, error: localErr } = localAuthService.signIn(email, password);
      if (localErr) {
        setError(localErr.message);
        setIsLoading(false);
        return { error: localErr };
      }
      setSession(localSession);
      setUser(localUser);
      syncProfileFromUser(localUser);
      setIsLoading(false);
      return { error: null };
    }
  };

  // Email + Password Sign Up
  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    preferredLanguage: string = 'en'
  ) => {
    clearError();
    setIsLoading(true);

    if (isConfigured) {
      const redirectTo = `${window.location.origin}/#/login`;
      const { data, error: authErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            full_name: fullName,
            preferred_language: preferredLanguage,
          },
        },
      });

      if (authErr) {
        setError(authErr.message);
        setIsLoading(false);
        return { error: authErr, user: null };
      }

      const requiresVerification = !data.session;
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        syncProfileFromUser(data.user);
      }
      setIsLoading(false);
      return { error: null, user: data.user, requiresVerification };
    } else {
      const { user: localUser, session: localSession, error: localErr } = localAuthService.signUp(
        email,
        password,
        fullName,
        preferredLanguage
      );

      if (localErr) {
        setError(localErr.message);
        setIsLoading(false);
        return { error: localErr, user: null };
      }

      setSession(localSession);
      setUser(localUser);
      syncProfileFromUser(localUser);
      setIsLoading(false);
      return { error: null, user: localUser, requiresVerification: false };
    }
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    clearError();
    const redirectUrl = `${window.location.origin}${window.location.pathname}`;
    const cleanRedirectUrl = redirectUrl.endsWith('/') ? redirectUrl : `${redirectUrl}/`;
    const { error: authErr } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: cleanRedirectUrl,
      },
    });
    if (authErr) {
      setError(authErr.message);
      return { error: authErr };
    }
    return { error: null };
  };

  // Apple OAuth
  const signInWithApple = async () => {
    clearError();
    const redirectUrl = `${window.location.origin}${window.location.pathname}`;
    const cleanRedirectUrl = redirectUrl.endsWith('/') ? redirectUrl : `${redirectUrl}/`;
    const { error: authErr } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: cleanRedirectUrl,
      },
    });
    if (authErr) {
      setError(authErr.message);
      return { error: authErr };
    }
    return { error: null };
  };

  // Send Password Reset
  const sendPasswordReset = async (email: string) => {
    clearError();
    if (isConfigured) {
      const redirectTo = `${window.location.origin}/#/reset-password`;
      const { error: authErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (authErr) setError(authErr.message);
      return { error: authErr };
    } else {
      // Local mode simulates success
      return { error: null };
    }
  };

  // Update Password
  const updatePassword = async (newPassword: string) => {
    clearError();
    if (isConfigured) {
      const { error: authErr } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (authErr) setError(authErr.message);
      return { error: authErr };
    } else {
      const { error: localErr } = localAuthService.updateUser({ password: newPassword });
      if (localErr) setError(localErr.message);
      return { error: localErr };
    }
  };

  // Resend Verification Email
  const resendVerificationEmail = async (email: string) => {
    clearError();
    if (isConfigured) {
      const { error: authErr } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (authErr) setError(authErr.message);
      return { error: authErr };
    } else {
      return { error: null };
    }
  };

  // Sign Out
  const signOut = async () => {
    clearError();
    if (isConfigured) {
      await supabase.auth.signOut();
    } else {
      localAuthService.signOut();
    }
    setUser(null);
    setSession(null);
    setUserProfile(null);
  };

  // Delete User Account
  const deleteAccount = async () => {
    clearError();
    try {
      if (session?.access_token) {
        // Notify backend to deactivate and purge personal records
        await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'}/users/me/account`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }).catch(() => {
          // Fallback if backend offline
        });
      }

      if (!isConfigured) {
        localAuthService.deleteAccount();
      } else {
        await supabase.auth.signOut();
      }

      // Purge module assessment caches
      localStorage.removeItem('vytal_assessment_lab');
      localStorage.removeItem('vytal_assessment_idrs');
      localStorage.removeItem('vytal_assessment_triage');
      localStorage.removeItem('vytal_assessment_meds');

      setUser(null);
      setSession(null);
      setUserProfile(null);
    } catch (e: any) {
      setError(e.message || 'Failed to complete account deletion');
    }
  };

  // Update User Profile
  const updateUserProfile = async (updates: {
    fullName?: string;
    preferredLanguage?: string;
    preferredTheme?: string;
  }) => {
    clearError();
    try {
      if (isConfigured) {
        const { data, error: authErr } = await supabase.auth.updateUser({
          data: {
            full_name: updates.fullName,
            preferred_language: updates.preferredLanguage,
            preferred_theme: updates.preferredTheme,
          },
        });
        if (authErr) throw authErr;
        syncProfileFromUser(data.user);
      } else {
        const { user: updatedUser, error: localErr } = localAuthService.updateUser(updates);
        if (localErr) throw localErr;
        syncProfileFromUser(updatedUser);
      }

      // Sync to backend if session active
      if (session?.access_token && updates.preferredLanguage) {
        fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1'}/users/me/preferences`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ preferred_language: updates.preferredLanguage }),
        }).catch(() => {});
      }

      return { error: null };
    } catch (e: any) {
      setError(e.message || 'Failed to update user profile');
      return { error: e };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        isAuthenticated: Boolean(user),
        isLoading,
        isConfigured,
        error,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithApple,
        sendPasswordReset,
        updatePassword,
        resendVerificationEmail,
        signOut,
        deleteAccount,
        updateUserProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
