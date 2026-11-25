import { motion } from 'framer-motion';
import { FileText, Phone, Calendar, Eye } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { PATIENTS } from '@/lib/mockData';

export default function DoctorPatients() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">My Patients</h1>
        <p className="page-subtitle">{PATIENTS.length} patients under your care</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PATIENTS.map((p, i) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-5 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={p.full_name} size="md" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">{p.full_name}</h3>
                <p className="text-xs text-gray-400">{p.gender} · {p.date_of_birth}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">{p.blood_group}</span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-600 mb-4">
              <div className="flex items-center gap-2"><Phone size={11} className="text-gray-400" />{p.phone}</div>
              <div className="flex items-center gap-2"><Calendar size={11} className="text-gray-400" />Last visit: {p.last_visit}</div>
              <div className="flex items-center gap-2"><FileText size={11} className="text-gray-400" />{p.total_visits} total visits</div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-brand-600 hover:bg-brand-50 transition-colors border border-brand-200 group-hover:bg-brand-50">
              <Eye size={12} /> View Records
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
