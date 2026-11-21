/**
 * VYTAL Supabase Client & Authentication Service
 * Manages official Supabase Auth for web, supporting email/password,
 * Google OAuth, Apple Sign-In, email verification, and session persistence.
 *
 * Includes an in-browser storage adapter to provide full functionality during
 * local development and static demonstrations when external Supabase keys are pending.
 */

import { createClient, SupabaseClient, User, Session, AuthError } from '@supabase/supabase-js';

export const VITE_SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || '';
export const VITE_SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    VITE_SUPABASE_URL &&
    VITE_SUPABASE_ANON_KEY &&
    !VITE_SUPABASE_URL.includes('placeholder') &&
    !VITE_SUPABASE_ANON_KEY.includes('placeholder')
  );
};

// Fallback dummy client placeholder if unconfigured, or genuine client if configured
export const supabase: SupabaseClient = isSupabaseConfigured()
  ? createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : createClient(
      'https://placeholder-vytal.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

// =========================================================================
// LOCAL OFFLINE AUTH ENGINE (Used when Supabase credentials are not yet configured)
// =========================================================================

const LOCAL_USERS_KEY = 'vytal_local_auth_users';
const LOCAL_SESSION_KEY = 'vytal_local_auth_session';

export interface StoredLocalUser {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string; // Base64 simple hash for local simulation
  preferredLanguage: string;
  preferredTheme: string;
  emailConfirmed: boolean;
  createdAt: string;
}

function getLocalUsers(): StoredLocalUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalUsers(users: StoredLocalUser[]): void {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function createLocalJwt(user: StoredLocalUser): string {
  // Generates HS256 base64 token compatible with backend/app/api/deps.py
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      aud: 'authenticated',
      role: 'authenticated',
      exp: Math.floor(Date.now() / 1000) + 86400, // 24h
      user_metadata: {
        full_name: user.fullName,
        preferred_language: user.preferredLanguage,
        preferred_theme: user.preferredTheme,
      },
    })
  );
  const signature = btoa('vytal-local-dev-signature');
  return `${header}.${payload}.${signature}`;
}

export const localAuthService = {
  getCurrentSession(): Session | null {
    try {
      const raw = localStorage.getItem(LOCAL_SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      // Clear legacy temporary demo session so every visitor starts with their own fresh account
      if (parsed.user?.id === 'usr_demo_clinician') {
        localStorage.removeItem(LOCAL_SESSION_KEY);
        return null;
      }
      // Validate expiration
      if (parsed.expires_at && parsed.expires_at * 1000 < Date.now()) {
        localStorage.removeItem(LOCAL_SESSION_KEY);
        return null;
      }
      return parsed as Session;
    } catch {
      return null;
    }
  },

  signUp(
    email: string,
    password: string,
    fullName: string,
    preferredLanguage: string = 'en'
  ): { user: User | null; session: Session | null; error: AuthError | null } {
    const users = getLocalUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return {
        user: null,
        session: null,
        error: {
          name: 'AuthApiError',
          message: 'An account with this email address already exists. Please log in.',
          status: 409,
        } as AuthError,
      };
    }

    const newUser: StoredLocalUser = {
      id: `usr_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`,
      email: email.toLowerCase().trim(),
      fullName: fullName.trim(),
      passwordHash: btoa(password),
      preferredLanguage,
      preferredTheme: 'system',
      emailConfirmed: true, // Auto-confirm in demo mode
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveLocalUsers(users);

    const token = createLocalJwt(newUser);
    const session: Session = {
      access_token: token,
      refresh_token: `ref_${Math.random().toString(36).substring(2)}`,
      expires_in: 86400,
      expires_at: Math.floor(Date.now() / 1000) + 86400,
      token_type: 'bearer',
      user: {
        id: newUser.id,
        app_metadata: { provider: 'email' },
        user_metadata: {
          full_name: newUser.fullName,
          preferred_language: newUser.preferredLanguage,
          preferred_theme: newUser.preferredTheme,
        },
        aud: 'authenticated',
        email: newUser.email,
        created_at: newUser.createdAt,
        confirmed_at: newUser.createdAt,
        email_confirmed_at: newUser.createdAt,
      } as unknown as User,
    };

    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));

    return { user: session.user, session, error: null };
  },

  signIn(
    email: string,
    password: string
  ): { user: User | null; session: Session | null; error: AuthError | null } {
    const users = getLocalUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!found || found.passwordHash !== btoa(password)) {
      return {
        user: null,
        session: null,
        error: {
          name: 'AuthApiError',
          message: 'Invalid email or password. Please verify your credentials.',
          status: 400,
        } as AuthError,
      };
    }

    const token = createLocalJwt(found);
    const session: Session = {
      access_token: token,
      refresh_token: `ref_${Math.random().toString(36).substring(2)}`,
      expires_in: 86400,
      expires_at: Math.floor(Date.now() / 1000) + 86400,
      token_type: 'bearer',
      user: {
        id: found.id,
        app_metadata: { provider: 'email' },
        user_metadata: {
          full_name: found.fullName,
          preferred_language: found.preferredLanguage,
          preferred_theme: found.preferredTheme,
        },
        aud: 'authenticated',
        email: found.email,
        created_at: found.createdAt,
        confirmed_at: found.createdAt,
        email_confirmed_at: found.createdAt,
      } as unknown as User,
    };

    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));
    return { user: session.user, session, error: null };
  },

  signOut(): void {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  },

  updateUser(updates: {
    fullName?: string;
    preferredLanguage?: string;
    preferredTheme?: string;
    password?: string;
  }): { user: User | null; error: AuthError | null } {
    const session = this.getCurrentSession();
    if (!session || !session.user) {
      return {
        user: null,
        error: { name: 'AuthApiError', message: 'No active session to update.', status: 401 } as AuthError,
      };
    }

    const users = getLocalUsers();
    const userIndex = users.findIndex((u) => u.id === session.user.id);
    if (userIndex === -1) {
      return {
        user: null,
        error: { name: 'AuthApiError', message: 'User record not found.', status: 404 } as AuthError,
      };
    }

    if (updates.fullName) users[userIndex].fullName = updates.fullName;
    if (updates.preferredLanguage) users[userIndex].preferredLanguage = updates.preferredLanguage;
    if (updates.preferredTheme) users[userIndex].preferredTheme = updates.preferredTheme;
    if (updates.password) users[userIndex].passwordHash = btoa(updates.password);

    saveLocalUsers(users);

    // Update current session
    const updatedUser = users[userIndex];
    session.user.user_metadata = {
      ...session.user.user_metadata,
      full_name: updatedUser.fullName,
      preferred_language: updatedUser.preferredLanguage,
      preferred_theme: updatedUser.preferredTheme,
    };
    session.access_token = createLocalJwt(updatedUser);
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(session));

    return { user: session.user, error: null };
  },

  deleteAccount(): void {
    const session = this.getCurrentSession();
    if (!session || !session.user) return;
    const users = getLocalUsers().filter((u) => u.id !== session.user.id);
    saveLocalUsers(users);
    localStorage.removeItem(LOCAL_SESSION_KEY);
  },
};
