import supabase from './supabase';
import { 
  APPOINTMENTS, 
  QUEUE_ENTRIES, 
  DOCTORS, 
  PATIENTS, 
  DEPARTMENTS, 
  NOTIFICATIONS, 
  MEDICAL_HISTORY 
} from './mockData';

// ─── LocalStorage Keys ────────────────────────────────────────────────────────
const KEYS = {
  APPOINTMENTS: 'mq_appointments',
  QUEUE: 'mq_queue_entries',
  DOCTORS: 'mq_doctors',
  PATIENTS: 'mq_patients',
  DEPARTMENTS: 'mq_departments',
  NOTIFICATIONS: 'mq_notifications',
  MEDICAL_HISTORY: 'mq_medical_history',
};

// ─── Initialize Local Storage ────────────────────────────────────────────────
function initLocalStorage() {
  if (!localStorage.getItem(KEYS.APPOINTMENTS)) {
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(APPOINTMENTS));
  }
  if (!localStorage.getItem(KEYS.QUEUE)) {
    localStorage.setItem(KEYS.QUEUE, JSON.stringify(QUEUE_ENTRIES));
  }
  if (!localStorage.getItem(KEYS.DOCTORS)) {
    localStorage.setItem(KEYS.DOCTORS, JSON.stringify(DOCTORS));
  }
  if (!localStorage.getItem(KEYS.PATIENTS)) {
    localStorage.setItem(KEYS.PATIENTS, JSON.stringify(PATIENTS));
  }
  if (!localStorage.getItem(KEYS.DEPARTMENTS)) {
    localStorage.setItem(KEYS.DEPARTMENTS, JSON.stringify(DEPARTMENTS));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(NOTIFICATIONS));
  }
  if (!localStorage.getItem(KEYS.MEDICAL_HISTORY)) {
    localStorage.setItem(KEYS.MEDICAL_HISTORY, JSON.stringify(MEDICAL_HISTORY));
  }
}

initLocalStorage();

// Helper to check if Supabase is actually configured and reachable
async function isSupabaseActive(): Promise<boolean> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) {
    return false;
  }
  try {
    // Simple ping to verify table exists and is readable
    const { error } = await supabase.from('departments').select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
}

