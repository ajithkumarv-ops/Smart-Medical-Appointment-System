import { useState, useEffect } from 'react';
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
import { dataService } from '@/lib/dataService';
import { getGreeting, formatDate } from '@/utils';
import { useNavigate } from 'react-router-dom';

const VITALS = [
  { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Heart,    color: 'text-red-500',    bg: 'bg-red-50' },
  { label: 'Heart Rate',     value: '72',     unit: 'bpm',  icon: Activity, color: 'text-blue-500',   bg: 'bg-blue-50' },
  { label: 'Last Visit',     value: '—',      unit: '',     icon: Calendar, color: 'text-green-500',  bg: 'bg-green-50' },
  { label: 'Next Appt',      value: '—',      unit: '',     icon: Clock,    color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [queueEntry, setQueueEntry] = useState<any>(null);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [vitals, setVitals] = useState(VITALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) { setLoading(false); return; }

      const [allAppts, allQueue, allDoctors] = await Promise.all([
        dataService.getAppointments(),
        dataService.getQueue(),
        dataService.getDoctors(),
      ]);

      const myAppts = allAppts.filter(a => a.patient_id === user.id);
      const myQueue = allQueue.find(q => q.patient_id === user.id && q.status !== 'done' && q.status !== 'skipped');

      setAppointments(myAppts.slice(0, 3));
      setQueueEntry(myQueue || null);
      setDoctors(allDoctors.slice(0, 4));

      // Derive last visit and next appointment from real data
      const completed = myAppts.filter(a => a.status === 'completed');
      const upcoming  = myAppts.filter(a => a.status !== 'completed' && a.status !== 'cancelled');
      const lastDate  = completed.length > 0 ? completed[0].date : null;
      const nextDate  = upcoming.length > 0  ? upcoming[upcoming.length - 1].date : null;

      setVitals(prev => prev.map(v => {
        if (v.label === 'Last Visit')  return { ...v, value: lastDate ? new Date(lastDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—' };
        if (v.label === 'Next Appt')   return { ...v, value: nextDate ? new Date(nextDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—' };
        return v;
      }));

      setLoading(false);
    };
    load();
  }, [user]);

  const waitingAhead = queueEntry?.ahead ?? 0;

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
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => navigate('/patient/book')}>Book Appointment</Button>
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
          {queueEntry ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-blue-200 text-sm font-medium">Active Queue Token</span>
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-blue-200 text-xs uppercase tracking-wide">Queue Number</p>
                    <p className="font-display text-5xl font-bold text-white leading-none">#{queueEntry.queue_number}</p>
                  </div>
                  <div className="h-12 w-px bg-white/20" />
                  <div>
                    <p className="text-blue-200 text-xs uppercase tracking-wide">Your Position</p>
                    <p className="font-display text-3xl font-bold text-white">{waitingAhead + 1}</p>
                    <p className="text-blue-300 text-xs">in queue</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="glass rounded-2xl p-4 text-center min-w-[100px]">
                  <Clock size={18} className="text-blue-300 mx-auto mb-1" />
                  <p className="font-display text-xl font-bold text-white">{waitingAhead * 10 + 5}</p>
                  <p className="text-blue-300 text-xs">min wait</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center min-w-[100px]">
                  <Stethoscope size={18} className="text-blue-300 mx-auto mb-1" />
                  <p className="font-semibold text-white text-sm">{queueEntry.doctor?.split(' ').slice(-1)}</p>
                  <p className="text-blue-300 text-xs">{queueEntry.dept}</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center min-w-[100px]">
                  <Calendar size={18} className="text-blue-300 mx-auto mb-1" />
                  <p className="font-semibold text-white text-sm">{queueEntry.check_in}</p>
                  <p className="text-blue-300 text-xs">Check-in</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-blue-200 text-sm mb-2">No active queue token</p>
              <p className="text-white font-semibold">Book an appointment to get a queue number</p>
              <Button
                size="sm"
                className="mt-4 bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={() => navigate('/patient/book')}
              >
                Book Now
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Vitals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map(({ label, value, unit, icon: Icon, color, bg }, i) => (
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
            subtitle={loading ? 'Loading...' : `${appointments.length} recent`}
            icon={<Calendar size={18} />}
            action={<Button variant="ghost" size="sm" onClick={() => navigate('/patient/appointments')}>View All</Button>}
          />
          {loading ? (
            <p className="text-sm text-gray-400 py-4 text-center">Loading...</p>
          ) : appointments.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">No appointments yet</p>
          ) : (
            <div className="space-y-3">
              {appointments.map((a, i) => (
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
                    <p className="text-xs text-gray-400">Consultation · {a.dept}</p>
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
                    <p className="text-xs font-semibold text-gray-700 mt-1">${a.fee}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <Button variant="secondary" size="sm" className="w-full mt-4" leftIcon={<Plus size={14} />} onClick={() => navigate('/patient/book')}>
            Book New Appointment
          </Button>
        </Card>

        {/* Featured Doctors */}
        <Card>
          <CardHeader
            title="Featured Doctors"
            subtitle="Book an appointment"
            icon={<Stethoscope size={18} />}
            action={<Button variant="ghost" size="sm" onClick={() => navigate('/patient/doctors')}>All Doctors</Button>}
          />
          <div className="space-y-3">
            {doctors.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <Avatar name={d.full_name} size="md" online={d.is_available} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{d.full_name}</p>
                  <p className="text-xs text-gray-400">{d.specialty} · {d.experience_years} yrs exp</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={10} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">{d.rating}</span>
                    <span className="text-xs text-gray-400">({d.total_reviews})</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-800">${d.consultation_fee}</p>
                  <Badge variant={d.is_available ? 'green' : 'gray'} dot className="mt-1">
                    {d.is_available ? 'Available' : 'Busy'}
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
