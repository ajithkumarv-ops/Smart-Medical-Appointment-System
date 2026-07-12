// ─── TypeScript interfaces for the Smart Medical Appointment System ───

export type UserRole = 'admin' | 'doctor' | 'reception' | 'patient';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  user_id: string;
  full_name: string;
  specialty: string;
  qualification: string;
  experience_years: number;
  bio?: string;
  avatar_url?: string;
  department_id: string;
  is_available: boolean;
  consultation_fee: number;
  rating: number;
  total_reviews: number;
  available_days: string[];
  available_slots: string[];
}

export interface Patient {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  blood_group?: string;
  phone: string;
  address?: string;
  emergency_contact?: string;
  medical_history?: string;
  avatar_url?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  head_doctor_id?: string;
  icon?: string;
  color?: string;
}

export type AppointmentStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  department_id: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  queue_number?: number;
  created_at: string;
  patient?: Patient;
  doctor?: Doctor;
  department?: Department;
}

export type QueueStatus = 'waiting' | 'called' | 'in_progress' | 'done' | 'skipped';

export interface QueueEntry {
  id: string;
  appointment_id: string;
  queue_number: number;
  status: QueueStatus;
  check_in_time?: string;
  called_time?: string;
  estimated_wait_minutes?: number;
  appointment?: Appointment;
}

export interface Stats {
  total_appointments: number;
  todays_appointments: number;
  total_patients: number;
  total_doctors: number;
  average_wait_time: number;
  completed_today: number;
  cancelled_today: number;
  revenue_today: number;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  phone?: string;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}
