import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, Users, UserCheck, Search, Plus,
  Phone, Bell, Check, X, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { StatCard } from '@/components/common/StatCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getGreeting, formatDate } from '@/utils';

const STATS = [
  { label: 'Total Checked-in', value: 74,    icon: UserCheck, color: 'from-green-500 to-green-600',  trend: { value: 6, label: 'vs yesterday' } },
  { label: 'In Queue',         value: 23,    icon: Clock,     color: 'from-amber-500 to-amber-600',   trend: { value: -2, label: 'vs avg' } },
  { label: "Today's Appts",    value: 184,   icon: Calendar,  color: 'from-blue-500 to-blue-600',     trend: { value: 8, label: 'vs avg' } },
  { label: 'Walk-ins',         value: 12,    icon: Users,     color: 'from-purple-500 to-purple-600', trend: { value: 3, label: 'today' } },
];

const QUEUE_ENTRIES = [
  { no: 1,  patient: 'Emily Johnson',   doctor: 'Dr. Wilson',   dept: 'Cardiology',   time: '09:00 AM', status: 'in_progress', phone: '+1-555-0101' },
  { no: 2,  patient: 'Michael Brown',   doctor: 'Dr. Lee',      dept: 'Neurology',    time: '09:30 AM', status: 'called',       phone: '+1-555-0102' },
  { no: 3,  patient: 'Jessica Davis',   doctor: 'Dr. Thompson', dept: 'Orthopedics',  time: '10:00 AM', status: 'waiting',      phone: '+1-555-0103' },
  { no: 4,  patient: 'Robert Wilson',   doctor: 'Dr. Chen',     dept: 'Dermatology',  time: '10:30 AM', status: 'waiting',      phone: '+1-555-0104' },
  { no: 5,  patient: 'Linda Martinez',  doctor: 'Dr. Smith',    dept: 'General',      time: '11:00 AM', status: 'waiting',      phone: '+1-555-0105' },
  { no: 6,  patient: 'Tom Harrison',    doctor: 'Dr. Wilson',   dept: 'Cardiology',   time: '11:30 AM', status: 'waiting',      phone: '+1-555-0106' },
  { no: 7,  patient: 'Sarah Miller',    doctor: 'Dr. Lee',      dept: 'Neurology',    time: '12:00 PM', status: 'waiting',      phone: '+1-555-0107' },
];

const TODAY_APPOINTMENTS = [
  { patient: 'Amy Clark',    doctor: 'Dr. Wilson', dept: 'Cardiology',  time: '01:00 PM', status: 'confirmed' },
  { patient: 'Brian Davis',  doctor: 'Dr. Lee',    dept: 'Neurology',   time: '01:30 PM', status: 'confirmed' },
  { patient: 'Nancy Thomas', doctor: 'Dr. Smith',  dept: 'General',     time: '02:00 PM', status: 'scheduled' },
  { patient: 'Kevin White',  doctor: 'Dr. Chen',   dept: 'Dermatology', time: '02:30 PM', status: 'scheduled' },
];

export default function ReceptionDashboard() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = QUEUE_ENTRIES.filter(q =>
    q.patient.toLowerCase().includes(search.toLowerCase()) ||
    q.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <p className="text-brand-500 font-semibold text-sm">{getGreeting()}, {user?.full_name?.split(' ')[0]} 👋</p>
          <h1 className="page-title mt-0.5">Reception Dashboard</h1>
          <p className="page-subtitle mt-1">{formatDate(new Date().toISOString())} · Front Desk</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" leftIcon={<Bell size={14} />}>Announcements</Button>
          <Button size="sm" leftIcon={<Plus size={14} />}>Quick Book</Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={i * 0.06} />)}
      </div>

      {/* Queue + Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Queue */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Live Queue"
              subtitle={`${QUEUE_ENTRIES.filter(q => q.status === 'waiting').length} patients waiting`}
              icon={<Clock size={18} />}
              action={
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 rounded-full">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-red-700">Live</span>
                  </div>
                </div>
              }
            />

            {/* Search */}
            <div className="mb-4">
              <Input
                id="queue-search"
                placeholder="Search patient or department..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftIcon={<Search size={15} />}
              />
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto no-scrollbar">
              {filtered.map((q, i) => (
                <motion.div
                  key={q.no}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                    q.status === 'in_progress' ? 'border-brand-300 bg-brand-50' :
                    q.status === 'called' ? 'border-amber-300 bg-amber-50' :
                    'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {/* Number */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                    q.status === 'in_progress' ? 'bg-brand-600 text-white' :
                    q.status === 'called'      ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {q.no}
                  </div>

                  <Avatar name={q.patient} size="sm" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{q.patient}</p>
                    <p className="text-xs text-gray-400 truncate">{q.dept} · {q.doctor}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-gray-600">{q.time}</p>
                    <StatusBadge status={q.status} />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1 shrink-0">
                    <button className="p-1.5 rounded-lg text-gray-400 hover:bg-green-100 hover:text-green-600 transition-colors" title="Call patient">
                      <Phone size={13} />
                    </button>
                    {q.status === 'waiting' && (
                      <>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:bg-brand-100 hover:text-brand-600 transition-colors" title="Call next">
                          <Bell size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:bg-green-100 hover:text-green-600 transition-colors" title="Check in">
                          <Check size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors" title="Cancel">
                          <X size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming appointments */}
        <div>
          <Card>
            <CardHeader
              title="Upcoming"
              subtitle="Next appointments"
              icon={<Calendar size={18} />}
              action={<Button variant="ghost" size="sm">All</Button>}
            />
            <div className="space-y-3">
              {TODAY_APPOINTMENTS.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <Avatar name={a.patient} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{a.patient}</p>
                    <p className="text-xs text-gray-400">{a.dept} · {a.time}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-400 transition-colors" />
                </motion.div>
              ))}
            </div>
            <Button variant="secondary" size="sm" className="w-full mt-4" leftIcon={<Plus size={14} />}>
              New Appointment
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
