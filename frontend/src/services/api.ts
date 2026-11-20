/**
 * VYTAL Frontend API Client
 * Manages communication with FastAPI /api/v1 endpoints and anonymous session tokens.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const SESSION_TOKEN_KEY = 'vytal_session_token';

export const getStoredSessionToken = (): string | null => {
  return localStorage.getItem(SESSION_TOKEN_KEY);
};

export const setStoredSessionToken = (token: string): void => {
  localStorage.setItem(SESSION_TOKEN_KEY, token);
};

export const clearStoredSessionToken = (): void => {
  localStorage.removeItem(SESSION_TOKEN_KEY);
};

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredSessionToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('X-Session-Token')) {
    headers.set('X-Session-Token', token);
  }

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = `Request failed with status ${response.status}`;
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.title || errorDetail;
    } catch {
      // Non-JSON response
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

// System Endpoints
export const checkHealth = async () => apiClient<{ status: string; database_connected: boolean; version: string }>('/health');

// Session Endpoints
export const createAnonymousSession = async (lang: string = 'en') => {
  const data = await apiClient<{ session_token: string; expires_at: string }>('/sessions/new', {
    method: 'POST',
    body: JSON.stringify({ preferred_language: lang }),
  });
  setStoredSessionToken(data.session_token);
  return data;
};

export const purgeSession = async (token: string) => {
  const result = await apiClient<{ status: string; message: string }>(`/sessions/${token}`, {
    method: 'DELETE',
  });
  clearStoredSessionToken();
  return result;
};
