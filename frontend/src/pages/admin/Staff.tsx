import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Eye, Mail } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { dataService } from '@/lib/dataService';

export default function AdminStaff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dataService.getStaff();
        setStaff(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const statusStyle: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    on_leave: 'bg-yellow-100 text-yellow-700',
    inactive: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">{staff.filter(s => s.status === 'active').length} active · {staff.length} total staff</p>
        </div>
        <Button leftIcon={<Plus size={16} />}>Add Staff</Button>
      </motion.div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading staff...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {staff.map((member, i) => (
            <motion.div key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={member.full_name} size="md" online={member.status === 'active'} />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{member.full_name}</h3>
                    <p className="text-xs text-brand-600 font-medium">{member.role}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle[member.status] ?? 'bg-gray-100 text-gray-600'}`}>
                  {member.status.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                <div className="flex justify-between"><span className="text-gray-400">Department</span><span>{member.dept}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Shift</span><span>{member.shift}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Joined</span><span>{member.joined}</span></div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200">
                  <Eye size={12} /> View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-medium text-brand-600 hover:bg-brand-50 transition-colors border border-brand-200">
                  <Edit size={12} /> Edit
                </button>
                <button className="p-2 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-gray-200">
                  <Mail size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
