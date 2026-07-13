import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/store/AuthContext';

export default function PatientQueue() {
  const { user } = useAuth();
  const [activeQueue, setActiveQueue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQueue = async () => {
      if (user) {
        const all = await dataService.getQueue();
        const mine = all.find(q => q.patient_id === user.id && q.status !== 'done' && q.status !== 'skipped');
        if (mine) {
          const waitingAhead = all.filter(q => q.status === 'waiting' && q.queue_number < mine.queue_number).length;
          setActiveQueue({
            ...mine,
            ahead: waitingAhead,
            estimated_wait: waitingAhead * 10 + 5
          });
        } else {
          setActiveQueue(null);
        }
      }
      setLoading(false);
    };
    loadQueue();
  }, [user]);

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Loading queue status...</div>;
  }

  if (!activeQueue) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 card p-8 space-y-4 bg-white rounded-3xl shadow-card border border-gray-100">
        <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto text-brand-600">
          <Clock size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">No Active Queue Token</h2>
        <p className="text-gray-500">You do not have any active check-ins right now. Book an appointment to check in and receive a queue number.</p>
      </div>
    );
  }

  const queueColor =
    activeQueue.status === 'in_progress' ? 'from-green-500 to-emerald-600' :
    activeQueue.status === 'called'      ? 'from-purple-500 to-violet-600' :
    'from-brand-500 to-brand-700';

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">My Queue Status</h1>
        <p className="page-subtitle">Live update · Refreshed automatically</p>
      </motion.div>

      {/* Big queue card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`bg-gradient-to-br ${queueColor} rounded-3xl p-8 text-white text-center shadow-2xl`}
      >
        <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-2">Your Token Number</p>
        <p className="text-8xl font-black mb-2">#{activeQueue.queue_number}</p>
        <p className="text-white/80 text-sm">{activeQueue.dept} · {activeQueue.doctor}</p>
        <div className="mt-6 bg-white/20 rounded-2xl px-6 py-3 inline-block">
          <p className="text-sm font-medium">
            {activeQueue.status === 'in_progress' ? "🟢 You're being attended to!" :
             activeQueue.status === 'called' ? '🔔 Your turn! Please proceed.' :
             `⏱ Estimated wait: ~${activeQueue.estimated_wait} minutes`}
          </p>
        </div>
      </motion.div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'People Ahead', value: activeQueue.ahead, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Est. Wait',    value: `${activeQueue.estimated_wait}m`, icon: Clock, color: 'text-brand-600', bg: 'bg-brand-50' },
        ].map((item, i) => (
          <motion.div key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="card p-5 text-center"
          >
            <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} mx-auto mb-3`}>
              <item.icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-500 mt-1">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Details */}
      <Card>
        <h3 className="font-semibold text-gray-800 mb-4">Appointment Details</h3>
        <div className="space-y-3 text-sm">
          {[
            { label: 'Doctor',     value: activeQueue.doctor },
            { label: 'Department', value: activeQueue.dept },
            { label: 'Check-In',   value: activeQueue.check_in },
            { label: 'Status',     value: activeQueue.status.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) },
          ].map(item => (
            <div key={item.label} className="flex justify-between">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 text-blue-700 text-sm">
        <AlertCircle size={16} className="mt-0.5 shrink-0" />
        <p>You will receive a notification when your turn is approaching. Please stay near the waiting area.</p>
      </div>
    </div>
  );
}
