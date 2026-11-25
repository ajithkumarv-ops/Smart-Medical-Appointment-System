import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { DashboardLayout, AuthLayout, PublicLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute, GuestRoute } from './ProtectedRoute';
import { LoadingScreen } from '@/components/loaders/LoadingScreen';

// ─── Lazy-loaded pages ───────────────────────────────────────────────────────
const Landing            = lazy(() => import('@/pages/Landing'));
const Login              = lazy(() => import('@/pages/auth/Login'));
const Register           = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword     = lazy(() => import('@/pages/auth/ForgotPassword'));

// Admin pages
const AdminDashboard     = lazy(() => import('@/pages/admin/Dashboard'));
const AdminAppointments   = lazy(() => import('@/pages/admin/Appointments'));
const AdminDoctors        = lazy(() => import('@/pages/admin/Doctors'));
const AdminPatients       = lazy(() => import('@/pages/admin/Patients'));
const AdminDepartments    = lazy(() => import('@/pages/admin/Departments'));
const AdminStaff          = lazy(() => import('@/pages/admin/Staff'));
const AdminBilling        = lazy(() => import('@/pages/admin/Billing'));
const AdminReports        = lazy(() => import('@/pages/admin/Reports'));
const AdminAnalytics      = lazy(() => import('@/pages/admin/Analytics'));
const AdminSettings       = lazy(() => import('@/pages/admin/Settings'));
const AdminSecurity       = lazy(() => import('@/pages/admin/Security'));
const AdminActivity       = lazy(() => import('@/pages/admin/Activity'));

// Doctor pages
const DoctorDashboard    = lazy(() => import('@/pages/doctor/Dashboard'));
const DoctorSchedule     = lazy(() => import('@/pages/doctor/Schedule'));
const DoctorQueue        = lazy(() => import('@/pages/doctor/Queue'));
const DoctorAppointments = lazy(() => import('@/pages/doctor/Appointments'));
const DoctorPatients     = lazy(() => import('@/pages/doctor/Patients'));
const DoctorRecords      = lazy(() => import('@/pages/doctor/Records'));

// Reception pages
const ReceptionDashboard = lazy(() => import('@/pages/reception/Dashboard'));
const ReceptionQueue     = lazy(() => import('@/pages/reception/Queue'));
const ReceptionAppointments = lazy(() => import('@/pages/reception/Appointments'));
const ReceptionCheckin   = lazy(() => import('@/pages/reception/Checkin'));
const ReceptionPatients  = lazy(() => import('@/pages/reception/Patients'));
const ReceptionDoctors   = lazy(() => import('@/pages/reception/Doctors'));

// Patient pages
const PatientDashboard    = lazy(() => import('@/pages/patient/Dashboard'));
const PatientQueue        = lazy(() => import('@/pages/patient/Queue'));
const PatientBook         = lazy(() => import('@/pages/patient/Book'));
const PatientAppointments = lazy(() => import('@/pages/patient/Appointments'));
const PatientDoctors      = lazy(() => import('@/pages/patient/Doctors'));
const PatientHistory      = lazy(() => import('@/pages/patient/History'));

// Shared pages
const SharedNotifications = lazy(() => import('@/pages/shared/Notifications'));
const SharedSettings      = lazy(() => import('@/pages/shared/Settings'));

// Error pages
const NotFound           = lazy(() => import('@/pages/errors/NotFound'));
const ServerError        = lazy(() => import('@/pages/errors/ServerError'));

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
      { path: 'appointments', element: <S><AdminAppointments /></S> },
      { path: 'doctors',      element: <S><AdminDoctors /></S> },
      { path: 'patients',     element: <S><AdminPatients /></S> },
      { path: 'departments',  element: <S><AdminDepartments /></S> },
      { path: 'staff',        element: <S><AdminStaff /></S> },
      { path: 'billing',      element: <S><AdminBilling /></S> },
      { path: 'reports',      element: <S><AdminReports /></S> },
      { path: 'analytics',    element: <S><AdminAnalytics /></S> },
      { path: 'settings',     element: <S><AdminSettings /></S> },
      { path: 'security',     element: <S><AdminSecurity /></S> },
      { path: 'activity',     element: <S><AdminActivity /></S> },
    ],
  },

  // ── Doctor ───────────────────────────────────────────────────────────────
  {
    path: '/doctor',
    element: <ProtectedRoute requiredRole="doctor"><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <S><DoctorDashboard /></S> },
      { path: 'schedule',      element: <S><DoctorSchedule /></S> },
      { path: 'queue',         element: <S><DoctorQueue /></S> },
      { path: 'appointments',  element: <S><DoctorAppointments /></S> },
      { path: 'patients',      element: <S><DoctorPatients /></S> },
      { path: 'records',       element: <S><DoctorRecords /></S> },
      { path: 'notifications', element: <S><SharedNotifications /></S> },
      { path: 'settings',      element: <S><SharedSettings /></S> },
    ],
  },

  // ── Reception ────────────────────────────────────────────────────────────
  {
    path: '/reception',
    element: <ProtectedRoute requiredRole="reception"><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <S><ReceptionDashboard /></S> },
      { path: 'queue',         element: <S><ReceptionQueue /></S> },
      { path: 'appointments',  element: <S><ReceptionAppointments /></S> },
      { path: 'checkin',       element: <S><ReceptionCheckin /></S> },
      { path: 'patients',      element: <S><ReceptionPatients /></S> },
      { path: 'doctors',       element: <S><ReceptionDoctors /></S> },
      { path: 'settings',      element: <S><SharedSettings /></S> },
    ],
  },

  // ── Patient ──────────────────────────────────────────────────────────────
  {
    path: '/patient',
    element: <ProtectedRoute requiredRole="patient"><DashboardLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <S><PatientDashboard /></S> },
      { path: 'queue',         element: <S><PatientQueue /></S> },
      { path: 'book',          element: <S><PatientBook /></S> },
      { path: 'appointments',  element: <S><PatientAppointments /></S> },
      { path: 'doctors',       element: <S><PatientDoctors /></S> },
      { path: 'history',       element: <S><PatientHistory /></S> },
      { path: 'notifications', element: <S><SharedNotifications /></S> },
      { path: 'settings',      element: <S><SharedSettings /></S> },
    ],
  },

  // ── Errors ────────────────────────────────────────────────────────────────
  { path: '/500', element: <S><ServerError /></S> },
  { path: '*',    element: <S><NotFound /></S> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
