import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { dataService } from '@/lib/dataService';
import type { User, AuthContextType, RegisterData, UserRole } from '@/types';

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount and listen to Auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session?.user) {
          const u: User = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'User',
            role: (session.user.user_metadata?.role as UserRole) || 'patient',
            phone: session.user.user_metadata?.phone,
            created_at: session.user.created_at,
          };
          setUser(u);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u: User = {
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || 'User',
          role: (session.user.user_metadata?.role as UserRole) || 'patient',
          phone: session.user.user_metadata?.phone,
          created_at: session.user.created_at,
        };
        setUser(u);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user) throw new Error('Login failed. No user returned.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: data.role,
            phone: data.phone,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Registration failed.');

      if (data.role === 'patient') {
        // Attempt to create patient record in DB. If it fails due to RLS or missing table, we log it.
        try {
          await dataService.createPatient({
            id: authData.user.id,
            user_id: authData.user.id,
            full_name: data.full_name,
            email: data.email.toLowerCase(),
            phone: data.phone,
          });
        } catch (dbErr) {
          console.error('Patient record creation warning:', dbErr);
          // Don't fail the registration if the DB insert fails (e.g. table not ready)
        }
      }

      // Automatically sign in immediately after registration
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (loginError) {
        console.warn('Auto-login after registration failed (email verification might be required):', loginError);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
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
