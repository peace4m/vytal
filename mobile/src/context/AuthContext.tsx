/**
 * VYTAL Authentication Context & Hook
 * Comprehensive state management for Supabase Auth across Android, iOS, and Web.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured, SecureStoreAdapter } from '../services/supabase';

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
    if (isConfigured) {
      // 1. Initial Session Check with Supabase
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
    } else {
      // Local Hardware-Backed SecureStore Dev Mode
      SecureStoreAdapter.getItem('vytal_mobile_auth_session').then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            setSession(parsed);
            setUser(parsed.user);
            setUserProfile({
              id: parsed.user.id,
              email: parsed.user.email ?? '',
              preferredLanguage: parsed.user.user_metadata?.preferred_language ?? 'en',
            });
          } catch {}
        }
        setIsLoading(false);
      });
    }
  }, [isConfigured]);

  const clearError = () => setError(null);

  // Email + Password Login
  const signInWithEmail = async (email: string, password: string) => {
    clearError();
    setIsLoading(true);

    if (isConfigured) {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (authErr) {
        setError(authErr.message);
      }
      setIsLoading(false);
      return { error: authErr };
    } else {
      // Offline / Local SecureStore verification
      try {
        const rawUsers = await SecureStoreAdapter.getItem('vytal_mobile_auth_users');
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());

        if (!found || found.password !== password) {
          const authErr = { name: 'AuthApiError', message: 'Invalid email or password. Please verify your credentials.', status: 400 } as AuthError;
          setError(authErr.message);
          setIsLoading(false);
          return { error: authErr };
        }

        const localSession: Session = {
          access_token: `mob_tok_${found.id}`,
          refresh_token: `mob_ref_${found.id}`,
          expires_in: 86400,
          expires_at: Math.floor(Date.now() / 1000) + 86400,
          token_type: 'bearer',
          user: {
            id: found.id,
            email: found.email,
            user_metadata: { preferred_language: found.preferredLanguage || 'en' },
            app_metadata: {},
            aud: 'authenticated',
            created_at: found.createdAt,
          } as unknown as User,
        };

        await SecureStoreAdapter.setItem('vytal_mobile_auth_session', JSON.stringify(localSession));
        setSession(localSession);
        setUser(localSession.user);
        setUserProfile({
          id: found.id,
          email: found.email,
          preferredLanguage: found.preferredLanguage || 'en',
        });
        setIsLoading(false);
        return { error: null };
      } catch (err: any) {
        setError(err.message || 'Login failed');
        setIsLoading(false);
        return { error: err };
      }
    }
  };

  // Email + Password Registration
  const signUpWithEmail = async (email: string, password: string, preferredLanguage: string = 'en') => {
    clearError();
    setIsLoading(true);

    if (isConfigured) {
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
    } else {
      try {
        const rawUsers = await SecureStoreAdapter.getItem('vytal_mobile_auth_users');
        const users = rawUsers ? JSON.parse(rawUsers) : [];
        const existing = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase().trim());

        if (existing) {
          const authErr = { name: 'AuthApiError', message: 'An account with this email address already exists. Please log in.', status: 409 } as AuthError;
          setError(authErr.message);
          setIsLoading(false);
          return { error: authErr, user: null };
        }

        const newUser = {
          id: `usr_${Date.now()}`,
          email: email.toLowerCase().trim(),
          password,
          preferredLanguage,
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        await SecureStoreAdapter.setItem('vytal_mobile_auth_users', JSON.stringify(users));

        const localSession: Session = {
          access_token: `mob_tok_${newUser.id}`,
          refresh_token: `mob_ref_${newUser.id}`,
          expires_in: 86400,
          expires_at: Math.floor(Date.now() / 1000) + 86400,
          token_type: 'bearer',
          user: {
            id: newUser.id,
            email: newUser.email,
            user_metadata: { preferred_language: preferredLanguage },
            app_metadata: {},
            aud: 'authenticated',
            created_at: newUser.createdAt,
          } as unknown as User,
        };

        await SecureStoreAdapter.setItem('vytal_mobile_auth_session', JSON.stringify(localSession));
        setSession(localSession);
        setUser(localSession.user);
        setUserProfile({
          id: newUser.id,
          email: newUser.email,
          preferredLanguage,
        });
        setIsLoading(false);
        return { error: null, user: localSession.user };
      } catch (err: any) {
        setError(err.message || 'Registration failed');
        setIsLoading(false);
        return { error: err, user: null };
      }
    }
  };

  // Google OAuth
  const signInWithGoogle = async () => {
    clearError();
    if (!isConfigured) {
      setError(
        'Google OAuth requires configured Supabase credentials. Configure EXPO_PUBLIC_SUPABASE_URL and your Google Client ID in your Supabase dashboard.'
      );
      return;
    }
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
    if (!isConfigured) {
      setError(
        'Sign in with Apple requires configured Supabase credentials. Configure EXPO_PUBLIC_SUPABASE_URL and Apple Developer Service ID in your Supabase dashboard.'
      );
      return;
    }
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
    if (isConfigured) {
      await supabase.auth.signOut();
    } else {
      await SecureStoreAdapter.removeItem('vytal_mobile_auth_session');
    }
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
