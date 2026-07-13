import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { dataService } from '@/lib/dataService';

const STATUSES = ['all', 'scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    const data = await dataService.getAppointments();
    setAppointments(data);
  };

  const handleCancel = async (id: string) => {
    const success = await dataService.updateAppointmentStatus(id, 'cancelled');
    if (success) {
      loadAppointments();
    }
  };

  const filtered = appointments.filter(a => {
    const patientName = a.patient || '';
    const doctorName = a.doctor || '';
    const matchSearch = patientName.toLowerCase().includes(search.toLowerCase()) ||
                        doctorName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">Manage all patient appointments</p>
        </div>
        <Button leftIcon={<Plus size={16} />}>New Appointment</Button>
      </motion.div>

      <Card>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patient or doctor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-gray-50"
            />
          </div>
          {/* Status filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="pl-9 pr-8 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-gray-50 appearance-none cursor-pointer"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100">
                {['ID', 'Patient', 'Doctor', 'Department', 'Date', 'Time', 'Fee', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-6 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((a, i) => (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3.5 text-xs font-mono text-gray-500">{a.id}</td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={a.patient} size="sm" />
                      <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{a.patient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-600 whitespace-nowrap">{a.doctor}</td>
                  <td className="px-6 py-3.5"><span className="badge-blue text-xs">{a.dept}</span></td>
                  <td className="px-6 py-3.5 text-sm text-gray-500 whitespace-nowrap">{a.date}</td>
                  <td className="px-6 py-3.5 text-sm text-gray-500 whitespace-nowrap">{a.time}</td>
                  <td className="px-6 py-3.5 text-sm font-medium text-gray-700">${a.fee}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={a.status} /></td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="View"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Edit"><Edit size={14} /></button>
                      {a.status !== 'cancelled' && a.status !== 'completed' && (
                        <button 
                          onClick={() => handleCancel(a.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" 
                          title="Cancel"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Calendar size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No appointments found.</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>Showing {filtered.length} of {appointments.length} appointments</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Previous</button>
            <button className="px-3 py-1 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors">1</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
