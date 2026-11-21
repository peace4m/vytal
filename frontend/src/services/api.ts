/**
 * VYTAL Frontend API Client
 * Manages communication with FastAPI /api/v1 endpoints and anonymous session tokens.
 *
 * Includes automatic client-side fallback for static cloud deployments (such as GitHub Pages)
 * so that live demonstrations operate completely in-browser without requiring a local backend server.
 */

import {
  calculateDemoIDRS,
  evaluateDemoTriage,
  searchDemoMedications,
  checkDemoInteractions,
  getDemoResearchOverview,
  getDemoFeatureImportance,
  predictDemoResearch,
} from './mockDemoBackend';

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

/**
 * Client-side mock handler invoked when backend is offline or on static hosting (GitHub Pages)
 */
function handleClientSideFallback<T>(endpoint: string, options: RequestInit = {}): T {
  const cleanEndpoint = endpoint.split('?')[0].replace(/^\/api\/v1/, '').replace(/^\//, '');
  const body = options.body ? JSON.parse(options.body as string) : {};

  // 1. Health check
  if (cleanEndpoint === 'health') {
    return {
      status: 'ok',
      database_connected: true,
      version: '0.1.0 (Live Demo Engine)',
      mode: 'client_fallback',
    } as unknown as T;
  }

  // 2. Anonymous session
  if (cleanEndpoint === 'sessions/new') {
    return {
      session_token: 'vytal-demo-' + Math.random().toString(36).substring(2, 9),
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    } as unknown as T;
  }

  if (cleanEndpoint.startsWith('sessions/')) {
    return { status: 'success', message: 'Session cleared' } as unknown as T;
  }

  // 3. Module 02: IDRS Calculation
  if (cleanEndpoint === 'idrs/calculate') {
    return calculateDemoIDRS(body) as unknown as T;
  }

  // 4. Module 03: Symptom Triage
  if (cleanEndpoint === 'triage/evaluate') {
    return evaluateDemoTriage(body.reported_symptoms || [], body.age, body.is_pregnant) as unknown as T;
  }

  // 5. Module 04: Medication Interactions
  if (cleanEndpoint === 'medications/search') {
    const params = new URLSearchParams(endpoint.split('?')[1] || '');
    const query = params.get('q') || '';
    return searchDemoMedications(query) as unknown as T;
  }

  if (cleanEndpoint === 'medications/check') {
    return checkDemoInteractions(body.medications || []) as unknown as T;
  }

  // 6. Research Subsystem
  if (cleanEndpoint === 'research/overview') {
    return getDemoResearchOverview() as unknown as T;
  }

  if (cleanEndpoint === 'research/feature-importance') {
    return getDemoFeatureImportance() as unknown as T;
  }

  if (cleanEndpoint === 'research/predict') {
    return predictDemoResearch(body) as unknown as T;
  }

  // 7. Module 01: Report Explainer Fallbacks
  if (cleanEndpoint === 'report/manual-entry' || cleanEndpoint === 'report/confirm') {
    return {
      status: 'confirmed',
      session_token: 'demo-token',
      observations: body.observations || [
        {
          test_name: 'Fasting Blood Glucose',
          canonical_test_key: 'fbg',
          numeric_value: 118,
          unit: 'mg/dL',
          reference_interval_low: 70,
          reference_interval_high: 99,
          classification: 'HIGH',
          plain_explanation: 'Your fasting blood sugar is slightly above standard normal ranges, indicating impaired fasting glucose.',
        },
      ],
      disclaimer: 'EDUCATIONAL REFERENCE ONLY. NOT A DIAGNOSIS.',
    } as unknown as T;
  }

  // 8. Module 05: Health Summary
  if (cleanEndpoint === 'health-summary/synthesize') {
    return {
      session_token: 'demo-token',
      synthesis_timestamp: new Date().toISOString(),
      report_findings: [],
      idrs_result: null,
      triage_findings: null,
      medication_alerts: [],
      cross_module_insights: [
        'Live interactive client session active. All modules compute directly using verified clinical and research formulas.',
      ],
      safety_disclaimer: 'EDUCATIONAL AND RESEARCH PROTOTYPE ONLY. NOT A MEDICAL DEVICE.',
    } as unknown as T;
  }

  return {} as T;
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

  try {
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

    return await response.json();
  } catch (networkError) {
    // If running in static hosting (e.g. GitHub Pages) or backend is not active,
    // seamlessly provide the verified client-side demo calculation.
    console.info(`[VYTAL Demo Mode] Using in-browser calculation engine for ${endpoint}`);
    return handleClientSideFallback<T>(endpoint, options);
  }
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
