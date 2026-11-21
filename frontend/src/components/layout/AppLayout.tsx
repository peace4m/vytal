import React from 'react';
import { SafetyBanner } from './SafetyBanner';
import { Header } from './Header';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <SafetyBanner />
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};
