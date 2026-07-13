import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Search, Plus, Eye, Edit, Star, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { dataService } from '@/lib/dataService';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const data = await dataService.getDoctors();
    setDoctors(data);
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    const success = await dataService.updateDoctorAvailability(id, !currentStatus);
    if (success) {
      loadDoctors();
    }
  };

  const filtered = doctors.filter(d => {
    const name = d.full_name || '';
    const spec = d.specialty || '';
    const dept = d.department || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
           spec.toLowerCase().includes(search.toLowerCase()) ||
           dept.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Doctors</h1>
          <p className="page-subtitle">{doctors.filter(d => d.is_available).length} available · {doctors.length} total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setView('grid')} className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${view === 'grid' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Grid</button>
          <button onClick={() => setView('table')} className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${view === 'table' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Table</button>
          <Button leftIcon={<Plus size={16} />}>Add Doctor</Button>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, specialty, or department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white"
        />
      </div>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doc, i) => (
            <motion.div key={doc.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="card p-5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={doc.full_name} size="lg" online={doc.is_available} />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{doc.full_name}</h3>
                    <p className="text-xs text-brand-600 font-medium mt-0.5">{doc.specialty}</p>
                    <p className="text-xs text-gray-400">{doc.qualification}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye size={14} /></button>
                  <button className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"><Edit size={14} /></button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-4">
                <div className="flex justify-between"><span className="text-gray-400">Department</span><span className="font-medium">{doc.department}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Experience</span><span className="font-medium">{doc.experience_years} years</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Fee</span><span className="font-medium text-green-600">${doc.consultation_fee}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Today's Patients</span><span className="font-medium">{doc.patients_today}</span></div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-semibold text-gray-700">{doc.rating}</span>
                  <span className="text-xs text-gray-400">({doc.total_reviews})</span>
                </div>
                <button 
                  onClick={() => toggleAvailability(doc.id, doc.is_available)}
                  className={`flex items-center gap-1 text-xs font-medium cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-50 transition-colors ${doc.is_available ? 'text-green-600' : 'text-red-500'}`}
                >
                  {doc.is_available ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  {doc.is_available ? 'Available' : 'Unavailable'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Table View */}
      {view === 'table' && (
        <Card>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  {['Doctor', 'Specialty', 'Department', 'Experience', 'Fee', 'Rating', 'Patients Today', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((doc, i) => (
                  <motion.tr key={doc.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={doc.full_name} size="sm" online={doc.is_available} />
                        <div>
                          <p className="text-sm font-medium text-gray-800 whitespace-nowrap">{doc.full_name}</p>
                          <p className="text-xs text-gray-400">{doc.qualification}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-600 whitespace-nowrap">{doc.specialty}</td>
                    <td className="px-6 py-3.5"><span className="badge-blue text-xs">{doc.department}</span></td>
                    <td className="px-6 py-3.5 text-sm text-gray-600">{doc.experience_years} yrs</td>
                    <td className="px-6 py-3.5 text-sm font-medium text-green-600">${doc.consultation_fee}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{doc.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-gray-600">{doc.patients_today}</td>
                    <td className="px-6 py-3.5">
                      <button 
                        onClick={() => toggleAvailability(doc.id, doc.is_available)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-85 ${doc.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        {doc.is_available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Eye size={14} /></button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"><Edit size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Stethoscope size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No doctors found matching your search.</p>
        </div>
      )}
    </div>
  );
}
