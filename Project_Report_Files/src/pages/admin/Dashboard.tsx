import { motion } from 'framer-motion';
import {
  Users, Calendar, DollarSign, Activity,
  Stethoscope, AlertCircle, CheckCircle, Clock, BarChart3, RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { getGreeting, formatDate } from '@/utils';

// ─── Mock data ────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Total Patients',    value: 12847, icon: Users,       color: 'from-blue-500 to-blue-600',   trend: { value: 12, label: 'vs last month' } },
  { label: "Today's Appts",     value: 184,   icon: Calendar,    color: 'from-teal-500 to-teal-600',   trend: { value: 8, label: 'vs yesterday' } },
  { label: 'Active Doctors',    value: 47,    icon: Stethoscope, color: 'from-purple-500 to-purple-600',trend: { value: 3, label: 'new this week' } },
  { label: "Revenue Today",     value: '$24,850', icon: DollarSign, color: 'from-green-500 to-green-600', trend: { value: 15, label: 'vs avg' } },
  { label: 'Avg Wait Time',     value: '12 min', icon: Clock,   color: 'from-orange-500 to-orange-600',trend: { value: -18, label: 'improved' } },
  { label: 'Completed Today',   value: 96,    icon: CheckCircle, color: 'from-emerald-500 to-emerald-600',trend: { value: 5, label: 'vs yesterday' } },
  { label: 'Cancelled',         value: 8,     icon: AlertCircle, color: 'from-red-500 to-red-600',     trend: { value: -3, label: 'vs avg' } },
  { label: 'Patient Satisfaction',value: '96%',icon: Activity,   color: 'from-indigo-500 to-indigo-600',trend: { value: 2, label: 'this month' } },
];

const RECENT_APPOINTMENTS = [
  { id: 'A001', patient: 'Emily Johnson',  doctor: 'Dr. James Wilson',   dept: 'Cardiology',   time: '09:00 AM', status: 'completed',   avatar: '' },
  { id: 'A002', patient: 'Michael Brown',  doctor: 'Dr. Sarah Lee',      dept: 'Neurology',    time: '10:30 AM', status: 'in_progress', avatar: '' },
  { id: 'A003', patient: 'Jessica Davis',  doctor: 'Dr. Mark Thompson',  dept: 'Orthopedics',  time: '11:00 AM', status: 'confirmed',   avatar: '' },
  { id: 'A004', patient: 'Robert Wilson',  doctor: 'Dr. Anna Chen',      dept: 'Dermatology',  time: '01:15 PM', status: 'scheduled',   avatar: '' },
  { id: 'A005', patient: 'Linda Martinez', doctor: 'Dr. John Smith',     dept: 'General',      time: '02:30 PM', status: 'cancelled',   avatar: '' },
];

const ACTIVE_DOCTORS = [
  { name: 'Dr. James Wilson',  specialty: 'Cardiology',   patients: 12, available: true  },
  { name: 'Dr. Sarah Lee',     specialty: 'Neurology',    patients: 8,  available: true  },
  { name: 'Dr. Mark Thompson', specialty: 'Orthopedics',  patients: 15, available: false },
  { name: 'Dr. Anna Chen',     specialty: 'Dermatology',  patients: 6,  available: true  },
];

const DEPT_QUEUE = [
  { dept: 'Emergency',    waiting: 8,  avg: '5 min',  color: 'bg-red-500',    pct: 80 },
  { dept: 'Cardiology',   waiting: 12, avg: '18 min', color: 'bg-blue-500',   pct: 65 },
  { dept: 'Neurology',    waiting: 6,  avg: '22 min', color: 'bg-purple-500', pct: 45 },
  { dept: 'Orthopedics',  waiting: 10, avg: '15 min', color: 'bg-teal-500',   pct: 55 },
  { dept: 'General',      waiting: 15, avg: '12 min', color: 'bg-green-500',  pct: 75 },
];

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth();
  const today = formatDate(new Date().toISOString());

  return (
    <div className="space-y-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <p className="text-brand-500 font-semibold text-sm">{getGreeting()}, {user?.full_name?.split(' ')[0]} 👋</p>
          <h1 className="page-title mt-0.5">Admin Dashboard</h1>
          <p className="page-subtitle mt-1">{today} · System running normally</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={14} />}>Refresh</Button>
          <Button size="sm" leftIcon={<BarChart3 size={14} />}>View Reports</Button>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.05} />
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent Appointments"
              subtitle={`${RECENT_APPOINTMENTS.length} appointments today`}
              icon={<Calendar size={18} />}
              action={<Button variant="ghost" size="sm">View All</Button>}
            />
            <div className="overflow-x-auto -mx-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    {['Patient', 'Doctor', 'Department', 'Time', 'Status'].map(h => (
                      <th key={h} className="px-6 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {RECENT_APPOINTMENTS.map((a, i) => (
                    <motion.tr
                      key={a.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={a.patient} size="sm" />
                          <span className="text-sm font-medium text-gray-800">{a.patient}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-600">{a.doctor}</td>
                      <td className="px-6 py-3.5">
                        <span className="badge-blue text-xs">{a.dept}</span>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-500">{a.time}</td>
                      <td className="px-6 py-3.5">
                        <StatusBadge status={a.status} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Department Queue */}
        <div>
          <Card>
            <CardHeader
              title="Department Queue"
              subtitle="Live queue status"
              icon={<Activity size={18} />}
            />
            <div className="space-y-4">
              {DEPT_QUEUE.map((d, i) => (
                <motion.div
                  key={d.dept}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{d.dept}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{d.avg}</span>
                      <span className="badge-blue text-xs">{d.waiting} waiting</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.pct}%` }}
                      transition={{ delay: 0.5 + i * 0.07, duration: 0.6, ease: 'easeOut' }}
                      className={`h-full rounded-full ${d.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Active Doctors */}
      <div>
        <Card>
          <CardHeader
            title="Active Doctors Today"
            subtitle={`${ACTIVE_DOCTORS.filter(d => d.available).length} available`}
            icon={<Stethoscope size={18} />}
            action={<Button variant="ghost" size="sm">Manage Doctors</Button>}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ACTIVE_DOCTORS.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all duration-200"
              >
                <Avatar name={d.name} size="md" online={d.available} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{d.name}</p>
                  <p className="text-xs text-gray-400">{d.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users size={10} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{d.patients} patients</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
