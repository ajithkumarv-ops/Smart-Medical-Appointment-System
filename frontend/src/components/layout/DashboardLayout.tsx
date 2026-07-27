import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { cn } from '@/utils';

export function DashboardLayout() {
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[var(--color-bg)] overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar — always rendered, translated on mobile */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0 transition-transform duration-300 shrink-0',
          collapsed ? 'lg:w-[72px]' : 'lg:w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <Sidebar
          isCollapsed={collapsed}
          onToggle={() => setCollapsed(v => !v)}
          onNavClick={() => setMobileOpen(false)}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setMobileOpen(v => !v)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// ─── Public layout ──────────────────────────────────────────────────────────
export function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Outlet />
    </div>
  );
}

// ─── Auth layout ───────────────────────────────────────────────────────────
export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-hero overflow-hidden flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <div className="relative w-5 h-5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-full bg-white rounded-full" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <span className="font-display text-xl font-bold text-white">
              Medi<span className="text-blue-300">Queue</span>
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-3xl font-bold text-white leading-tight mb-4">
              Premium Healthcare<br />Management System
            </h2>
            <p className="text-blue-200 text-base leading-relaxed">
              Streamline appointments, manage queues, and deliver exceptional patient care with our intelligent medical platform.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 grid grid-cols-3 gap-4"
        >
          {[
            { value: '50K+', label: 'Patients' },
            { value: '200+', label: 'Doctors' },
            { value: '99.9%', label: 'Uptime' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-4 text-center">
              <p className="font-display text-2xl font-bold text-white">{s.value}</p>
              <p className="text-blue-300 text-xs font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gradient-light overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
