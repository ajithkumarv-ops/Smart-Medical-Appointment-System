import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Plus, Eye, Edit, Phone, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { PATIENTS } from '@/lib/mockData';

export default function AdminPatients() {
  const [search, setSearch] = useState('');

  const filtered = PATIENTS.filter(p =>
    p.full_name.toLowerCase().includes(search.toLowerCase()) ||
    p.phone.includes(search) ||
    p.blood_group.includes(search.toUpperCase())
  );

  const genderBadge = (gender: string) => {
    const map: Record<string, string> = { male: 'bg-blue-100 text-blue-700', female: 'bg-pink-100 text-pink-700', other: 'bg-gray-100 text-gray-700' };
    return map[gender] ?? map.other;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">{PATIENTS.length} registered patients</p>
        </div>
        <Button leftIcon={<Plus size={16} />}>Add Patient</Button>
      </motion.div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, phone, or blood group..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
        />
      </div>

      <Card>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100">
                {['Patient', 'DOB', 'Gender', 'Blood', 'Phone', 'Last Visit', 'Visits', 'Actions'].map(h => (
                  <th key={h} className="px-6 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p, i) => (
                <motion.tr key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={p.full_name} size="sm" />
                      <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{p.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500 whitespace-nowrap">{p.date_of_birth}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${genderBadge(p.gender)}`}>{p.gender}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">{p.blood_group}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <Phone size={12} className="text-gray-400" />
                      {p.phone}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Calendar size={12} className="text-gray-400" />
                      {p.last_visit}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-600">{p.total_visits}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Edit"><Edit size={14} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No patients found.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
