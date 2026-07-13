import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, Info, CheckCircle, AlertTriangle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NOTIFICATIONS } from '@/lib/mockData';

const typeIcon: Record<string, { icon: typeof Info; color: string; bg: string }> = {
  info:    { icon: Info,          color: 'text-blue-600',  bg: 'bg-blue-100' },
  success: { icon: CheckCircle,   color: 'text-green-600', bg: 'bg-green-100' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
  error:   { icon: XCircle,       color: 'text-red-600',   bg: 'bg-red-100' },
};

export default function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotif = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unread} unread notification{unread !== 1 ? 's' : ''}</p>
        </div>
        {unread > 0 && (
          <Button variant="secondary" size="sm" leftIcon={<CheckCheck size={14} />} onClick={markAllRead}>
            Mark All Read
          </Button>
        )}
      </motion.div>

      <div className="space-y-3">
        {notifs.map((notif, i) => {
          const { icon: Icon, color, bg } = typeIcon[notif.type] ?? typeIcon.info;
          return (
            <motion.div key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`card p-4 flex items-start gap-4 transition-all ${!notif.read ? 'border-l-4 border-brand-500 bg-brand-50/20' : ''}`}
              onClick={() => markRead(notif.id)}
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={18} className={color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-700'}`}>
                    {notif.title}
                    {!notif.read && <span className="ml-2 inline-flex w-2 h-2 bg-brand-500 rounded-full" />}
                  </p>
                  <button onClick={e => { e.stopPropagation(); deleteNotif(notif.id); }}
                    className="p-1 text-gray-300 hover:text-red-400 transition-colors shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1.5">{notif.time}</p>
              </div>
            </motion.div>
          );
        })}

        {notifs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Bell size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
