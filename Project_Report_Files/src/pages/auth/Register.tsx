import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, ArrowRight, ArrowLeft, Hospital, Check } from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input, PasswordInput, Select } from '@/components/ui/Input';
import type { UserRole } from '@/types';

const ROLE_OPTIONS = [
  { value: 'patient',   label: '🩺 Patient — Book appointments & track queue' },
  { value: 'doctor',    label: '👨‍⚕️ Doctor — Manage schedule & patient records' },
  { value: 'reception', label: '🏥 Reception — Handle check-ins & queue' },
];

const STEPS = ['Account Type', 'Personal Info', 'Security'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const [form, setForm] = useState({
    role:      'patient' as UserRole,
    full_name: '',
    email:     '',
    phone:     '',
    password:  '',
    confirm:   '',
  });

  const set = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }));

  const validateStep = (): boolean => {
    setError('');
    if (step === 0 && !form.role) { setError('Please select your account type.'); return false; }
    if (step === 1) {
      if (!form.full_name.trim()) { setError('Full name is required.'); return false; }
      if (!form.email.includes('@')) { setError('Enter a valid email address.'); return false; }
    }
    if (step === 2) {
      if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return false; }
      if (form.password !== form.confirm) { setError('Passwords do not match.'); return false; }
    }
    return true;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => { setError(''); setStep(s => s - 1); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      await register({ email: form.email, password: form.password, full_name: form.full_name, role: form.role, phone: form.phone });
      navigate(`/${form.role}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="auth-card p-8 lg:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto mb-4 shadow-brand">
            <Hospital size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join MediQueue today</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < step  ? 'bg-green-500 text-white' :
                  i === step ? 'bg-gradient-brand text-white shadow-brand' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-[10px] font-medium ${i === step ? 'text-brand-600' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-3 transition-colors duration-500 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); next(); }}>
          <AnimatePresence mode="wait">
            {/* Step 0: Role */}
            {step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Select
                  id="register-role"
                  label="Account Type"
                  options={ROLE_OPTIONS}
                  value={form.role}
                  onChange={e => set('role', e.target.value)}
                  required
                />
                <p className="text-xs text-gray-400 mt-2">* Admin accounts are created by system administrators.</p>
              </motion.div>
            )}

            {/* Step 1: Personal info */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <Input
                  id="register-name"
                  label="Full Name"
                  placeholder="John Doe"
                  value={form.full_name}
                  onChange={e => set('full_name', e.target.value)}
                  leftIcon={<User size={16} />}
                  required
                />
                <Input
                  id="register-email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  leftIcon={<Mail size={16} />}
                  required
                />
                <Input
                  id="register-phone"
                  type="tel"
                  label="Phone Number"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  leftIcon={<Phone size={16} />}
                />
              </motion.div>
            )}

            {/* Step 2: Security */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <PasswordInput
                  id="register-password"
                  label="Password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  hint="Use a mix of letters, numbers, and symbols"
                  required
                />
                <PasswordInput
                  id="register-confirm"
                  label="Confirm Password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={e => set('confirm', e.target.value)}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium"
            >
              {error}
            </motion.p>
          )}

          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <Button type="button" variant="secondary" onClick={back} leftIcon={<ArrowLeft size={16} />}>
                Back
              </Button>
            )}
            <Button
              type="submit"
              isLoading={loading}
              className="flex-1"
              rightIcon={step < 2 ? <ArrowRight size={16} /> : undefined}
            >
              {step < 2 ? 'Continue' : 'Create Account'}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
