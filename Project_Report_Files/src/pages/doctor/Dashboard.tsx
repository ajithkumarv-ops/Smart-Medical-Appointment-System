import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle, ChevronRight, Video } from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { getGreeting, formatDate } from '@/utils';

const STATS = [
  { label: "Today's Patients",  value: 18,      icon: Users,        color: 'from-blue-500 to-blue-600',    trend: { value: 3,  label: 'vs yesterday' } },
  { label: 'Remaining',         value: 11,      icon: Clock,        color: 'from-amber-500 to-amber-600',   trend: { value: -2, label: 'vs avg' } },
  { label: 'Completed',         value: 7,       icon: CheckCircle,  color: 'from-green-500 to-green-600',  trend: { value: 15, label: 'efficiency' } },
  { label: 'Next Appointment',  value: '2:30 PM', icon: Calendar,   color: 'from-purple-500 to-purple-600' },
];

const QUEUE = [
  { no: 1,  patient: 'Emily Johnson',   age: 34, reason: 'Follow-up',         status: 'in_progress', wait: '—' },
  { no: 2,  patient: 'Michael Brown',   age: 56, reason: 'Chest pain',        status: 'called',       wait: '5 min' },
  { no: 3,  patient: 'Jessica Davis',   age: 28, reason: 'Annual checkup',    status: 'waiting',      wait: '18 min' },
  { no: 4,  patient: 'Robert Wilson',   age: 71, reason: 'BP monitoring',     status: 'waiting',      wait: '30 min' },
  { no: 5,  patient: 'Linda Martinez',  age: 45, reason: 'Consultation',      status: 'waiting',      wait: '42 min' },
];

const SCHEDULE = [
  { time: '09:00 AM', patient: 'Emily Johnson',   type: 'Follow-up',    duration: '20 min', status: 'completed' },
  { time: '09:30 AM', patient: 'Tom Harrison',    type: 'New Patient',  duration: '30 min', status: 'completed' },
  { time: '10:00 AM', patient: 'Sarah Miller',    type: 'Consultation', duration: '15 min', status: 'completed' },
  { time: '10:30 AM', patient: 'Mark Anderson',   type: 'Follow-up',    duration: '20 min', status: 'completed' },
  { time: '11:00 AM', patient: 'Amy Clark',       type: 'New Patient',  duration: '30 min', status: 'completed' },
  { time: '11:30 AM', patient: 'Brian Davis',     type: 'Routine',      duration: '15 min', status: 'completed' },
  { time: '02:00 PM', patient: 'Nancy Thomas',    type: 'Follow-up',    duration: '20 min', status: 'in_progress' },
  { time: '02:30 PM', patient: 'Kevin White',     type: 'Consultation', duration: '30 min', status: 'scheduled' },
  { time: '03:00 PM', patient: 'Laura Harris',    type: 'New Patient',  duration: '45 min', status: 'scheduled' },
];

export default function DoctorDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <p className="text-brand-500 font-semibold text-sm">{getGreeting()}, {user?.full_name?.split(' ')[0]} 🩺</p>
          <h1 className="page-title mt-0.5">Doctor Dashboard</h1>
          <p className="page-subtitle mt-1">{formatDate(new Date().toISOString())} · Cardiology Department</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" leftIcon={<Video size={14} />}>Telemedicine</Button>
          <Button size="sm" leftIcon={<Calendar size={14} />}>My Schedule</Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Today's Queue */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader
              title="Patient Queue"
              subtitle="Today's queue"
              icon={<Clock size={18} />}
              action={
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-green-700">Live</span>
                </div>
              }
            />
            <div className="space-y-3">
              {QUEUE.map((q, i) => (
                <motion.div
                  key={q.no}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${
                    q.status === 'in_progress'
                      ? 'border-brand-300 bg-brand-50'
                      : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    q.status === 'in_progress' ? 'bg-brand-600 text-white shadow-brand' : 'bg-gray-100 text-gray-500'
                  }`}>
                    #{q.no}
                  </div>
                  <Avatar name={q.patient} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{q.patient}</p>
                    <p className="text-xs text-gray-400">{q.age} yrs · {q.reason}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusBadge status={q.status} />
                    {q.wait !== '—' && <p className="text-xs text-gray-400 mt-1">{q.wait} wait</p>}
                  </div>
                  {q.status === 'waiting' && (
                    <Button variant="ghost" size="sm">
                      <ChevronRight size={16} />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Today's schedule */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Today's Schedule" subtitle={`${SCHEDULE.length} appointments`} icon={<Calendar size={18} />} />
            <div className="space-y-1 max-h-96 overflow-y-auto no-scrollbar">
              {SCHEDULE.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    s.status === 'in_progress' ? 'bg-brand-50 border border-brand-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="text-right shrink-0 w-20">
                    <p className="text-xs font-bold text-gray-700">{s.time}</p>
                    <p className="text-[10px] text-gray-400">{s.duration}</p>
                  </div>
                  <div className={`w-0.5 h-10 rounded-full shrink-0 ${
                    s.status === 'completed'   ? 'bg-green-400' :
                    s.status === 'in_progress' ? 'bg-brand-500' : 'bg-gray-200'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{s.patient}</p>
                    <p className="text-[10px] text-gray-400">{s.type}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
