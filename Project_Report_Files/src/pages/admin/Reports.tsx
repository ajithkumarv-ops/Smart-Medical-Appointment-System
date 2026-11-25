import { motion } from 'framer-motion';
import { FileText, Download, BarChart3 } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const REPORTS = [
  { name: 'Daily Appointments Report',   date: '2024-06-21', size: '245 KB', type: 'PDF' },
  { name: 'Monthly Revenue Summary',      date: '2024-06-01', size: '1.2 MB', type: 'XLSX' },
  { name: 'Doctor Performance Report',    date: '2024-05-31', size: '340 KB', type: 'PDF' },
  { name: 'Patient Satisfaction Survey',  date: '2024-05-15', size: '128 KB', type: 'PDF' },
  { name: 'Queue Analytics Report',       date: '2024-05-01', size: '456 KB', type: 'XLSX' },
  { name: 'Annual Hospital Report 2023',  date: '2024-01-15', size: '5.8 MB', type: 'PDF' },
];

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Download and manage system reports</p>
        </div>
        <Button leftIcon={<BarChart3 size={16} />}>Generate Report</Button>
      </motion.div>

      <Card>
        <CardHeader title="Available Reports" subtitle={`${REPORTS.length} reports`} icon={<FileText size={18} />} />
        <div className="space-y-3">
          {REPORTS.map((report, i) => (
            <motion.div key={report.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/20 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${report.type === 'PDF' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {report.type}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{report.name}</p>
                <p className="text-xs text-gray-400">{report.date} · {report.size}</p>
              </div>
              <button className="p-2 rounded-xl text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                <Download size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
