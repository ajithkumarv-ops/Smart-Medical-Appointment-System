import supabase from './supabase';

// Helper to check if Supabase is actually configured
async function isSupabaseActive(): Promise<boolean> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key || url.includes('placeholder')) {
    return false;
  }
  return true;
}

// ─── Data Service ─────────────────────────────────────────────────────────────
export const dataService = {
  // ─── DEPARTMENTS ────────────────────────────────────────────────────────────
  async getDepartments(): Promise<any[]> {
    if (!(await isSupabaseActive())) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from('departments').select('*').order('name');
    if (error) throw new Error(`Failed to fetch departments: ${error.message}`);
    return data || [];
  },

  // ─── DOCTORS ────────────────────────────────────────────────────────────────
  async getDoctors(): Promise<any[]> {
    if (!(await isSupabaseActive())) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from('doctors').select('*').order('name');
    if (error) throw new Error(`Failed to fetch doctors: ${error.message}`);
    
    // Default values if some columns are missing
    return data?.map(d => ({
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
      patients_today: 0,
      avatar_url: ''
    })) || [];
  },

  async updateDoctorAvailability(_id: string, _isAvailable: boolean): Promise<boolean> {
    if (!(await isSupabaseActive())) throw new Error("Supabase is not configured.");
    // In a real app we'd update a column in DB, here we'll just mock success if table doesn't have it
    return true;
  },

  // ─── PATIENTS ───────────────────────────────────────────────────────────────
  async getPatients(): Promise<any[]> {
    if (!(await isSupabaseActive())) throw new Error("Supabase is not configured.");
    const { data, error } = await supabase.from('patients').select('*').order('name');
    if (error) throw new Error(`Failed to fetch patients: ${error.message}`);
    
    return data?.map(p => ({
      id: p.id,
      full_name: p.name,
      email: p.email,
      date_of_birth: '1990-01-01', // Defaults
      gender: 'other',
      blood_group: 'O+',
      phone: '+1 (555) 019-2834',
      address: 'City Hospital',
      last_visit: new Date().toISOString().split('T')[0],
      total_visits: 1
    })) || [];
  },

  async createPatient(patient: any): Promise<any> {
    if (!(await isSupabaseActive())) throw new Error("Supabase is not configured.");
    const dbPatient = {
      id: patient.id, // Explicitly use the auth UUID
      name: patient.full_name || patient.name,
      email: patient.email,
      phone: patient.phone
    };
    const { data, error } = await supabase.from('patients').insert([dbPatient]).select().single();
    if (error) throw new Error(`Failed to create patient: ${error.message}`);
    
    return {
      id: data.id,
      full_name: data.name,
      email: data.email,
      date_of_birth: '1990-01-01',
      gender: 'other',
      blood_group: 'O+',
      phone: data.phone || '+1 (555) 019-2834',
      address: 'City Hospital',
      last_visit: new Date().toISOString().split('T')[0],
      total_visits: 1
    };
  },

  // ─── APPOINTMENTS ───────────────────────────────────────────────────────────
  async getAppointments(): Promise<any[]> {
    if (!(await isSupabaseActive())) throw new Error("Supabase is not configured.");
    const { data: appts, error } = await supabase.from('appointments').select('*').order('appointment_date', { ascending: false });
    if (error) throw new Error(`Failed to fetch appointments: ${error.message}`);
    
    const { data: pts } = await supabase.from('patients').select('*');
    const { data: docs } = await supabase.from('doctors').select('*');
    const ptMap = new Map(pts?.map(p => [p.id, p]) || []);
    const docMap = new Map(docs?.map(d => [d.id, d]) || []);

    return appts?.map(appt => {
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
    }) || [];
  },

  async createAppointment(appt: any): Promise<any> {
    if (!(await isSupabaseActive())) throw new Error("Supabase is not configured.");
    if (!appt.patient_id || appt.patient_id.startsWith('p') || appt.patient_id.startsWith('local-')) {
      throw new Error('Cannot create appointment: A valid database patient UUID is required.');
    }
    const dbAppt = {
      patient_id: appt.patient_id,
      doctor_id: appt.doctor_id,
      appointment_date: appt.appointment_date || `${appt.date || new Date().toISOString().split('T')[0]}T${appt.time || '09:00:00'}`,
      status: appt.status || 'scheduled'
    };
    const { data, error } = await supabase.from('appointments').insert([dbAppt]).select().single();
    if (error) {
      console.error('[dataService] createAppointment error:', error);
      throw new Error(`Failed to book appointment: ${error.message}`);
    }
    return data;
  },

  async updateAppointmentStatus(id: string, status: string): Promise<boolean> {
    if (!(await isSupabaseActive())) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if (error) throw new Error(`Failed to update appointment status: ${error.message}`);
    return true;
  },

  // ─── QUEUE MANAGEMENT ────────────────────────────────────────────────────────
  async getQueue(): Promise<any[]> {
    if (!(await isSupabaseActive())) throw new Error("Supabase is not configured.");
    const { data: qEntries, error } = await supabase.from('queues').select('*').order('token_number');
    if (error) {
      console.error('[dataService] getQueue error:', error);
      return [];
    }
    
    const { data: pts } = await supabase.from('patients').select('*');
    const { data: appts } = await supabase.from('appointments').select('*');
    const { data: docs } = await supabase.from('doctors').select('*');

    const ptMap = new Map(pts?.map(p => [p.id, p]) || []);
    const apptMap = new Map(appts?.map(a => [a.patient_id, a]) || []);
    const docMap = new Map(docs?.map(d => [d.id, d]) || []);

    return qEntries?.map(q => {
      const p = ptMap.get(q.patient_id);
      const appt = apptMap.get(q.patient_id);
      const doc = appt ? docMap.get(appt.doctor_id) : null;
      return {
        id: q.id,
        patient_id: q.patient_id,
        queue_number: q.token_number,
        patient: p?.name || 'Unknown Patient',
        doctor: doc ? `Dr. ${doc.name}` : 'Unknown',
        dept: doc?.department || 'General',
        check_in: new Date(q.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: q.status,
        wait: 15
      };
    }) || [];
  },

  async checkInPatient(apptId: string): Promise<any> {
    if (!(await isSupabaseActive())) throw new Error("Supabase is not configured.");
    const { data: dbAppt, error: apptError } = await supabase.from('appointments').select('*').eq('id', apptId).single();
    if (apptError || !dbAppt) {
      throw new Error(`Failed to fetch appointment for check-in: ${apptError?.message || 'Appointment not found'}`);
    }

    const patientId = dbAppt.patient_id;
    const { data: p } = await supabase.from('patients').select('*').eq('id', patientId).single();
    const patientName = p?.name || 'Unknown Patient';
    
    const { data: d } = await supabase.from('doctors').select('*').eq('id', dbAppt.doctor_id).single();
    const doctorName = d ? `Dr. ${d.name}` : 'Unknown';
    const deptName = d?.department || 'General';

    const { data: existingQueues } = await supabase.from('queues').select('token_number');
    const tokenNumber = existingQueues && existingQueues.length > 0
      ? Math.max(...existingQueues.map(q => q.token_number)) + 1
      : 1;

    const { data, error } = await supabase.from('queues').insert([{
      patient_id: patientId,
      token_number: tokenNumber,
      status: 'waiting',
    }]).select().single();

    if (error) {
      console.error('[dataService] checkInPatient insert queue error:', error);
      throw new Error(`Failed to insert queue entry: ${error.message}`);
    }

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
  },

  async updateQueueStatus(id: string, status: string): Promise<boolean> {
    if (!(await isSupabaseActive())) throw new Error("Supabase is not configured.");
    const { error } = await supabase.from('queues').update({ status }).eq('id', id);
    if (error) throw new Error(`Failed to update queue status: ${error.message}`);
    return true;
  },

  // ─── NOTIFICATIONS ──────────────────────────────────────────────────────────
  async getNotifications(): Promise<any[]> {
    if (!(await isSupabaseActive())) return [];
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('[dataService] getNotifications error:', error);
      return [];
    }
    return data || [];
  },

  async createNotification(notif: { title: string; message: string; type: 'info' | 'success' | 'warning' | 'error'; user_id?: string }): Promise<any> {
    if (!(await isSupabaseActive())) return null;
    const newNotif = {
      title: notif.title,
      message: notif.message,
      type: notif.type,
      user_id: notif.user_id,
      read: false,
    };
    const { data, error } = await supabase.from('notifications').insert([newNotif]).select().single();
    if (error) throw new Error(`Failed to create notification: ${error.message}`);
    return data;
  },

  async markNotificationRead(id: string): Promise<boolean> {
    if (!(await isSupabaseActive())) return false;
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) throw new Error(`Failed to mark notification read: ${error.message}`);
    return true;
  },

  async markAllNotificationsRead(): Promise<boolean> {
    if (!(await isSupabaseActive())) return false;
    const { error } = await supabase.from('notifications').update({ read: true }).neq('id', '0'); // update all
    if (error) throw new Error(`Failed to mark all notifications read: ${error.message}`);
    return true;
  },

  async deleteNotification(id: string): Promise<boolean> {
    if (!(await isSupabaseActive())) return false;
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) throw new Error(`Failed to delete notification: ${error.message}`);
    return true;
  },

  // ─── STAFF ────────────────────────────────────────────────────────────────
  async getStaff(): Promise<any[]> {
    if (!(await isSupabaseActive())) return [];
    const { data, error } = await supabase.from('staff').select('*');
    if (error) {
      console.error('[dataService] getStaff error:', error);
      return [];
    }
    return data || [];
  },

  // ─── MEDICAL HISTORY ────────────────────────────────────────────────────────
  async getMedicalHistory(): Promise<any[]> {
    // Falls back to localStorage directly as table doesn't exist in user schema
    return JSON.parse(localStorage.getItem('mq_medical_history') || '[]');
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
    localStorage.setItem('mq_medical_history', JSON.stringify(history));
    return newRecord;
  },
};

export default dataService;
