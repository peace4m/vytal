/**
 * VYTAL Protected Route Guard
 * Enforces session authentication before granting access to personal health modules
 * and sensitive diagnostic workflows. Redirects unauthenticated users to /login.
 */

import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { VytalLogo } from '@/components/brand/VytalLogo';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <VytalLogo size="md" showTagline={false} />
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
          <span>Verifying secure session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
