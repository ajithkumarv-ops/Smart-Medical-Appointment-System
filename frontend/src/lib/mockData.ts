// ─── Shared Mock Data ─────────────────────────────────────────────────────────

export const DOCTORS = [
  { id: 'd1', full_name: 'Dr. James Wilson',   specialty: 'Cardiologist',    qualification: 'MD, FACC', experience_years: 15, department: 'Cardiology',   is_available: true,  consultation_fee: 150, rating: 4.9, total_reviews: 342, patients_today: 12, avatar_url: '' },
  { id: 'd2', full_name: 'Dr. Sarah Lee',       specialty: 'Neurologist',     qualification: 'MD, PhD',  experience_years: 12, department: 'Neurology',    is_available: true,  consultation_fee: 180, rating: 4.8, total_reviews: 278, patients_today: 8,  avatar_url: '' },
  { id: 'd3', full_name: 'Dr. Mark Thompson',  specialty: 'Orthopedist',     qualification: 'MBBS, MS', experience_years: 10, department: 'Orthopedics', is_available: false, consultation_fee: 120, rating: 4.7, total_reviews: 195, patients_today: 15, avatar_url: '' },
  { id: 'd4', full_name: 'Dr. Anna Chen',       specialty: 'Dermatologist',   qualification: 'MD',       experience_years: 8,  department: 'Dermatology', is_available: true,  consultation_fee: 100, rating: 4.9, total_reviews: 421, patients_today: 6,  avatar_url: '' },
  { id: 'd5', full_name: 'Dr. John Smith',      specialty: 'General Physician',qualification: 'MBBS',    experience_years: 20, department: 'General',     is_available: true,  consultation_fee: 80,  rating: 4.6, total_reviews: 562, patients_today: 18, avatar_url: '' },
  { id: 'd6', full_name: 'Dr. Priya Sharma',   specialty: 'Pediatrician',    qualification: 'MD',       experience_years: 9,  department: 'Pediatrics',  is_available: true,  consultation_fee: 110, rating: 4.8, total_reviews: 310, patients_today: 10, avatar_url: '' },
];

export const PATIENTS = [
  { id: 'p1', full_name: 'Emily Johnson',  date_of_birth: '1990-05-14', gender: 'female', blood_group: 'A+', phone: '+1 (555) 101-0001', address: '123 Main St, NY', last_visit: '2024-06-20', total_visits: 8  },
  { id: 'p2', full_name: 'Michael Brown',  date_of_birth: '1985-09-22', gender: 'male',   blood_group: 'O-', phone: '+1 (555) 102-0002', address: '456 Oak Ave, CA', last_visit: '2024-06-18', total_visits: 14 },
  { id: 'p3', full_name: 'Jessica Davis',  date_of_birth: '1995-03-07', gender: 'female', blood_group: 'B+', phone: '+1 (555) 103-0003', address: '789 Elm Rd, TX',  last_visit: '2024-06-15', total_visits: 3  },
  { id: 'p4', full_name: 'Robert Wilson',  date_of_birth: '1978-11-30', gender: 'male',   blood_group: 'AB+',phone: '+1 (555) 104-0004', address: '321 Pine Dr, FL', last_visit: '2024-06-10', total_visits: 22 },
  { id: 'p5', full_name: 'Linda Martinez', date_of_birth: '2000-07-19', gender: 'female', blood_group: 'O+', phone: '+1 (555) 105-0005', address: '654 Maple Ln, IL', last_visit: '2024-06-08', total_visits: 5  },
  { id: 'p6', full_name: 'David Garcia',   date_of_birth: '1969-02-28', gender: 'male',   blood_group: 'A-', phone: '+1 (555) 106-0006', address: '987 Cedar Ct, WA', last_visit: '2024-06-05', total_visits: 31 },
];