// ─── Data Service ─────────────────────────────────────────────────────────────
export const dataService = {
  // ─── DEPARTMENTS ────────────────────────────────────────────────────────────
  async getDepartments(): Promise<any[]> {
    if (await isSupabaseActive()) {
      const { data, error } = await supabase.from('departments').select('*').order('name');
      if (!error && data && data.length > 0) return data.map(d => ({
        id: d.id,
        name: d.name,
        head: 'Dr. James Wilson',
        doctors: 5,
        patients_today: 12,
        color: 'from-blue-500 to-sky-600',
        icon: '🏥',
        description: `${d.name} Department`
      }));
    }
    return JSON.parse(localStorage.getItem(KEYS.DEPARTMENTS) || '[]');
  },

  // ─── DOCTORS ────────────────────────────────────────────────────────────────
  async getDoctors(): Promise<any[]> {
    if (await isSupabaseActive()) {
      const { data, error } = await supabase.from('doctors').select('*').order('name');
      if (!error && data && data.length > 0) return data.map(d => ({
        id: d.id,
        full_name: `Dr. ${d.name}`,
        specialty: d.specialization || 'Specialist',
        qualification: 'MD',
        experience_years: 10,
        department: d.department || 'General',
        is_available: true,
        consultation_fee: 100,
        rating: 4.8,
        total_reviews: 120,
        patients_today: 5,
        avatar_url: ''
      }));
    }
    return JSON.parse(localStorage.getItem(KEYS.DOCTORS) || '[]');
  },

  async updateDoctorAvailability(id: string, isAvailable: boolean): Promise<boolean> {
    if (await isSupabaseActive()) {
      // Availability column not in database schema, fallback/success
      return true;
    }
    const docs = await this.getDoctors();
    const updated = docs.map(d => d.id === id ? { ...d, is_available: isAvailable } : d);
    localStorage.setItem(KEYS.DOCTORS, JSON.stringify(updated));
    return true;
  },

  // ─── PATIENTS ───────────────────────────────────────────────────────────────
  async getPatients(): Promise<any[]> {
    if (await isSupabaseActive()) {
      const { data, error } = await supabase.from('patients').select('*').order('name');
      if (!error && data && data.length > 0) return data.map(p => ({
        id: p.id,
        full_name: p.name,
        email: p.email,
        date_of_birth: '1990-01-01',
        gender: 'other',
        blood_group: 'O+',
        phone: '+1 (555) 019-2834',
        address: 'City Hospital',
        last_visit: new Date().toISOString().split('T')[0],
        total_visits: 1
      }));
    }
    return JSON.parse(localStorage.getItem(KEYS.PATIENTS) || '[]');
  },

  async createPatient(patient: any): Promise<any> {
    if (await isSupabaseActive()) {
      const dbPatient = {
        name: patient.full_name || patient.name,
        email: patient.email
      };
      const { data, error } = await supabase.from('patients').insert([dbPatient]).select().single();
      if (!error && data) {
        return {
          id: data.id,
          full_name: data.name,
          email: data.email,
          date_of_birth: '1990-01-01',
          gender: 'other',
          blood_group: 'O+',
          phone: '+1 (555) 019-2834',
          address: 'City Hospital',
          last_visit: new Date().toISOString().split('T')[0],
          total_visits: 1
        };
      }
    }
    const patients = await this.getPatients();
    const newPatient = { id: `p${Date.now()}`, ...patient, total_visits: 1, last_visit: new Date().toISOString().split('T')[0] };
    patients.push(newPatient);
    localStorage.setItem(KEYS.PATIENTS, JSON.stringify(patients));
    return newPatient;
  },

  // ─── APPOINTMENTS ───────────────────────────────────────────────────────────
  async getAppointments(): Promise<any[]> {
    if (await isSupabaseActive()) {
      const { data: appts, error } = await supabase.from('appointments').select('*').order('appointment_date', { ascending: false });
      if (!error && appts && appts.length > 0) {
        const { data: pts } = await supabase.from('patients').select('*');
        const { data: docs } = await supabase.from('doctors').select('*');
        const ptMap = new Map(pts?.map(p => [p.id, p]) || []);
        const docMap = new Map(docs?.map(d => [d.id, d]) || []);

        return appts.map(appt => {
          const p = ptMap.get(appt.patient_id);
          const d = docMap.get(appt.doctor_id);
          const dateObj = new Date(appt.appointment_date);
          return {
            id: appt.id,
            patient_id: appt.patient_id,
            doctor_id: appt.doctor_id,
            patient: p?.name || 'Unknown Patient',
            doctor: d ? `Dr. ${d.name}` : 'Unknown Doctor',
            dept: d?.department || 'General',
            date: dateObj.toISOString().split('T')[0],
            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: appt.status,
            reason: 'Medical Consultation',
            fee: 100,
            queue: 1
          };
        });
      }
    }
    return JSON.parse(localStorage.getItem(KEYS.APPOINTMENTS) || '[]');
  },

  async createAppointment(appt: any): Promise<any> {
    if (await isSupabaseActive()) {
      const dbAppt = {
        patient_id: appt.patient_id || 'p1',
        doctor_id: appt.doctor_id || 'd1',
        appointment_date: appt.appointment_date || `${appt.date || new Date().toISOString().split('T')[0]}T${appt.time || '09:00:00'}`,
        status: appt.status || 'scheduled'
      };
      const { data, error } = await supabase.from('appointments').insert([dbAppt]).select().single();
      if (!error && data) {
        return data;
      }
    }
    const appts = await this.getAppointments();
    const newAppt = {
      id: `A${Math.floor(1000 + Math.random() * 9000)}`,
      ...appt,
      status: 'scheduled',
      created_at: new Date().toISOString(),
    };
    appts.push(newAppt);
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(appts));

    // Also auto-create a notification
    await this.createNotification({
      title: 'Appointment Booked',
      message: `Your appointment with ${appt.doctor || 'your specialist'} has been scheduled.`,
      type: 'success',
    });

    return newAppt;
  },

  async updateAppointmentStatus(id: string, status: string): Promise<boolean> {
    if (await isSupabaseActive()) {
      const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
      if (!error) return true;
    }
    const appts = await this.getAppointments();
    const updated = appts.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem(KEYS.APPOINTMENTS, JSON.stringify(updated));
    return true;
  },

  // ─── QUEUE MANAGEMENT ────────────────────────────────────────────────────────
  async getQueue(): Promise<any[]> {
    if (await isSupabaseActive()) {
      const { data: qEntries, error } = await supabase.from('queues').select('*').order('token_number');
      if (!error && qEntries && qEntries.length > 0) {
        const { data: pts } = await supabase.from('patients').select('*');
        const ptMap = new Map(pts?.map(p => [p.id, p]) || []);
        return qEntries.map(q => {
          const p = ptMap.get(q.patient_id);
          return {
            id: q.id,
            patient_id: q.patient_id,
            queue_number: q.token_number,
            patient: p?.name || 'Unknown Patient',
            doctor: 'Dr. James Wilson',
            dept: 'Cardiology',
            check_in: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: q.status,
            wait: 15
          };
        });
      }
    }
    return JSON.parse(localStorage.getItem(KEYS.QUEUE) || '[]');
  },

  async checkInPatient(apptId: string): Promise<any> {
    const appts = await this.getAppointments();
    const appt = appts.find(a => a.id === apptId);
    if (!appt) return null;

    let patientId = 'p1';
    let patientName = 'Unknown Patient';
    let doctorName = 'Dr. James Wilson';
    let deptName = 'Cardiology';

    if (await isSupabaseActive()) {
      const { data: dbAppt } = await supabase.from('appointments').select('*').eq('id', apptId).single();
      if (dbAppt) {
        patientId = dbAppt.patient_id;
        const { data: p } = await supabase.from('patients').select('*').eq('id', patientId).single();
        if (p) patientName = p.name;
        const { data: d } = await supabase.from('doctors').select('*').eq('id', dbAppt.doctor_id).single();
        if (d) {
          doctorName = `Dr. ${d.name}`;
          deptName = d.department;
        }
      }
    }

    if (await isSupabaseActive()) {
      const { data: existingQueues } = await supabase.from('queues').select('token_number');
      const tokenNumber = existingQueues && existingQueues.length > 0
        ? Math.max(...existingQueues.map(q => q.token_number)) + 1
        : 1;

      const { data, error } = await supabase.from('queues').insert([{
        patient_id: patientId,
        token_number: tokenNumber,
        status: 'waiting',
      }]).select().single();

      if (!error && data) {
        await this.updateAppointmentStatus(apptId, 'confirmed');
        return {
          id: data.id,
          queue_number: data.token_number,
          patient: patientName,
          doctor: doctorName,
          dept: deptName,
          check_in: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: data.status,
          wait: 15
        };
      }
    }

    const queue = await this.getQueue();
    const queueNumber = queue.length > 0 ? Math.max(...queue.map(q => q.queue_number)) + 1 : 1;
    const newEntry = {
      id: `q${Date.now()}`,
      queue_number: queueNumber,
      patient: appt.patient,
      doctor: appt.doctor,
      dept: appt.dept,
      check_in: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'waiting',
      wait: queue.filter(q => q.status === 'waiting').length * 10 + 5,
    };
    queue.push(newEntry);
    localStorage.setItem(KEYS.QUEUE, JSON.stringify(queue));

    // Update appointment status to in_progress or confirmed
    await this.updateAppointmentStatus(apptId, 'confirmed');

    // Create system notification
    await this.createNotification({
      title: 'Patient Checked In',
      message: `${appt.patient} has checked in and is number #${queueNumber} in the queue.`,
      type: 'info',
    });

    return newEntry;
  },

  async updateQueueStatus(id: string, status: string): Promise<boolean> {
    if (await isSupabaseActive()) {
      const { error } = await supabase.from('queues').update({ status }).eq('id', id);
      if (!error) return true;
    }
    const queue = await this.getQueue();
    const updated = queue.map(q => q.id === id ? { ...q, status } : q);
    localStorage.setItem(KEYS.QUEUE, JSON.stringify(updated));
    return true;
  },

  // ─── NOTIFICATIONS ──────────────────────────────────────────────────────────
  async getNotifications(): Promise<any[]> {
    // Falls back to localStorage directly as table doesn't exist in user schema
    return JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
  },

  async createNotification(notif: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error' }): Promise<any> {
    const newNotif = {
      id: `n${Date.now()}`,
      ...notif,
      read: false,
      time: 'Just now',
      created_at: new Date().toISOString(),
    };
    const notifs = await this.getNotifications();
    notifs.unshift(newNotif);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return newNotif;
  },

  async markNotificationRead(id: string): Promise<boolean> {
    const notifs = await this.getNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return true;
  },

  async markAllNotificationsRead(): Promise<boolean> {
    const notifs = await this.getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return true;
  },

  async deleteNotification(id: string): Promise<boolean> {
    const notifs = await this.getNotifications();
    const updated = notifs.filter(n => n.id !== id);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return true;
  },

  // ─── MEDICAL HISTORY ────────────────────────────────────────────────────────
  async getMedicalHistory(): Promise<any[]> {
    // Falls back to localStorage directly as table doesn't exist in user schema
    return JSON.parse(localStorage.getItem(KEYS.MEDICAL_HISTORY) || '[]');
  },

  async createHistoryRecord(record: any): Promise<any> {
    const history = await this.getMedicalHistory();
    const newRecord = {
      id: `mh${Date.now()}`,
      ...record,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };
    history.unshift(newRecord);
    localStorage.setItem(KEYS.MEDICAL_HISTORY, JSON.stringify(history));
    return newRecord;
  },
};

export default dataService;
