import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, AuthContextType, RegisterData, UserRole } from '@/types';

// ─── Mock user data for development ────────────────────────────────────────
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@mediqueue.com': {
    password: 'admin123',
    user: {
      id: 'usr_admin_1',
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
      id: 'usr_doctor_1',
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
      id: 'usr_reception_1',
      email: 'reception@mediqueue.com',
      full_name: 'Sarah Mitchell',
      role: 'reception',
      avatar_url: '',
      phone: '+1 (555) 003-0003',
      created_at: new Date().toISOString(),
    },
  },
  'patient@mediqueue.com': {
    password: 'patient123',
    user: {
      id: 'usr_patient_1',
      email: 'patient@mediqueue.com',
      full_name: 'Michael Johnson',
      role: 'patient',
      avatar_url: '',
      phone: '+1 (555) 004-0004',
      created_at: new Date().toISOString(),
    },
  },
};

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('mq_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // simulate network
    const record = MOCK_USERS[email.toLowerCase()];
    if (!record || record.password !== password) {
      setIsLoading(false);
      throw new Error('Invalid email or password.');
    }
    setUser(record.user);
    localStorage.setItem('mq_user', JSON.stringify(record.user));
    setIsLoading(false);
    // TODO: replace with supabase.auth.signInWithPassword({ email, password })
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: data.email,
      full_name: data.full_name,
      role: data.role as UserRole,
      phone: data.phone,
      created_at: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('mq_user', JSON.stringify(newUser));
    setIsLoading(false);
    // TODO: replace with supabase.auth.signUp(...)
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 400));
    setUser(null);
    localStorage.removeItem('mq_user');
    setIsLoading(false);
    // TODO: replace with supabase.auth.signOut()
  }, []);

  const resetPassword = useCallback(async (_email: string) => {
    await new Promise(r => setTimeout(r, 800));
    // TODO: supabase.auth.resetPasswordForEmail(email)
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
