import { motion } from 'framer-motion';
import { Star, Search } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { DOCTORS } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

export default function PatientDoctors() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filtered = DOCTORS.filter(d =>
    d.full_name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialty.toLowerCase().includes(search.toLowerCase()) ||
    d.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Find a Doctor</h1>
        <p className="page-subtitle">Browse our team of specialist physicians</p>
      </motion.div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" placeholder="Search by name, specialty, or department..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-white" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((doc, i) => (
          <motion.div key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-6 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-center mb-4">
              <div className="mb-3 flex justify-center">
                <Avatar name={doc.full_name} size="xl" online={doc.is_available} />
              </div>
              <h3 className="font-semibold text-gray-900">{doc.full_name}</h3>
              <p className="text-sm text-brand-600 font-medium">{doc.specialty}</p>
              <p className="text-xs text-gray-400">{doc.qualification} · {doc.experience_years} yrs exp</p>
            </div>

            <div className="flex items-center justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(star => (
                <Star key={star} size={14} className={star <= Math.round(doc.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
              ))}
              <span className="text-xs text-gray-500 ml-1">({doc.total_reviews})</span>
            </div>

            <div className="flex justify-between text-xs text-gray-600 bg-gray-50 rounded-xl px-4 py-3 mb-4">
              <span><span className="text-gray-400">Dept</span><br /><strong>{doc.department}</strong></span>
              <span className="text-center"><span className="text-gray-400">Fee</span><br /><strong className="text-green-600">${doc.consultation_fee}</strong></span>
              <span className="text-right"><span className="text-gray-400">Today</span><br /><strong>{doc.patients_today} pts</strong></span>
            </div>

            <Button
              onClick={() => navigate('/patient/book')}
              disabled={!doc.is_available}
              className="w-full"
              variant={doc.is_available ? 'primary' : 'secondary'}
            >
              {doc.is_available ? 'Book Appointment' : 'Not Available Today'}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
