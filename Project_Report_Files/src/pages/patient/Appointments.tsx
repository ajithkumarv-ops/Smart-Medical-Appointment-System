import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, X } from 'lucide-react';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/store/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PatientAppointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      if (user) {
        const all = await dataService.getAppointments();
        const filtered = all.filter(a => a.patient_id === user.id);
        setAppointments(filtered);
      }
      setLoading(false);
    };
    loadAppointments();
  }, [user]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">My Appointments</h1>
          <p className="page-subtitle">{appointments.length} total appointments</p>
        </div>
        <Button onClick={() => navigate('/patient/book')} leftIcon={<Calendar size={16} />}>Book New</Button>
      </motion.div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12 card p-6 text-gray-500">
          No appointments found. Click "Book New" to schedule one.
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt, i) => (
            <motion.div key={appt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Time badge */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-brand-50 flex flex-col items-center justify-center text-brand-700">
                    <p className="text-xs font-medium">Date</p>
                    <p className="text-sm font-bold leading-tight truncate max-w-full px-1">{appt.date}</p>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                      <Clock size={12} className="text-gray-400" />
                      {appt.time}
                    </div>
                    <p className="text-xs text-gray-400">ID: {appt.id}</p>
                  </div>
                </div>

                <div className="h-px sm:h-10 sm:w-px bg-gray-200" />

                {/* Doctor info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar name={appt.doctor} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{appt.doctor}</p>
                    <p className="text-xs text-gray-500">{appt.dept}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">Reason: {appt.reason}</p>
                  </div>
                </div>

                {/* Status & actions */}
                <div className="flex flex-col sm:items-end gap-2">
                  <StatusBadge status={appt.status} />
                  <div className="flex gap-2">
                    {(appt.status === 'scheduled' || appt.status === 'confirmed' || appt.status === 'Waiting' || appt.status === 'waiting') && (
                      <button 
                        onClick={async () => {
                          await dataService.updateAppointmentStatus(appt.id, 'cancelled');
                          // Refresh lists
                          const all = await dataService.getAppointments();
                          const filtered = all.filter(a => a.patient_id === user?.id);
                          setAppointments(filtered);
                        }}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        <X size={12} /> Cancel
                      </button>
                    )}
                    <span className="text-xs font-semibold text-green-600">${appt.fee}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
