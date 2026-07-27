import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Bell, Search, Sun, Moon, ChevronDown, LogOut,
  User, Settings, HelpCircle, PanelLeft,
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { useTheme } from '@/store/ThemeContext';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils';
import { dataService } from '@/lib/dataService';

interface NavbarProps {
  onMenuClick?: () => void;
  title?: string;
}

export function Navbar({ onMenuClick, title }: NavbarProps) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await dataService.getNotifications();
      setNotifications(data);
    };
    loadNotifications();
  }, []);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center px-4 lg:px-6 gap-4 shadow-sm">
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-xl text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu size={20} />
      </button>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={onMenuClick}
        className="hidden lg:flex p-2 rounded-xl text-gray-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
        aria-label="Toggle sidebar"
      >
        <PanelLeft size={18} />
      </button>

      {/* Page title */}
      {title && (
        <h1 className="hidden md:block font-display font-semibold text-gray-800 text-lg">
          {title}
        </h1>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative">
        <AnimatePresence>
          {showSearch && (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? 160 : 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              type="search"
              placeholder="Search..."
              className="absolute right-0 top-1/2 -translate-y-1/2 input-field py-2 text-sm"
              autoFocus
              onBlur={() => setShowSearch(false)}
            />
          )}
        </AnimatePresence>
        <button
          onClick={() => setShowSearch(v => !v)}
          className={cn(
            'relative z-10 p-2 rounded-xl text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors',
            showSearch && 'text-brand-600'
          )}
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-xl text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotifs(v => !v); setShowProfile(false); }}
          className="relative p-2 rounded-xl text-gray-500 hover:bg-brand-50 hover:text-brand-600 transition-colors"
          aria-label={`Notifications (${unread} unread)`}
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="notif-dot">{unread}</span>
          )}
        </button>
        <AnimatePresence>
          {showNotifs && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute -right-2 sm:right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-white rounded-2xl shadow-card-lg border border-gray-100 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <span className="badge-blue">{unread} new</span>
              </div>
              <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-5 py-6 text-center text-gray-400 text-sm">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-5 py-4 hover:bg-gray-50 transition-colors cursor-pointer',
                        !n.read && 'bg-brand-50/40'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className={cn(
                          'w-2 h-2 rounded-full mt-1.5 shrink-0',
                          n.type === 'info' && 'bg-blue-500',
                          n.type === 'warning' && 'bg-amber-500',
                          n.type === 'success' && 'bg-green-500',
                          n.type === 'error' && 'bg-red-500'
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                          <p className="text-[11px] text-gray-400 mt-1">{n.time || new Date(n.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-5 py-3 border-t border-gray-100">
                <Link
                  to="#"
                  className="text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors"
                  onClick={() => setShowNotifs(false)}
                >
                  View all notifications →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile(v => !v); setShowNotifs(false); }}
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Profile menu"
        >
          <Avatar name={user?.full_name ?? ''} size="sm" />
          <div className="hidden md:block text-left">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.full_name?.split(' ')[0]}</p>
            <p className="text-[11px] text-gray-400 capitalize">{user?.role}</p>
          </div>
          <ChevronDown size={14} className="text-gray-400 ml-0.5" />
        </button>
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-56 max-w-xs bg-white rounded-2xl shadow-card-lg border border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 border-b border-gray-100">
                <p className="font-semibold text-gray-900 text-sm">{user?.full_name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
              </div>
              <div className="py-2">
                {[
                  { label: 'My Profile',  icon: User,        path: '#' },
                  { label: 'Settings',    icon: Settings,    path: '#' },
                  { label: 'Help',        icon: HelpCircle,  path: '#' },
                ].map(item => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                    onClick={() => setShowProfile(false)}
                  >
                    <item.icon size={15} />
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="py-2 border-t border-gray-100">
                <button
                  onClick={() => { logout(); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
