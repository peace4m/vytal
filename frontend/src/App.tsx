import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignUpPage } from '@/pages/auth/SignUpPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { ProfilePage } from '@/pages/auth/ProfilePage';

import { ReportExplainerPage } from '@/pages/ReportExplainerPage';
import { IDRSPage } from '@/pages/IDRSPage';
import { SymptomTriagePage } from '@/pages/SymptomTriagePage';
import { MedicationCheckerPage } from '@/pages/MedicationCheckerPage';
import { HealthSummaryPage } from '@/pages/HealthSummaryPage';
import { ResearchDashboardPage } from '@/pages/ResearchDashboardPage';
import { AboutPage } from '@/pages/AboutPage';
import { SafetyPage } from '@/pages/SafetyPage';
import { PrivacyPage } from '@/pages/PrivacyPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <HashRouter>
            <AppLayout>
              <Routes>
                {/* Public Access Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/safety" element={<SafetyPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />

                {/* Protected Healthcare & Personal Health Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/research-dashboard" element={<ResearchDashboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/account" element={<ProfilePage />} />
                  <Route path="/modules/report-explainer" element={<ReportExplainerPage />} />
                  <Route path="/modules/risk-score" element={<IDRSPage />} />
                  <Route path="/modules/symptom-triage" element={<SymptomTriagePage />} />
                  <Route path="/modules/medication-check" element={<MedicationCheckerPage />} />
                  <Route path="/modules/health-summary" element={<HealthSummaryPage />} />
                </Route>
              </Routes>
            </AppLayout>
          </HashRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