export const APPOINTMENTS = [
  { id: 'A001', patient: 'Emily Johnson',  doctor: 'Dr. James Wilson',  dept: 'Cardiology',  date: '2024-06-21', time: '09:00 AM', status: 'completed',   reason: 'Annual cardiac checkup',       fee: 150, queue: 1  },
  { id: 'A002', patient: 'Michael Brown',  doctor: 'Dr. Sarah Lee',     dept: 'Neurology',   date: '2024-06-21', time: '10:30 AM', status: 'in_progress', reason: 'Migraine consultation',          fee: 180, queue: 2  },
  { id: 'A003', patient: 'Jessica Davis',  doctor: 'Dr. Mark Thompson', dept: 'Orthopedics', date: '2024-06-21', time: '11:00 AM', status: 'confirmed',   reason: 'Knee pain follow-up',           fee: 120, queue: 3  },
  { id: 'A004', patient: 'Robert Wilson',  doctor: 'Dr. Anna Chen',     dept: 'Dermatology', date: '2024-06-21', time: '01:15 PM', status: 'scheduled',   reason: 'Skin rash evaluation',          fee: 100, queue: 4  },
  { id: 'A005', patient: 'Linda Martinez', doctor: 'Dr. John Smith',    dept: 'General',     date: '2024-06-21', time: '02:30 PM', status: 'cancelled',   reason: 'Routine checkup',               fee: 80,  queue: 5  },
  { id: 'A006', patient: 'David Garcia',   doctor: 'Dr. Priya Sharma',  dept: 'Pediatrics',  date: '2024-06-21', time: '03:00 PM', status: 'scheduled',   reason: "Child's vaccination",           fee: 110, queue: 6  },
  { id: 'A007', patient: 'Emily Johnson',  doctor: 'Dr. Sarah Lee',     dept: 'Neurology',   date: '2024-06-22', time: '09:30 AM', status: 'scheduled',   reason: 'Follow-up neurological exam',  fee: 180, queue: 7  },
  { id: 'A008', patient: 'Michael Brown',  doctor: 'Dr. James Wilson',  dept: 'Cardiology',  date: '2024-06-22', time: '11:00 AM', status: 'scheduled',   reason: 'ECG and stress test',          fee: 150, queue: 8  },
];

export const DEPARTMENTS = [
  { id: 'dep1', name: 'Cardiology',   head: 'Dr. James Wilson',  doctors: 6,  patients_today: 42, color: 'from-red-500 to-rose-600',      icon: '❤️', description: 'Heart & cardiovascular diseases' },
  { id: 'dep2', name: 'Neurology',    head: 'Dr. Sarah Lee',     doctors: 4,  patients_today: 28, color: 'from-purple-500 to-violet-600', icon: '🧠', description: 'Brain & nervous system disorders' },
  { id: 'dep3', name: 'Orthopedics', head: 'Dr. Mark Thompson', doctors: 5,  patients_today: 35, color: 'from-blue-500 to-sky-600',     icon: '🦴', description: 'Bone & joint conditions' },
  { id: 'dep4', name: 'Dermatology', head: 'Dr. Anna Chen',     doctors: 3,  patients_today: 22, color: 'from-pink-500 to-rose-500',    icon: '🌸', description: 'Skin, hair & nail conditions' },
  { id: 'dep5', name: 'General',     head: 'Dr. John Smith',    doctors: 8,  patients_today: 61, color: 'from-green-500 to-emerald-600',icon: '🏥', description: 'General medicine & primary care' },
  { id: 'dep6', name: 'Pediatrics',  head: 'Dr. Priya Sharma',  doctors: 4,  patients_today: 18, color: 'from-yellow-500 to-amber-500', icon: '👶', description: 'Children\'s healthcare' },
  { id: 'dep7', name: 'Emergency',   head: 'Dr. Kevin Brown',   doctors: 10, patients_today: 88, color: 'from-orange-500 to-red-500',   icon: '🚨', description: 'Emergency & trauma care' },
];

