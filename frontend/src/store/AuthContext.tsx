import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabase';
import type { User, AuthContextType, RegisterData, UserRole } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────
// DEMO / STAFF ACCOUNTS  (Admin · Doctor · Reception)
// These roles don't have patient records in the DB.
// ─────────────────────────────────────────────────────────────────────────────
const DEMO_STAFF: Record<string, { password: string; user: User }> = {
  'admin@mediqueue.com': {
    password: 'admin123',
    user: {
      id: 'demo-admin-001',
      email: 'admin@mediqueue.com',
      full_name: 'Dr. Alexandra Chen',
      role: 'admin',
      avatar_url: '',
      phone: '+1 (555) 001-0001',
      created_at: new Date().toISOString(),
    },
  },
  'doctor@mediqueue.com': {
    password: 'doctor123',
    user: {
      id: 'demo-doctor-001',
      email: 'doctor@mediqueue.com',
      full_name: 'Dr. James Wilson',
      role: 'doctor',
      avatar_url: '',
      phone: '+1 (555) 002-0002',
      created_at: new Date().toISOString(),
    },
  },
  'reception@mediqueue.com': {
    password: 'reception123',
    user: {
      id: 'demo-reception-001',
      email: 'reception@mediqueue.com',
      full_name: 'Sarah Mitchell',
      role: 'reception',
      avatar_url: '',
      phone: '+1 (555) 003-0003',
      created_at: new Date().toISOString(),
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PATIENT CREDENTIAL STORE  (localStorage)
// Supabase `patients` table has no password column, so we keep a local
// credential map keyed by lowercase email.
// ─────────────────────────────────────────────────────────────────────────────
const CRED_KEY = 'mq_patient_credentials';

type CredStore = Record<string, { password: string; full_name: string; phone?: string }>;

function readCredStore(): CredStore {
  try { return JSON.parse(localStorage.getItem(CRED_KEY) || '{}'); } catch { return {}; }
}
function writeCredStore(store: CredStore) {
  localStorage.setItem(CRED_KEY, JSON.stringify(store));
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE HELPERS  (direct queries — bypasses dataService)
// ─────────────────────────────────────────────────────────────────────────────

/** Look up patient row by email. Returns the raw DB row or null. */
async function fetchPatientByEmail(email: string): Promise<{ id: string; name: string; email: string } | null> {
  console.log('[Auth] fetchPatientByEmail → querying for:', email);
  const { data, error } = await supabase
    .from('patients')
    .select('id, name, email')
    .ilike('email', email)
    .maybeSingle();

  if (error) {
    console.error('[Auth] fetchPatientByEmail → Supabase error:', error.message, error.code, error.details);
    return null;
  }
  console.log('[Auth] fetchPatientByEmail → result:', data);
  return data as { id: string; name: string; email: string } | null;
}

/** Insert a new patient row. Throws on failure — never silently swallows errors. */
async function insertPatient(name: string, email: string): Promise<{ id: string; name: string; email: string }> {
  console.log('[Auth] insertPatient → inserting:', { name, email });

  const { data, error } = await supabase
    .from('patients')
    .insert([{ name, email }])
    .select('id, name, email')
    .single();

  if (error) {
    console.error('[Auth] insertPatient → Supabase INSERT error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw new Error(`Failed to save patient to database: ${error.message}`);
  }

  if (!data) {
    console.error('[Auth] insertPatient → INSERT returned no data (possible RLS issue)');
    throw new Error('Database insert returned no data. Check Supabase RLS policies on the patients table.');
  }

  console.log('[Auth] insertPatient → SUCCESS:', data);
  return data as { id: string; name: string; email: string };
}

// ─────────────────────────────────────────────────────────────────────────────
// SESSION STORAGE KEY
// ─────────────────────────────────────────────────────────────────────────────
const SESSION_KEY = 'mq_user';

// ─────────────────────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session on mount ───────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch { /* ignore corrupt cache */ }
    setIsLoading(false);
  }, []);

  // ── Persist session helper ─────────────────────────────────────────────────
  function persist(u: User) {
    setUser(u);
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    const lowerEmail = email.trim().toLowerCase();

    try {
      // 1. Check demo staff accounts first
      const staff = DEMO_STAFF[lowerEmail];
      if (staff) {
        if (staff.password !== password) throw new Error('Invalid email or password.');
        persist(staff.user);
        return;
      }

      // 2. Validate credentials against the local credential store
      const store = readCredStore();
      const cred = store[lowerEmail];
      if (!cred) throw new Error('No account found. Please register first.');
      if (cred.password !== password) throw new Error('Invalid email or password.');

      // 3. Fetch the real patient record from Supabase
      console.log('[Auth] login → fetching patient from Supabase for:', lowerEmail);
      let dbPatient = await fetchPatientByEmail(lowerEmail);

      // If not found in DB, create the record now (handles registrations that
      // may have failed to insert previously)
      if (!dbPatient) {
        console.warn('[Auth] login → patient not found in DB, creating now...');
        try {
          dbPatient = await insertPatient(cred.full_name, lowerEmail);
        } catch (insertErr) {
          console.error('[Auth] login → failed to auto-create patient:', insertErr);
          // Don't block login — they can still use the app; bookings will fail
          // until the DB issue is resolved
        }
      }

      if (!dbPatient) {
        console.error('[Auth] login → WARNING: no DB patient record. Bookings will not work.');
      }

      // 4. Build session user — always use Supabase id if available
      const sessionUser: User = {
        id: dbPatient?.id ?? `local-${lowerEmail}`,
        email: lowerEmail,
        full_name: dbPatient?.name ?? cred.full_name,
        role: 'patient' as UserRole,
        avatar_url: '',
        phone: cred.phone,
        created_at: new Date().toISOString(),
      };

      console.log('[Auth] login → session user id:', sessionUser.id);
      persist(sessionUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── REGISTER ───────────────────────────────────────────────────────────────
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    const lowerEmail = data.email.trim().toLowerCase();
    console.log('[Auth] register → starting for:', lowerEmail, 'role:', data.role);

    try {
      // Block staff email collision
      if (DEMO_STAFF[lowerEmail]) {
        throw new Error('This email is reserved. Please use a different email.');
      }

      // Block duplicate registration
      const store = readCredStore();
      if (store[lowerEmail]) {
        throw new Error('An account with this email already exists. Please log in.');
      }

      let dbId: string | null = null;

      // For patient role: MUST insert into Supabase patients table
      if (data.role === 'patient' || !data.role) {
        console.log('[Auth] register → patient role detected, inserting into DB...');

        // Check if patient already exists (idempotent)
        let existing = await fetchPatientByEmail(lowerEmail);

        if (existing) {
          console.log('[Auth] register → patient already exists in DB with id:', existing.id);
          dbId = existing.id;
        } else {
          // This will THROW if it fails — the error propagates to the UI
          const created = await insertPatient(data.full_name, lowerEmail);
          dbId = created.id;
          console.log('[Auth] register → new patient created with id:', dbId);
        }
      }

      // Only save credentials locally AFTER the DB insert succeeds
      const updatedStore = readCredStore();
      updatedStore[lowerEmail] = {
        password: data.password,
        full_name: data.full_name,
        phone: data.phone,
      };
      writeCredStore(updatedStore);
      console.log('[Auth] register → credentials saved locally');

      // Build and persist session
      const newUser: User = {
        id: dbId ?? `staff-${Date.now()}`,
        email: lowerEmail,
        full_name: data.full_name,
        role: (data.role as UserRole) ?? 'patient',
        avatar_url: '',
        phone: data.phone,
        created_at: new Date().toISOString(),
      };

      console.log('[Auth] register → session user id:', newUser.id);
      persist(newUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── LOGOUT ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 300));
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    setIsLoading(false);
  }, []);

  // ── RESET PASSWORD ─────────────────────────────────────────────────────────
  const resetPassword = useCallback(async (email: string) => {
    await new Promise(r => setTimeout(r, 800));
    const lowerEmail = email.trim().toLowerCase();
    const store = readCredStore();
    if (store[lowerEmail]) {
      console.log('[Auth] Password reset requested for', lowerEmail);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
