import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, Users, UserCheck, Plus, Edit, Eye } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { dataService } from '@/lib/dataService';

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const depts = await dataService.getDepartments();
        setDepartments(depts);
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
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">{departments.length} departments · All operational</p>
        </div>
        <Button leftIcon={<Plus size={16} />}>Add Department</Button>
      </motion.div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading departments...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {departments.map((dept, i) => (
              <motion.div key={dept.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.08 }}
                className="card p-0 overflow-hidden hover:-translate-y-1 transition-all duration-300"
              >
                {/* Colored header */}
                <div className={`bg-gradient-to-r ${dept.color || 'from-brand-500 to-brand-700'} p-5 text-white`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{dept.icon}</span>
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"><Eye size={14} /></button>
                      <button className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"><Edit size={14} /></button>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-xl leading-tight">{dept.name}</h3>
                  <p className="text-white/80 text-sm mt-1">{dept.description}</p>
                </div>

                {/* Stats */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <UserCheck size={14} className="text-gray-400" />
                      <span>Head Doctor</span>
                    </div>
                    <span className="font-medium text-gray-800">{dept.head}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users size={14} className="text-gray-400" />
                      <span>Doctors</span>
                    </div>
                    <span className="font-medium text-gray-800">{dept.doctors}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Layers size={14} className="text-gray-400" />
                      <span>Patients Today</span>
                    </div>
                    <span className="font-semibold text-brand-600">{dept.patients_today}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Table */}
          <Card>
            <CardHeader title="Department Overview" subtitle="Performance summary" icon={<Layers size={18} />} />
            <div className="overflow-x-auto -mx-6">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-100">
                    {['Department', 'Head Doctor', 'Doctors', 'Patients Today', 'Status'].map(h => (
                      <th key={h} className="px-6 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {departments.map((dept, i) => (
                    <motion.tr key={dept.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{dept.icon}</span>
                          <span className="text-sm font-medium text-gray-800">{dept.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-gray-600">{dept.head}</td>
                      <td className="px-6 py-3.5 text-sm text-gray-600">{dept.doctors}</td>
                      <td className="px-6 py-3.5 text-sm font-semibold text-brand-600">{dept.patients_today}</td>
                      <td className="px-6 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          ● Operational
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