export const QUEUE_ENTRIES = [
  { id: 'q1', queue_number: 1, patient: 'Emily Johnson',   doctor: 'Dr. James Wilson',  dept: 'Cardiology',  check_in: '08:55 AM', status: 'done',        wait: 0  },
  { id: 'q2', queue_number: 2, patient: 'Michael Brown',   doctor: 'Dr. Sarah Lee',     dept: 'Neurology',   check_in: '09:10 AM', status: 'in_progress', wait: 0  },
  { id: 'q3', queue_number: 3, patient: 'Jessica Davis',   doctor: 'Dr. Mark Thompson', dept: 'Orthopedics', check_in: '09:30 AM', status: 'called',      wait: 5  },
  { id: 'q4', queue_number: 4, patient: 'Robert Wilson',   doctor: 'Dr. Anna Chen',     dept: 'Dermatology', check_in: '10:00 AM', status: 'waiting',     wait: 18 },
  { id: 'q5', queue_number: 5, patient: 'Linda Martinez',  doctor: 'Dr. John Smith',    dept: 'General',     check_in: '10:05 AM', status: 'waiting',     wait: 32 },
  { id: 'q6', queue_number: 6, patient: 'David Garcia',    doctor: 'Dr. Priya Sharma',  dept: 'Pediatrics',  check_in: '10:15 AM', status: 'waiting',     wait: 45 },
];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Appointment Confirmed',    message: 'Your appointment with Dr. James Wilson is confirmed for June 22 at 9:30 AM.', type: 'success', read: false, time: '10 min ago' },
  { id: 'n2', title: 'Queue Update',             message: 'You are now #4 in queue. Estimated wait time: 18 minutes.',                    type: 'info',    read: false, time: '25 min ago' },
  { id: 'n3', title: 'Prescription Ready',       message: 'Your prescription from Dr. Sarah Lee is ready for download.',                   type: 'info',    read: true,  time: '2 hours ago' },
  { id: 'n4', title: 'Appointment Reminder',     message: 'Reminder: You have an appointment tomorrow at 11:00 AM.',                      type: 'warning', read: true,  time: '1 day ago' },
  { id: 'n5', title: 'Lab Results Available',    message: 'Your lab results are now available. Please review them with your doctor.',      type: 'info',    read: true,  time: '2 days ago' },
];

export const MEDICAL_HISTORY = [
  { id: 'mh1', date: '2024-06-20', doctor: 'Dr. James Wilson',  dept: 'Cardiology',  diagnosis: 'Hypertension – Stage 1',       prescription: 'Amlodipine 5mg, Lisinopril 10mg', followup: '2024-07-20', notes: 'Maintain low-sodium diet, exercise 30 min/day.' },
  { id: 'mh2', date: '2024-04-15', doctor: 'Dr. Sarah Lee',     dept: 'Neurology',   diagnosis: 'Migraine with aura',           prescription: 'Sumatriptan 50mg PRN',             followup: '2024-05-15', notes: 'Avoid triggers: stress, bright lights.' },
  { id: 'mh3', date: '2024-02-10', doctor: 'Dr. John Smith',    dept: 'General',     diagnosis: 'Acute upper respiratory tract infection', prescription: 'Azithromycin 500mg × 3 days', followup: 'None',      notes: 'Rest, fluids, vitamin C.' },
  { id: 'mh4', date: '2023-11-05', doctor: 'Dr. Anna Chen',     dept: 'Dermatology', diagnosis: 'Contact dermatitis',           prescription: 'Hydrocortisone cream 1%',          followup: '2023-12-05', notes: 'Avoid allergen, apply moisturizer.' },
];

export const STAFF = [
  { id: 's1', full_name: 'Sarah Mitchell', role: 'Head Receptionist', dept: 'Administration', status: 'active',  shift: 'Morning',   joined: '2021-03-15' },
  { id: 's2', full_name: 'Kevin Brown',    role: 'Nurse',             dept: 'Emergency',       status: 'active',  shift: 'Evening',   joined: '2020-07-01' },
  { id: 's3', full_name: 'Lisa Park',      role: 'Lab Technician',    dept: 'Pathology',       status: 'active',  shift: 'Morning',   joined: '2022-01-10' },
  { id: 's4', full_name: 'Tom Nguyen',     role: 'Pharmacist',        dept: 'Pharmacy',        status: 'on_leave',shift: 'Night',     joined: '2019-09-20' },
  { id: 's5', full_name: 'Mary Adams',     role: 'Radiologist',       dept: 'Radiology',       status: 'active',  shift: 'Morning',   joined: '2020-04-05' },
];
