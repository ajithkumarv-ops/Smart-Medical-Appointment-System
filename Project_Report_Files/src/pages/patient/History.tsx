import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pill, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/store/AuthContext';

export default function PatientHistory() {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) { setLoading(false); return; }

      // Derive history from completed/cancelled appointments for this patient
      const all = await dataService.getAppointments();
      const past = all.filter(a => a.patient_id === user.id && (a.status === 'completed' || a.status === 'cancelled'));

      // Map appointment records to history format
      const historyItems = past.map((a, idx) => ({
        id: a.id || `h${idx}`,
        date: a.date,
        doctor: a.doctor,
        dept: a.dept,
        diagnosis: a.reason || 'Medical Consultation',
        prescription: 'As prescribed by doctor',
        followup: 'As advised',
        notes: `Status: ${a.status}. Visit was with ${a.doctor} in ${a.dept} department.`,
        status: a.status,
      }));

      setHistory(historyItems);
      if (historyItems.length > 0) setExpanded(historyItems[0].id);
      setLoading(false);
    };
    load();
  }, [user]);

  const uniqueDoctors = [...new Set(history.map(h => h.doctor))].length;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Medical History</h1>
          <p className="page-subtitle">{history.length} records · All time</p>
        </div>
        <Button variant="secondary" leftIcon={<Download size={16} />}>Download Records</Button>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Visits',  value: history.length.toString() },
          { label: 'Doctors Seen',  value: uniqueDoctors.toString() },
          { label: 'Last Visit',    value: history.length > 0 ? new Date(history[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—' },
          { label: 'Prescriptions', value: history.filter(h => h.status === 'completed').length.toString() },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-4 text-center"
          >
            <p className="text-2xl font-bold text-brand-600">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading history...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-12 card p-6 space-y-3">
          <Calendar size={40} className="mx-auto text-gray-300" />
          <p className="text-gray-500 font-medium">No medical history yet</p>
          <p className="text-sm text-gray-400">Completed appointments will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record, i) => (
            <motion.div key={record.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === record.id ? null : record.id)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
              >
                {/* Timeline dot */}
                <div className="relative shrink-0">
                  <div className={`w-4 h-4 rounded-full border-2 ${i === 0 ? 'border-brand-600 bg-brand-100' : 'border-gray-300 bg-white'}`} />
                  {i < history.length - 1 && (
                    <div className="absolute left-1.5 top-4 w-px h-6 bg-gray-200" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="text-sm font-semibold text-gray-900">{record.diagnosis}</p>
                    <p className="text-xs text-gray-400 shrink-0">{record.date}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{record.doctor} · {record.dept}</p>
                </div>
                {expanded === record.id
                  ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
                  : <ChevronDown size={16} className="text-gray-400 shrink-0" />
                }
              </button>

              {expanded === record.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-5 pb-5 space-y-3 border-t border-gray-100"
                >
                  <div className="h-4" />
                  <div className="flex items-start gap-3">
                    <Pill size={14} className="text-brand-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Prescription</p>
                      <p className="text-sm text-gray-600">{record.prescription}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Doctor's Notes</p>
                      <p className="text-sm text-gray-600">{record.notes}</p>
                    </div>
                  </div>
                  {record.followup !== 'None' && (
                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-xl px-3 py-2">
                      <CheckCircle size={13} />
                      Follow-up: <strong>{record.followup}</strong>
                    </div>
                  )}
                  <button className="flex items-center gap-2 text-xs text-brand-600 hover:text-brand-800 transition-colors pt-1">
                    <Download size={12} />
                    Download prescription
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
