import { motion } from 'framer-motion';
import { Search, Phone, Eye, Edit, Plus } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { PATIENTS } from '@/lib/mockData';

export default function ReceptionPatients() {
  const [search, setSearch] = useState('');
  const filtered = PATIENTS.filter(p => p.full_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">{PATIENTS.length} registered patients</p>
        </div>
        <Button leftIcon={<Plus size={16} />}>Register Patient</Button>
      </motion.div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search patient..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-5 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar name={p.full_name} size="md" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">{p.full_name}</h3>
                <p className="text-xs text-gray-400 capitalize">{p.gender} · {p.date_of_birth}</p>
              </div>
              <span className="font-bold text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{p.blood_group}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Phone size={11} className="text-gray-400" />
              {p.phone}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium text-brand-600 hover:bg-brand-50 border border-brand-200 transition-colors">
                <Eye size={12} /> View
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 border border-gray-200 transition-colors">
                <Edit size={12} /> Edit
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
