import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { StatusBadge } from '@/components/ui/Badge';
import { APPOINTMENTS } from '@/lib/mockData';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const MY_SCHEDULE = APPOINTMENTS.filter(a => a.doctor === 'Dr. James Wilson');

export default function DoctorSchedule() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">My Schedule</h1>
          <p className="page-subtitle">Week of June 17 – 23, 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronLeft size={16} /></button>
          <span className="text-sm font-medium text-gray-700 px-3">Jun 17–23</span>
          <button className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"><ChevronRight size={16} /></button>
        </div>
      </motion.div>

      {/* Weekly calendar grid */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-3 text-xs text-gray-400 font-medium"></div>
              {DAYS.map((day, i) => (
                <div key={day} className="p-3 text-center border-l border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">{day}</p>
                  <p className={`text-lg font-bold mt-0.5 ${i === 3 ? 'text-brand-600' : 'text-gray-700'}`}>{17 + i}</p>
                </div>
              ))}
            </div>
            {/* Time slots */}
            {HOURS.map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-gray-50">
                <div className="p-3 text-xs text-gray-400 font-medium text-right pr-4">{hour}</div>
                {DAYS.map((day, di) => {
                  const hasAppt = MY_SCHEDULE.find(a => a.time.startsWith(hour.replace(':00', '')));
                  return (
                    <div key={day} className="border-l border-gray-50 p-1 min-h-[52px] relative">
                      {hasAppt && di === 3 && (
                        <div className="absolute inset-1 bg-brand-100 border border-brand-300 rounded-lg p-1.5 cursor-pointer hover:bg-brand-200 transition-colors">
                          <p className="text-xs font-semibold text-brand-700 truncate">{hasAppt.patient}</p>
                          <p className="text-[10px] text-brand-500">{hasAppt.dept}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Today's appointments list */}
      <Card>
        <CardHeader title="Today's Appointments" subtitle={`${MY_SCHEDULE.length} scheduled`} icon={<Calendar size={18} />} />
        <div className="space-y-3">
          {MY_SCHEDULE.map((appt, i) => (
            <motion.div key={appt.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.07 }}
              className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all"
            >
              <div className="text-center w-16 shrink-0">
                <p className="text-sm font-bold text-gray-800">{appt.time}</p>
                <p className="text-xs text-gray-400">#{appt.queue}</p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <Avatar name={appt.patient} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{appt.patient}</p>
                <p className="text-xs text-gray-500">{appt.reason}</p>
              </div>
              <StatusBadge status={appt.status} />
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
