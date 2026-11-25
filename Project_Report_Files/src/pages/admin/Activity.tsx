import { motion } from 'framer-motion';
import { Activity, Clock, User, Heart, Settings, AlertCircle } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';

export default function AdminActivity() {
  const activities = [
    { id: '1', type: 'appointment', icon: Heart, color: 'text-brand-600 bg-brand-50 border-brand-200', text: 'Dr. James Wilson completed appointment with Emily Johnson', time: '5 mins ago' },
    { id: '2', type: 'system', icon: Settings, color: 'text-purple-600 bg-purple-50 border-purple-200', text: 'System backup completed successfully', time: '30 mins ago' },
    { id: '3', type: 'user', icon: User, color: 'text-blue-600 bg-blue-50 border-blue-200', text: 'New Receptionist (Sarah Mitchell) logged in from new device', time: '1 hour ago' },
    { id: '4', type: 'queue', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200', text: 'Live queue check-in for Michael Brown under Neurology', time: '2 hours ago' },
    { id: '5', type: 'warning', icon: AlertCircle, color: 'text-red-600 bg-red-50 border-red-200', text: 'API Gateway latencies above 500ms warning triggered', time: '4 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">System Activity Log</h1>
        <p className="page-subtitle">Real-time log of administrative and clinical events</p>
      </motion.div>

      <Card>
        <CardHeader title="Real-Time Event Stream" subtitle="Showing latest system notifications and logs" icon={<Activity size={18} />} />
        <div className="space-y-6 relative before:absolute before:top-4 before:bottom-4 before:left-[21px] before:w-0.5 before:bg-gray-100">
          {activities.map((act, i) => {
            const Icon = act.icon;
            return (
              <motion.div 
                key={act.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 relative z-10"
              >
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${act.color}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0 pt-1.5">
                  <p className="text-sm font-medium text-gray-800 leading-normal">{act.text}</p>
                  <p className="text-xs text-gray-400 mt-1 font-medium flex items-center gap-1">
                    <Clock size={12} />
                    {act.time}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
