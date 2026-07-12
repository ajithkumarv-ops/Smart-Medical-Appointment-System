import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { DashboardLayout, AuthLayout, PublicLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute, GuestRoute } from './ProtectedRoute';
import { LoadingScreen } from '@/components/loaders/LoadingScreen';

// ─── Lazy-loaded pages ───────────────────────────────────────────────────────
const Landing          = lazy(() => import('@/pages/Landing'));
const Login            = lazy(() => import('@/pages/auth/Login'));
const Register         = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword   = lazy(() => import('@/pages/auth/ForgotPassword'));

const AdminDashboard   = lazy(() => import('@/pages/admin/Dashboard'));
const DoctorDashboard  = lazy(() => import('@/pages/doctor/Dashboard'));
const ReceptionDashboard = lazy(() => import('@/pages/reception/Dashboard'));
const PatientDashboard = lazy(() => import('@/pages/patient/Dashboard'));

const NotFound         = lazy(() => import('@/pages/errors/NotFound'));
const ServerError      = lazy(() => import('@/pages/errors/ServerError'));

const S = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
);

// ─── Router ──────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  // ── Public ──────────────────────────────────────────────────────────────
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <S><Landing /></S> },
    ],
  },

  // ── Auth ─────────────────────────────────────────────────────────────────
  {
    element: <GuestRoute><AuthLayout /></GuestRoute>,
    children: [
      { path: '/login',           element: <S><Login /></S> },
      { path: '/register',        element: <S><Register /></S> },
      { path: '/forgot-password', element: <S><ForgotPassword /></S> },
    ],
  },

  // ── Admin ────────────────────────────────────────────────────────────────
  {
    path: '/admin',
    element: <ProtectedRoute requiredRole="admin"><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <S><AdminDashboard /></S> },
      { path: 'appointments', element: <S><AdminDashboard /></S> },
      { path: 'doctors',      element: <S><AdminDashboard /></S> },
      { path: 'patients',     element: <S><AdminDashboard /></S> },
      { path: 'departments',  element: <S><AdminDashboard /></S> },
      { path: 'staff',        element: <S><AdminDashboard /></S> },
      { path: 'billing',      element: <S><AdminDashboard /></S> },
      { path: 'reports',      element: <S><AdminDashboard /></S> },
      { path: 'analytics',    element: <S><AdminDashboard /></S> },
      { path: 'settings',     element: <S><AdminDashboard /></S> },
      { path: 'security',     element: <S><AdminDashboard /></S> },
      { path: 'activity',     element: <S><AdminDashboard /></S> },
    ],
  },

  // ── Doctor ───────────────────────────────────────────────────────────────
  {
    path: '/doctor',
    element: <ProtectedRoute requiredRole="doctor"><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <S><DoctorDashboard /></S> },
      { path: 'schedule',      element: <S><DoctorDashboard /></S> },
      { path: 'queue',         element: <S><DoctorDashboard /></S> },
      { path: 'appointments',  element: <S><DoctorDashboard /></S> },
      { path: 'patients',      element: <S><DoctorDashboard /></S> },
      { path: 'records',       element: <S><DoctorDashboard /></S> },
      { path: 'notifications', element: <S><DoctorDashboard /></S> },
      { path: 'settings',      element: <S><DoctorDashboard /></S> },
    ],
  },

  // ── Reception ────────────────────────────────────────────────────────────
  {
    path: '/reception',
    element: <ProtectedRoute requiredRole="reception"><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <S><ReceptionDashboard /></S> },
      { path: 'queue',         element: <S><ReceptionDashboard /></S> },
      { path: 'appointments',  element: <S><ReceptionDashboard /></S> },
      { path: 'checkin',       element: <S><ReceptionDashboard /></S> },
      { path: 'patients',      element: <S><ReceptionDashboard /></S> },
      { path: 'doctors',       element: <S><ReceptionDashboard /></S> },
      { path: 'settings',      element: <S><ReceptionDashboard /></S> },
    ],
  },

  // ── Patient ──────────────────────────────────────────────────────────────
  {
    path: '/patient',
    element: <ProtectedRoute requiredRole="patient"><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <S><PatientDashboard /></S> },
      { path: 'queue',         element: <S><PatientDashboard /></S> },
      { path: 'book',          element: <S><PatientDashboard /></S> },
      { path: 'appointments',  element: <S><PatientDashboard /></S> },
      { path: 'doctors',       element: <S><PatientDashboard /></S> },
      { path: 'history',       element: <S><PatientDashboard /></S> },
      { path: 'notifications', element: <S><PatientDashboard /></S> },
      { path: 'settings',      element: <S><PatientDashboard /></S> },
    ],
  },

  // ── Errors ────────────────────────────────────────────────────────────────
  { path: '/500', element: <S><ServerError /></S> },
  { path: '*',    element: <S><NotFound /></S> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
