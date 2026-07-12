import { motion } from 'framer-motion';
import {
  Calendar, Clock, Star, ChevronRight, Plus, Stethoscope,
  Heart, Activity,
} from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { getGreeting, formatDate } from '@/utils';

const MY_QUEUE = {
  queueNo: 7,
  estimatedWait: 22,
  doctor: 'Dr. James Wilson',
  dept: 'Cardiology',
  time: '10:30 AM',
  status: 'waiting',
  position: 3,
  totalInQueue: 12,
};

const UPCOMING_APPOINTMENTS = [
  { id: 'A1', doctor: 'Dr. James Wilson', dept: 'Cardiology',   date: '2025-07-15', time: '10:30 AM', status: 'confirmed', type: 'Follow-up',   fee: '$80' },
  { id: 'A2', doctor: 'Dr. Sarah Lee',    dept: 'Neurology',    date: '2025-07-22', time: '02:00 PM', status: 'scheduled', type: 'Consultation', fee: '$120' },
  { id: 'A3', doctor: 'Dr. Mark Chen',    dept: 'Dermatology',  date: '2025-08-01', time: '11:00 AM', status: 'scheduled', type: 'Checkup',      fee: '$60' },
];

const FEATURED_DOCTORS = [
  { name: 'Dr. James Wilson', specialty: 'Cardiology',    rating: 4.9, reviews: 312, available: true,  fee: '$80',  exp: 15 },
  { name: 'Dr. Sarah Lee',    specialty: 'Neurology',     rating: 4.8, reviews: 245, available: true,  fee: '$120', exp: 12 },
  { name: 'Dr. Mark Chen',    specialty: 'Dermatology',   rating: 4.7, reviews: 189, available: false, fee: '$60',  exp: 8  },
  { name: 'Dr. Anna Roberts', specialty: 'Gynecology',    rating: 4.9, reviews: 421, available: true,  fee: '$100', exp: 18 },
];

const VITALS = [
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Heart,    color: 'text-red-500',    bg: 'bg-red-50' },
  { label: 'Heart Rate',     value: '72',     unit: 'bpm',  icon: Activity, color: 'text-blue-500',   bg: 'bg-blue-50' },
  { label: 'Last Visit',     value: 'Jun 28', unit: '2025', icon: Calendar, color: 'text-green-500',  bg: 'bg-green-50' },
  { label: 'Next Appt',      value: 'Jul 15', unit: '2025', icon: Clock,    color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function PatientDashboard() {
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
          <p className="text-brand-500 font-semibold text-sm">{getGreeting()}, {user?.full_name?.split(' ')[0]} 🏥</p>
          <h1 className="page-title mt-0.5">My Health Dashboard</h1>
          <p className="page-subtitle mt-1">{formatDate(new Date().toISOString())}</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />}>Book Appointment</Button>
      </motion.div>

      {/* Queue status card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-3xl overflow-hidden p-6 lg:p-8 text-white bg-gradient-brand"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/4 -translate-y-1/4" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-blue-200 text-sm font-medium">Active Queue Token</span>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-blue-200 text-xs uppercase tracking-wide">Queue Number</p>
                  <p className="font-display text-5xl font-bold text-white leading-none">#{MY_QUEUE.queueNo}</p>
                </div>
                <div className="h-12 w-px bg-white/20" />
                <div>
                  <p className="text-blue-200 text-xs uppercase tracking-wide">Your Position</p>
                  <p className="font-display text-3xl font-bold text-white">{MY_QUEUE.position}rd</p>
                  <p className="text-blue-300 text-xs">{MY_QUEUE.totalInQueue} total in queue</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="glass rounded-2xl p-4 text-center min-w-[100px]">
                <Clock size={18} className="text-blue-300 mx-auto mb-1" />
                <p className="font-display text-xl font-bold text-white">{MY_QUEUE.estimatedWait}</p>
                <p className="text-blue-300 text-xs">min wait</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center min-w-[100px]">
                <Stethoscope size={18} className="text-blue-300 mx-auto mb-1" />
                <p className="font-semibold text-white text-sm">{MY_QUEUE.doctor.split(' ').slice(-1)}</p>
                <p className="text-blue-300 text-xs">{MY_QUEUE.dept}</p>
              </div>
              <div className="glass rounded-2xl p-4 text-center min-w-[100px]">
                <Calendar size={18} className="text-blue-300 mx-auto mb-1" />
                <p className="font-semibold text-white text-sm">{MY_QUEUE.time}</p>
                <p className="text-blue-300 text-xs">Today</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vitals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {VITALS.map(({ label, value, unit, icon: Icon, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            className="card p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon size={18} className={color} />
            </div>
            <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400">{unit}</p>
            <p className="text-xs font-medium text-gray-600 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* My Appointments + Featured Doctors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader
            title="My Appointments"
            subtitle={`${UPCOMING_APPOINTMENTS.length} upcoming`}
            icon={<Calendar size={18} />}
            action={<Button variant="ghost" size="sm">View All</Button>}
          />
          <div className="space-y-3">
            {UPCOMING_APPOINTMENTS.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all cursor-pointer group"
              >
                <Avatar name={a.doctor} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{a.doctor}</p>
                  <p className="text-xs text-gray-400">{a.type} · {a.dept}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={10} />
                      {a.date}
                    </div>
                    <span className="text-gray-300">·</span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={10} />
                      {a.time}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={a.status} />
                  <p className="text-xs font-semibold text-gray-700 mt-1">{a.fee}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <Button variant="secondary" size="sm" className="w-full mt-4" leftIcon={<Plus size={14} />}>
            Book New Appointment
          </Button>
        </Card>

        {/* Featured Doctors */}
        <Card>
          <CardHeader
            title="Featured Doctors"
            subtitle="Book an appointment"
            icon={<Stethoscope size={18} />}
            action={<Button variant="ghost" size="sm">All Doctors</Button>}
          />
          <div className="space-y-3">
            {FEATURED_DOCTORS.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <Avatar name={d.name} size="md" online={d.available} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{d.name}</p>
                  <p className="text-xs text-gray-400">{d.specialty} · {d.exp} yrs exp</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">{d.rating}</span>
                    <span className="text-xs text-gray-400">({d.reviews})</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-800">{d.fee}</p>
                  <Badge variant={d.available ? 'green' : 'gray'} dot className="mt-1">
                    {d.available ? 'Available' : 'Busy'}
                  </Badge>
                </div>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-brand-400 transition-colors ml-1" />
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
