import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Search } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { dataService } from '@/lib/dataService';

export default function ReceptionDoctors() {
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dataService.getDoctors();
        setDoctors(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const filtered = doctors.filter(d =>
    (d.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.specialty || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Doctors</h1>
        <p className="page-subtitle">{doctors.filter(d => d.is_available).length} available right now</p>
      </motion.div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search doctor or specialty..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white" />
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading doctors...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <motion.div key={doc.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="card p-5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={doc.full_name} size="lg" online={doc.is_available} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">{doc.full_name}</h3>
                  <p className="text-xs text-brand-600 font-medium">{doc.specialty}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{doc.rating || 5} ({doc.total_reviews || 0})</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-gray-600 mb-4">
                <div className="flex justify-between"><span className="text-gray-400">Department</span><span>{doc.department}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Fee</span><span className="text-green-600 font-medium">${doc.consultation_fee}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Today</span><span>{doc.patients_today || 0} patients</span></div>
              </div>
              <button className={`w-full py-2 rounded-xl text-xs font-medium transition-colors ${doc.is_available ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                disabled={!doc.is_available}>
                {doc.is_available ? 'Book Appointment' : 'Not Available'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
