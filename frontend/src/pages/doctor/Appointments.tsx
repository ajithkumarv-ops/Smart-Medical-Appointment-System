import { motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { APPOINTMENTS } from '@/lib/mockData';

const MY_APPTS = APPOINTMENTS.filter(a => a.doctor === 'Dr. James Wilson');

export default function DoctorAppointments() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">My Appointments</h1>
        <p className="page-subtitle">{MY_APPTS.length} scheduled appointments</p>
      </motion.div>

      <Card>
        <CardHeader title="Appointment List" subtitle="All appointments assigned to you" icon={<ClipboardList size={18} />} />
        <div className="overflow-x-auto -mx-6">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100">
                {['Patient', 'Date', 'Time', 'Reason', 'Fee', 'Status'].map(h => (
                  <th key={h} className="px-6 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MY_APPTS.map((a, i) => (
                <motion.tr key={a.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={a.patient} size="sm" />
                      <span className="text-sm font-medium text-gray-800">{a.patient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-gray-500">{a.date}</td>
                  <td className="px-6 py-3.5 text-sm font-medium text-gray-700">{a.time}</td>
                  <td className="px-6 py-3.5 text-sm text-gray-500 max-w-[200px] truncate">{a.reason}</td>
                  <td className="px-6 py-3.5 text-sm font-medium text-green-600">${a.fee}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={a.status} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
