import { motion } from 'framer-motion';
import { FileText, Pill, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { MEDICAL_HISTORY, PATIENTS } from '@/lib/mockData';

export default function DoctorRecords() {
  const [expanded, setExpanded] = useState<string | null>('mh1');

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Medical Records</h1>
        <p className="page-subtitle">Patient treatment history and prescriptions</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient list */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 px-1">Patients</h2>
          {PATIENTS.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card p-4 flex items-center gap-3 cursor-pointer hover:border-brand-300 transition-colors"
            >
              <Avatar name={p.full_name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{p.full_name}</p>
                <p className="text-xs text-gray-400">{p.total_visits} visits</p>
              </div>
              <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{p.blood_group}</span>
            </motion.div>
          ))}
        </div>

        {/* Medical history */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 px-1">Medical History – Emily Johnson</h2>
          {MEDICAL_HISTORY.map((record, i) => (
            <motion.div key={record.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === record.id ? null : record.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                    <FileText size={16} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{record.diagnosis}</p>
                    <p className="text-xs text-gray-500">{record.date} · {record.doctor} · {record.dept}</p>
                  </div>
                </div>
                {expanded === record.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>

              {expanded === record.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-gray-100 p-5 space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <Pill size={14} className="text-brand-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Prescription</p>
                      <p className="text-sm text-gray-600">{record.prescription}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Doctor's Notes</p>
                      <p className="text-sm text-gray-600">{record.notes}</p>
                    </div>
                  </div>
                  {record.followup !== 'None' && (
                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-xl px-3 py-2">
                      <CheckCircle size={13} />
                      Follow-up scheduled: <strong>{record.followup}</strong>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
