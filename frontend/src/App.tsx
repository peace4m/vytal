import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';

import { LandingPage } from '@/pages/LandingPage';
import { DashboardPage } from '@/pages/DashboardPage';
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
      <HashRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* The 5 Mandatory Modules in Strict Sequence */}
            <Route path="/modules/report-explainer" element={<ReportExplainerPage />} />
            <Route path="/modules/risk-score" element={<IDRSPage />} />
            <Route path="/modules/symptom-triage" element={<SymptomTriagePage />} />
            <Route path="/modules/medication-check" element={<MedicationCheckerPage />} />
            <Route path="/modules/health-summary" element={<HealthSummaryPage />} />
            {/* Research & Meta Pages */}
            <Route path="/research-dashboard" element={<ResearchDashboardPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Routes>
        </AppLayout>
      </HashRouter>
    </QueryClientProvider>
  );
};

export default App;
