/**
 * VYTAL Authentication Context & Hook
 * Comprehensive state management for Supabase Auth across Android, iOS, and Web.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export interface UserProfile {
  id: string;
  email: string;
  preferredLanguage: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, preferredLanguage?: string) => Promise<{ error: AuthError | null; user: User | null }>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
  updateUserLanguagePreference: (lang: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    // 1. Initial Session Check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        setUserProfile({
          id: currentSession.user.id,
          email: currentSession.user.email ?? '',
          preferredLanguage: currentSession.user.user_metadata?.preferred_language ?? 'en',
        });
      }
      setIsLoading(false);
    });

    // 2. Auth State Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        setUserProfile({
          id: newSession.user.id,
          email: newSession.user.email ?? '',
          preferredLanguage: newSession.user.user_metadata?.preferred_language ?? 'en',
        });
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const clearError = () => setError(null);

  // Email + Password Login
  const signInWithEmail = async (email: string, password: string) => {
    clearError();
    setIsLoading(true);
    const { data, error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (authErr) {
      setError(authErr.message);
    }
    setIsLoading(false);
    return { error: authErr };
  };

  // Email + Password Registration
  const signUpWithEmail = async (email: string, password: string, preferredLanguage: string = 'en') => {
    clearError();
    setIsLoading(true);
    const redirectTo = Linking.createURL('/auth/callback');
    const { data, error: authErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          preferred_language: preferredLanguage,
        },
      },
    });
    if (authErr) {
      setError(authErr.message);
    }
    setIsLoading(false);
    return { error: authErr, user: data.user };
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    clearError();
    const redirectTo = Linking.createURL('/auth/callback');
    const { error: authErr } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: Platform.OS !== 'web',
      },
    });
    if (authErr) {
      setError(authErr.message);
    }
  };

  // Apple OAuth
  const signInWithApple = async () => {
    clearError();
    const redirectTo = Linking.createURL('/auth/callback');
    const { error: authErr } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo,
        skipBrowserRedirect: Platform.OS !== 'web',
      },
    });
    if (authErr) {
      setError(authErr.message);
    }
  };

  // Send Password Reset Link
  const sendPasswordReset = async (email: string) => {
    clearError();
    const redirectTo = Linking.createURL('/auth/reset-password');
    const { error: authErr } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (authErr) {
      setError(authErr.message);
    }
    return { error: authErr };
  };

  // Update Password
  const updatePassword = async (newPassword: string) => {
    clearError();
    const { error: authErr } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (authErr) {
      setError(authErr.message);
    }
    return { error: authErr };
  };

  // Resend Verification Email
  const resendVerificationEmail = async (email: string) => {
    clearError();
    const { error: authErr } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (authErr) {
      setError(authErr.message);
    }
    return { error: authErr };
  };

  // Sign Out
  const signOut = async () => {
    clearError();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserProfile(null);
  };

  // Delete User Account
  const deleteAccount = async () => {
    clearError();
    if (!session) return;
    try {
      // Notify backend to deactivate account data
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/users/me/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        await signOut();
      }
    } catch (e: any) {
      setError(e.message || 'Failed to delete account');
    }
  };

  // Synchronize Language Preference
  const updateUserLanguagePreference = async (lang: string) => {
    if (!user) return;
    setUserProfile((prev) => (prev ? { ...prev, preferredLanguage: lang } : null));

    // Update in Supabase metadata
    await supabase.auth.updateUser({
      data: { preferred_language: lang },
    });

    // Sync to backend if session token is available
    if (session?.access_token) {
      try {
        await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/users/me/preferences`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ preferred_language: lang }),
        });
      } catch (err) {
        console.warn('Backend language sync deferred:', err);
      }
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
        clearError,
        updateUserLanguagePreference,
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
