import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Clock, Stethoscope } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { dataService } from '@/lib/dataService';

export default function ReceptionAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dataService.getAppointments();
        setAppointments(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">Book and manage patient appointments</p>
        </div>
        <Button leftIcon={<Plus size={16} />}>Book Appointment</Button>
      </motion.div>

      {/* Quick booking form */}
      <Card className="border-l-4 border-brand-500">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-brand-600" />
          Quick Booking
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Patient Name', placeholder: 'Search or add patient...' },
            { label: 'Doctor',       placeholder: 'Select doctor...' },
            { label: 'Date',         placeholder: '',        type: 'date' },
            { label: 'Time Slot',    placeholder: 'Select time...' },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">{f.label}</label>
              <input
                type={f.type ?? 'text'}
                placeholder={f.placeholder}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-gray-50"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <Button size="sm">Book Now</Button>
          <Button size="sm" variant="secondary">Check Availability</Button>
        </div>
      </Card>

      {/* Appointments list */}
      <Card>
        <CardHeader title="Today's Schedule" subtitle={`${appointments.length} appointments`} icon={<Stethoscope size={18} />} />
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading appointments...</div>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt, i) => (
              <motion.div key={appt.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/20 transition-all"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-center shrink-0">
                    <p className="text-xs text-gray-400 font-mono">{appt.id}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock size={10} className="text-gray-400" />
                      <p className="text-sm font-bold text-gray-700">{appt.time}</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                  <Avatar name={appt.patient} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{appt.patient}</p>
                    <p className="text-xs text-gray-500">{appt.doctor} · {appt.dept}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge-blue text-xs">${appt.fee}</span>
                  <StatusBadge status={appt.status} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
