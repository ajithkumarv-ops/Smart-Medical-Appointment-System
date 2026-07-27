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

  console.log(`[ProtectedRoute] Path: ${location.pathname} | isLoading: ${isLoading} | isAuthenticated: ${isAuthenticated} | user:`, user?.email);

  if (isLoading) return <LoadingScreen message="Authenticating..." />;

  if (!isAuthenticated) {
    console.log(`[ProtectedRoute] Not authenticated. Redirecting to /login from ${location.pathname}`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    const dashboardMap: Record<UserRole, string> = {
      admin: '/admin',
      doctor: '/doctor',
      reception: '/reception',
      patient: '/patient',
    };
    const target = dashboardMap[user?.role ?? 'patient'];
    console.log(`[ProtectedRoute] Role mismatch. Required: ${requiredRole}, Actual: ${user?.role}. Redirecting to ${target}`);
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log(`[GuestRoute] Path: ${location.pathname} | isLoading: ${isLoading} | isAuthenticated: ${isAuthenticated} | user:`, user?.email);

  if (isLoading) return <LoadingScreen message="Loading..." />;

  if (isAuthenticated && user) {
    const from = (location.state as any)?.from?.pathname;
    let target = '';
    
    if (from && from !== '/' && from !== '/login' && from !== '/register') {
      target = from;
    } else {
      const dashboardMap: Record<UserRole, string> = {
        admin: '/admin',
        doctor: '/doctor',
        reception: '/reception',
        patient: '/patient',
      };
      target = dashboardMap[user.role] || '/patient';
    }
    
    console.log(`[GuestRoute] Authenticated as ${user.role}. Redirecting to: ${target}`);
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
}
