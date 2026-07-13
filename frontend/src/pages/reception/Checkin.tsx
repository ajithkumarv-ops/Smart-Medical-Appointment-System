import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Search, CheckCircle, Camera } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { dataService } from '@/lib/dataService';

export default function ReceptionCheckin() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const appts = await dataService.getAppointments();
    setAppointments(appts);
  };

  const handleCheckIn = async (id: string) => {
    const result = await dataService.checkInPatient(id);
    if (result) {
      loadData();
    }
  };

  const isCheckedIn = (apptId: string) => {
    // Check if there is an entry in queue for this appointment
    // Or if the appointment status is confirmed/in_progress
    const appt = appointments.find(a => a.id === apptId);
    return appt ? (appt.status === 'confirmed' || appt.status === 'in_progress' || appt.status === 'completed') : false;
  };

  const filtered = appointments.filter(a => {
    const patientName = a.patient || '';
    const idStr = a.id || '';
    return patientName.toLowerCase().includes(search.toLowerCase()) ||
           idStr.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Patient Check-In</h1>
          <p className="page-subtitle">{appointments.filter(a => isCheckedIn(a.id)).length} checked in today</p>
        </div>
        <Button leftIcon={<Camera size={16} />} variant="secondary">Scan QR</Button>
      </motion.div>

      {/* Check-in search */}
      <Card className="border-2 border-brand-200 bg-brand-50/20">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or appointment ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
            />
          </div>
          <Button>Check In</Button>
        </div>
      </Card>

      {/* Appointment list */}
      <Card>
        <CardHeader title="Today's Appointments" subtitle="Check in arriving patients" icon={<UserCheck size={18} />} />
        <div className="space-y-3">
          {filtered.map((appt, i) => {
            const isIn = isCheckedIn(appt.id);
            return (
              <motion.div key={appt.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isIn ? 'border-green-200 bg-green-50/40' : 'border-gray-100 hover:border-brand-200 hover:bg-brand-50/20'}`}
              >
                <div className="text-center w-16 shrink-0">
                  <p className="text-xs font-mono text-gray-400">{appt.id}</p>
                  <p className="text-sm font-bold text-gray-700 mt-0.5">{appt.time}</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <Avatar name={appt.patient} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{appt.patient}</p>
                  <p className="text-xs text-gray-500">{appt.doctor} · {appt.dept}</p>
                </div>
                <StatusBadge status={appt.status} />
                {isIn ? (
                  <div className="flex items-center gap-1 text-green-600 text-xs font-medium shrink-0">
                    <CheckCircle size={14} />
                    Checked In
                  </div>
                ) : (
                  <Button size="sm" onClick={() => handleCheckIn(appt.id)} leftIcon={<UserCheck size={14} />}>
                    Check In
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
