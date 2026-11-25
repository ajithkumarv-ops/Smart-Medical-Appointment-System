import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { dataService } from '@/lib/dataService';
import { useAuth } from '@/store/AuthContext';
import { useNavigate } from 'react-router-dom';

const TIME_SLOTS = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'];

function toTime24(slot: string): string {
  const map: Record<string, string> = {
    '09:00 AM': '09:00:00', '09:30 AM': '09:30:00', '10:00 AM': '10:00:00',
    '10:30 AM': '10:30:00', '11:00 AM': '11:00:00', '11:30 AM': '11:30:00',
    '02:00 PM': '14:00:00', '02:30 PM': '14:30:00', '03:00 PM': '15:00:00',
    '03:30 PM': '15:30:00',
  };
  return map[slot] || '09:00:00';
}

export default function PatientBook() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [booked, setBooked] = useState(false);
  const [tokenNumber, setTokenNumber] = useState<number | null>(null);
  const [bookError, setBookError] = useState('');

  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const docs = await dataService.getDoctors();
      const depts = await dataService.getDepartments();
      setDoctors(docs);
      setDepartments(depts);
    };
    loadData();
  }, []);

  const filteredDoctors = selectedDept
    ? doctors.filter(d => d.department === departments.find(dep => dep.id === selectedDept)?.name)
    : doctors;

  const handleBook = async () => {
    setBookError('');
    if (!user?.id) {
      setBookError('You must be logged in to book an appointment.');
      return;
    }

    const doc = doctors.find(d => d.id === selectedDoctor);
    const dept = departments.find(d => d.id === selectedDept);

    const apptData = {
      patient_id: user.id,
      doctor_id: selectedDoctor,
      appointment_date: `${selectedDate}T${toTime24(selectedSlot)}`,
      status: 'scheduled',
      patient: user.full_name,
      doctor: doc?.full_name || 'Unknown Doctor',
      dept: dept?.name || 'General',
      date: selectedDate,
      time: selectedSlot,
      fee: doc?.consultation_fee || 100,
      reason: 'Scheduled Consultation'
    };

    const newAppt = await dataService.createAppointment(apptData);

    if (newAppt && newAppt.id) {
      const qEntry = await dataService.checkInPatient(newAppt.id);
      if (qEntry) {
        setTokenNumber(qEntry.queue_number);
      }
    }

    setBooked(true);
  };

  if (booked) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={48} className="text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Booked!</h2>
        <p className="text-gray-500 mb-2">Your appointment token number is</p>
        <p className="text-5xl font-black text-brand-600 mb-6">{tokenNumber != null ? `#${tokenNumber}` : 'Pending'}</p>
        <div className="card p-5 text-left space-y-2 text-sm mb-8">
          <div className="flex justify-between"><span className="text-gray-500">Doctor</span><span className="font-medium">{doctors.find(d => d.id === selectedDoctor)?.full_name ?? 'Dr. James Wilson'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{selectedDate || '2024-06-22'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Time</span><span className="font-medium">{selectedSlot || '10:00 AM'}</span></div>
        </div>
        <div className="flex justify-center gap-3">
          <Button variant="secondary" onClick={() => { setBooked(false); setStep(1); setSelectedDept(''); setSelectedDoctor(''); setSelectedDate(''); setSelectedSlot(''); }}>
            Book Another
          </Button>
          <Button onClick={() => navigate('/patient/appointments')}>
            View Appointments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Book Appointment</h1>
        <p className="page-subtitle">Schedule a consultation with our specialists</p>
      </motion.div>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {['Department', 'Doctor', 'Date & Time', 'Confirm'].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step === i + 1 ? 'text-brand-600' : 'text-gray-400'}`}>{s}</span>
            {i < 3 && <div className="flex-1 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step 1: Department */}
      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Department</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {departments.map((dept, i) => (
              <motion.button key={dept.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => { setSelectedDept(dept.id); setStep(2); }}
                className={`card p-4 text-center hover:-translate-y-1 transition-all duration-200 ${selectedDept === dept.id ? 'border-brand-400 bg-brand-50' : ''}`}
              >
                <span className="text-3xl mb-2 block">{dept.icon}</span>
                <p className="text-sm font-semibold text-gray-800">{dept.name}</p>
                <p className="text-xs text-gray-400 mt-1">{dept.doctors} doctors</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 2: Doctor */}
      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Select Doctor</h2>
            <button onClick={() => setStep(1)} className="text-sm text-brand-600 hover:underline">← Back</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDoctors.map((doc, i) => (
              <motion.button key={doc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => { setSelectedDoctor(doc.id); setStep(3); }}
                disabled={!doc.is_available}
                className={`card p-5 text-left hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${selectedDoctor === doc.id ? 'border-brand-400 bg-brand-50' : ''}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={doc.full_name} size="md" online={doc.is_available} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{doc.full_name}</p>
                    <p className="text-xs text-brand-600">{doc.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1"><Star size={10} className="text-yellow-400 fill-yellow-400" />{doc.rating}</div>
                  <span className="text-green-600 font-medium">${doc.consultation_fee}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Step 3: Date & Time */}
      {step === 3 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Choose Date & Time</h2>
            <button onClick={() => setStep(2)} className="text-sm text-brand-600 hover:underline">← Back</button>
          </div>
          <div className="max-w-sm">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Appointment Date</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">Available Slots</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {TIME_SLOTS.map(slot => (
                <button key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-colors ${selectedSlot === slot ? 'bg-brand-600 text-white border-brand-600' : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-brand-300 hover:bg-brand-50'}`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          <Button onClick={() => setStep(4)} disabled={!selectedDate || !selectedSlot}>Continue</Button>
        </motion.div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 max-w-md">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Confirm Booking</h2>
            <button onClick={() => setStep(3)} className="text-sm text-brand-600 hover:underline">← Back</button>
          </div>
          <Card>
            {(() => {
              const doc = doctors.find(d => d.id === selectedDoctor);
              const dept = departments.find(d => d.id === selectedDept);
              return (
                <div className="space-y-4">
                  {doc && (
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                      <Avatar name={doc.full_name} size="lg" />
                      <div>
                        <p className="font-semibold text-gray-900">{doc.full_name}</p>
                        <p className="text-sm text-gray-500">{doc.specialty}</p>
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Department', value: dept?.name ?? '' },
                      { label: 'Date',       value: selectedDate },
                      { label: 'Time',       value: selectedSlot },
                      { label: 'Fee',        value: `$${doc?.consultation_fee ?? 0}` },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium text-gray-800">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span className="text-brand-600">${doc?.consultation_fee ?? 0}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </Card>
          {bookError && <p className="text-red-500 text-sm">{bookError}</p>}
          <div className="flex gap-3">
            <Button onClick={handleBook} className="flex-1">Confirm Booking</Button>
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Start Over</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
