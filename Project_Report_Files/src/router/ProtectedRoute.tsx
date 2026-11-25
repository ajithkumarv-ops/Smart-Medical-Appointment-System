import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { LoadingScreen } from '@/components/loaders/LoadingScreen';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen message="Authenticating..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to appropriate dashboard
    const dashboardMap: Record<UserRole, string> = {
      admin: '/admin',
      doctor: '/doctor',
      reception: '/reception',
      patient: '/patient',
    };
    return <Navigate to={dashboardMap[user?.role ?? 'patient']} replace />;
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen message="Loading..." />;

  if (isAuthenticated && user) {
    const dashboardMap: Record<UserRole, string> = {
      admin: '/admin',
      doctor: '/doctor',
      reception: '/reception',
      patient: '/patient',
    };
    return <Navigate to={dashboardMap[user.role]} replace />;
  }

  return <>{children}</>;
}
