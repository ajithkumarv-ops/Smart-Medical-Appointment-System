import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Activity } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { dataService } from '@/lib/dataService';

const MONTHLY = [
  { month: 'Jan', appointments: 280, revenue: 42000, patients: 210 },
  { month: 'Feb', appointments: 310, revenue: 47000, patients: 240 },
  { month: 'Mar', appointments: 295, revenue: 44500, patients: 225 },
  { month: 'Apr', appointments: 340, revenue: 51000, patients: 270 },
  { month: 'May', appointments: 380, revenue: 57000, patients: 300 },
  { month: 'Jun', appointments: 420, revenue: 63000, patients: 340 },
];

const maxAppointments = Math.max(...MONTHLY.map(m => m.appointments));

export default function AdminAnalytics() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [depts, docs] = await Promise.all([
          dataService.getDepartments(),
          dataService.getDoctors(),
        ]);
        setDepartments(depts);
        setDoctors(docs);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Hospital performance metrics and trends</p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Appointment Growth', value: '+14.2%',  icon: TrendingUp,  color: 'text-green-600',  bg: 'bg-green-50' },
          { label: 'Patient Retention',  value: '87.5%',   icon: Users,       color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'Avg Daily Appts',    value: '37',       icon: Calendar,    color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Revenue Growth',     value: '+18.3%',  icon: DollarSign,  color: 'text-emerald-600',bg: 'bg-emerald-50' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color} mb-3`}>
              <kpi.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Bar Chart – Appointments by Month */}
      <Card>
        <CardHeader title="Monthly Appointments" subtitle="Jan – Jun 2024" icon={<BarChart3 size={18} />} />
        <div className="flex items-end gap-3 h-48">
          {MONTHLY.map((m, i) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(m.appointments / maxAppointments) * 100}%` }}
                transition={{ delay: i * 0.08, duration: 0.6, ease: 'easeOut' }}
                className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 relative group cursor-pointer"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {m.appointments} appts
                </div>
              </motion.div>
              <span className="text-xs text-gray-500 font-medium">{m.month}</span>
            </div>
          ))}
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading analytics...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader title="Department Performance" subtitle="Patients today" icon={<Activity size={18} />} />
            <div className="space-y-3">
              {departments.map((dept, i) => {
                const pct = Math.round(((dept.patients_today || 0) / 100) * 100);
                return (
                  <motion.div key={dept.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{dept.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{dept.patients_today || 0}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(pct, 100)}%` }}
                        transition={{ delay: 0.4 + i * 0.06, duration: 0.6 }}
                        className={`h-full rounded-full bg-gradient-to-r ${dept.color || 'from-brand-500 to-brand-600'}`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          <Card>
            <CardHeader title="Top Doctors" subtitle="By patient count today" icon={<Users size={18} />} />
            <div className="space-y-3">
              {[...doctors].sort((a, b) => (b.patients_today || 0) - (a.patients_today || 0)).slice(0, 5).map((doc, i) => (
                <motion.div key={doc.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-yellow-400 text-white' : i === 1 ? 'bg-gray-300 text-white' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{doc.full_name}</p>
                    <p className="text-xs text-gray-400">{doc.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-600">{doc.patients_today || 0}</p>
                    <p className="text-xs text-gray-400">patients</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
