import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, FileText } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { dataService } from '@/lib/dataService';

export default function AdminBilling() {
  const [billing, setBilling] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const appts = await dataService.getAppointments();
        const b = appts.map((a, i) => ({
          ...a,
          invoice: `INV-${1000 + i}`,
          paid: a.status === 'completed',
          method: ['Card', 'Cash', 'Insurance', 'UPI'][i % 4],
        }));
        setBilling(b);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const totalRevenue = billing.filter(b => b.paid).reduce((s, b) => s + (b.fee || 0), 0);
  const pending = billing.filter(b => !b.paid).reduce((s, b) => s + (b.fee || 0), 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Billing & Finance</h1>
        <p className="page-subtitle">Revenue tracking and invoice management</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Today's Revenue", value: `$${totalRevenue}`, icon: DollarSign, color: 'from-green-500 to-emerald-600', trend: '+12%' },
          { label: 'Pending',         value: `$${pending}`,      icon: CreditCard,  color: 'from-amber-500 to-orange-600', trend: '-5%' },
          { label: 'Monthly Revenue', value: '$48,920',          icon: TrendingUp,  color: 'from-blue-500 to-brand-600',   trend: '+18%' },
          { label: 'Yearly Revenue',  value: '$5,82,400',        icon: FileText,    color: 'from-purple-500 to-violet-600',trend: '+24%' },
        ].map((stat, i) => (
          <motion.div key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon size={18} className="text-white" />
              </div>
              <span className={`text-xs font-semibold ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                {stat.trend.startsWith('+') ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
                {stat.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Invoice Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading billing...</div>
      ) : (
        <Card>
          <CardHeader title="Invoices" subtitle="Recent billing records" icon={<FileText size={18} />} />
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  {['Invoice', 'Patient', 'Doctor', 'Service', 'Amount', 'Method', 'Status'].map(h => (
                    <th key={h} className="px-6 pb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {billing.map((b, i) => (
                  <motion.tr key={b.id || i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3.5 text-xs font-mono text-gray-500">{b.invoice}</td>
                    <td className="px-6 py-3.5 text-sm font-medium text-gray-800">{b.patient}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-600">{b.doctor}</td>
                    <td className="px-6 py-3.5 text-sm text-gray-600">{b.reason}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-800">${b.fee}</td>
                    <td className="px-6 py-3.5"><span className="badge-blue text-xs">{b.method}</span></td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${b.paid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {b.paid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
