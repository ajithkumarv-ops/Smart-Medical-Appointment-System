import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, ArrowRight, Users } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { dataService } from '@/lib/dataService';

const statusStyle: Record<string, { bg: string; text: string; label: string }> = {
  done:        { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Done' },
  in_progress: { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'In Progress' },
  called:      { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Called' },
  waiting:     { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Waiting' },
  skipped:     { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Skipped' },
};

export default function DoctorQueue() {
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    const data = await dataService.getQueue();
    // Filter to doctor James Wilson
    const docQueue = data.filter(q => q.doctor === 'Dr. James Wilson');
    setQueue(docQueue);
  };

  const callNext = async () => {
    const waitIdx = queue.findIndex(q => q.status === 'waiting');
    if (waitIdx !== -1) {
      const item = queue[waitIdx];
      const success = await dataService.updateQueueStatus(item.id, 'called');
      if (success) {
        loadQueue();
      }
    }
  };

  const markDone = async (id: string) => {
    const success = await dataService.updateQueueStatus(id, 'done');
    if (success) {
      loadQueue();
    }
  };

  const current = queue.find(q => q.status === 'in_progress' || q.status === 'called');
  const waiting = queue.filter(q => q.status === 'waiting').length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Live Queue</h1>
          <p className="page-subtitle">{waiting} patients waiting</p>
        </div>
        <Button onClick={callNext} leftIcon={<ArrowRight size={16} />}>Call Next</Button>
      </motion.div>

      {/* Current patient */}
      {current && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          className="card p-6 border-2 border-brand-300 bg-brand-50/30">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-3">Currently With</p>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-2xl font-bold">
              #{current.queue_number}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{current.patient}</h2>
              <p className="text-gray-500 text-sm">{current.dept} · Check-in: {current.check_in}</p>
            </div>
            <Button onClick={() => markDone(current.id)} leftIcon={<CheckCircle size={16} />} variant="secondary">
              Mark Done
            </Button>
          </div>
        </motion.div>
      )}

      {/* Queue list */}
      <Card>
        <CardHeader title="Queue" subtitle={`${queue.length} total entries`} icon={<Users size={18} />} />
        <div className="space-y-2">
          {queue.map((entry, i) => {
            const s = statusStyle[entry.status] ?? statusStyle.waiting;
            return (
              <motion.div key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${entry.status === 'done' ? 'opacity-50' : 'hover:bg-gray-50'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${entry.status === 'done' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  #{entry.queue_number}
                </div>
                <Avatar name={entry.patient} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{entry.patient}</p>
                  <p className="text-xs text-gray-500">{entry.dept} · {entry.check_in}</p>
                </div>
                {entry.wait > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={12} />
                    ~{entry.wait} min
                  </div>
                )}
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>{s.label}</span>
                {entry.status !== 'done' && (
                  <button
                    onClick={() => markDone(entry.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                    title="Mark done"
                  >
                    <CheckCircle size={14} />
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
