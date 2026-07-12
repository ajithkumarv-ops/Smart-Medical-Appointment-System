import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Calendar, Users, UserCheck, Stethoscope,
  ClipboardList, BarChart3, Settings, LogOut, ChevronLeft,
  Hospital, Activity, Bell, FileText, CreditCard, Clock,
  ShieldCheck, UserCog, Layers,
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils';
import type { UserRole } from '@/types';

// ─── Nav config per role ─────────────────────────────────────────────────────
const navConfig: Record<UserRole, Array<{
  group: string;
  items: Array<{ label: string; path: string; icon: React.ElementType; badge?: number }>;
}>> = {
  admin: [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard',    path: '/admin',              icon: LayoutDashboard },
        { label: 'Analytics',    path: '/admin/analytics',    icon: BarChart3 },
        { label: 'Activity',     path: '/admin/activity',     icon: Activity },
      ],
    },
    {
      group: 'Management',
      items: [
        { label: 'Appointments', path: '/admin/appointments', icon: Calendar, badge: 5 },
        { label: 'Doctors',      path: '/admin/doctors',      icon: Stethoscope },
        { label: 'Patients',     path: '/admin/patients',     icon: Users },
        { label: 'Departments',  path: '/admin/departments',  icon: Layers },
        { label: 'Staff',        path: '/admin/staff',        icon: UserCog },
      ],
    },
    {
      group: 'Finance',
      items: [
        { label: 'Billing',      path: '/admin/billing',      icon: CreditCard },
        { label: 'Reports',      path: '/admin/reports',      icon: FileText },
      ],
    },
    {
      group: 'System',
      items: [
        { label: 'Settings',     path: '/admin/settings',     icon: Settings },
        { label: 'Security',     path: '/admin/security',     icon: ShieldCheck },
      ],
    },
  ],
  doctor: [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard',    path: '/doctor',             icon: LayoutDashboard },
        { label: 'My Schedule',  path: '/doctor/schedule',    icon: Calendar },
      ],
    },
    {
      group: 'Appointments',
      items: [
        { label: 'Queue',        path: '/doctor/queue',       icon: Clock, badge: 3 },
        { label: 'Appointments', path: '/doctor/appointments',icon: ClipboardList },
        { label: 'Patients',     path: '/doctor/patients',    icon: Users },
      ],
    },
    {
      group: 'Records',
      items: [
        { label: 'Medical Records', path: '/doctor/records', icon: FileText },
        { label: 'Notifications',   path: '/doctor/notifications', icon: Bell, badge: 2 },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Settings',     path: '/doctor/settings',    icon: Settings },
      ],
    },
  ],
  reception: [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard',    path: '/reception',               icon: LayoutDashboard },
        { label: 'Live Queue',   path: '/reception/queue',         icon: Clock, badge: 8 },
      ],
    },
    {
      group: 'Management',
      items: [
        { label: 'Appointments', path: '/reception/appointments',  icon: Calendar },
        { label: 'Check-in',     path: '/reception/checkin',       icon: UserCheck },
        { label: 'Patients',     path: '/reception/patients',      icon: Users },
        { label: 'Doctors',      path: '/reception/doctors',       icon: Stethoscope },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Settings',     path: '/reception/settings',      icon: Settings },
      ],
    },
  ],
  patient: [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard',    path: '/patient',                 icon: LayoutDashboard },
        { label: 'My Queue',     path: '/patient/queue',           icon: Clock },
      ],
    },
    {
      group: 'Appointments',
      items: [
        { label: 'Book',         path: '/patient/book',            icon: Calendar },
        { label: 'My Appointments', path: '/patient/appointments', icon: ClipboardList },
        { label: 'Doctors',      path: '/patient/doctors',         icon: Stethoscope },
      ],
    },
    {
      group: 'Health',
      items: [
        { label: 'Medical History', path: '/patient/history',     icon: FileText },
        { label: 'Notifications',   path: '/patient/notifications',icon: Bell },
      ],
    },
    {
      group: 'Account',
      items: [
        { label: 'Settings',     path: '/patient/settings',        icon: Settings },
      ],
    },
  ],
};

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const role = user?.role ?? 'patient';
  const groups = navConfig[role] ?? navConfig.patient;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login');
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="sidebar no-scrollbar overflow-y-auto overflow-x-hidden"
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-gray-100 shrink-0',
        isCollapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-brand shrink-0 shadow-brand">
          <Hospital size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="font-display font-bold text-brand-900 text-lg leading-none">
                Medi<span className="text-brand-500">Queue</span>
              </p>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
                Medical System
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className={cn(
            'ml-auto text-gray-400 hover:text-brand-600 transition-colors p-1 rounded-lg hover:bg-brand-50',
            isCollapsed && 'hidden'
          )}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-4 space-y-6" aria-label="Main navigation">
        {groups.map(group => (
          <div key={group.group}>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-4 mb-2"
                >
                  {group.group}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === `/${role}` || item.path === '/admin'}
                  className={({ isActive }: { isActive: boolean }) =>
                    cn(
                      'nav-item relative',
                      isActive && 'active',
                      isCollapsed && 'justify-center px-0'
                    )
                  }
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="shrink-0" />
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {item.badge && !isCollapsed && (
                    <span className="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  {item.badge && isCollapsed && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User profile footer */}
      <div className={cn(
        'border-t border-gray-100 p-3 shrink-0',
        isCollapsed ? 'flex justify-center' : ''
      )}>
        {isCollapsed ? (
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Avatar name={user?.full_name ?? ''} size="sm" online={true} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{user?.full_name}</p>
              <p className="text-[11px] text-gray-400 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
              aria-label="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
