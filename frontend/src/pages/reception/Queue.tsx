import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle, SkipForward, Bell, Activity } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { dataService } from '@/lib/dataService';

const statusStyle: Record<string, { bg: string; text: string; dot: string }> = {
  done:        { bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
  in_progress: { bg: 'bg-blue-100',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  called:      { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  waiting:     { bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  skipped:     { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
};

export default function ReceptionQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [qData, dData] = await Promise.all([
        dataService.getQueue(),
        dataService.getDepartments()
      ]);
      setQueue(qData);
      setDepartments(dData);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const callNext = async () => {
    const waitIdx = queue.findIndex(q => q.status === 'waiting');
    if (waitIdx === -1) return;
    const nextInLine = queue[waitIdx];
    try {
      await dataService.updateQueueStatus(nextInLine.id, 'called');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await dataService.updateQueueStatus(id, status);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const waiting = queue.filter(q => q.status === 'waiting').length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Live Queue</h1>
          <p className="page-subtitle">{waiting} patients waiting · Updated just now</p>
        </div>
        <Button onClick={callNext} leftIcon={<Bell size={16} />}>Announce Next</Button>
      </motion.div>

      {/* Department queue summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {departments.slice(0, 4).map((dept, i) => (
          <motion.div key={dept.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{dept.icon}</span>
              <span className="text-xs font-semibold text-gray-700 truncate">{dept.name}</span>
            </div>
            <p className="text-2xl font-bold text-brand-600">{Math.floor((dept.patients_today || 0) / 10)}</p>
            <p className="text-xs text-gray-400">in queue</p>
          </motion.div>
        ))}
      </div>

      {/* Full queue table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading queue...</div>
      ) : (
        <Card>
          <CardHeader title="All Queues" subtitle={`${queue.length} total entries`} icon={<Activity size={18} />} />
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  {['#', 'Patient', 'Doctor', 'Department', 'Check-in', 'Wait', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {queue.map((entry, i) => {
                  const s = statusStyle[entry.status] ?? statusStyle.waiting;
                  return (
                    <motion.tr key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                          {entry.queue_number}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={entry.patient} size="sm" />
                          <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{entry.patient}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-600 whitespace-nowrap">{entry.doctor}</td>
                      <td className="px-6 py-3.5"><span className="badge-blue text-xs">{entry.dept}</span></td>
                      <td className="px-6 py-3.5 text-sm text-gray-500">{entry.check_in}</td>
                      <td className="px-6 py-3.5">
                        {entry.wait > 0 ? (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock size={12} className="text-gray-400" />
                            ~{entry.wait}m
                          </div>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {entry.status.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex gap-1">
                          <button
                            onClick={() => updateStatus(entry.id, 'called')}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            title="Call"
                          ><ArrowRight size={14} /></button>
                          <button
                            onClick={() => updateStatus(entry.id, 'done')}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                            title="Mark done"
                          ><CheckCircle size={14} /></button>
                          <button
                            onClick={() => updateStatus(entry.id, 'skipped')}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Skip"
                          ><SkipForward size={14} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
