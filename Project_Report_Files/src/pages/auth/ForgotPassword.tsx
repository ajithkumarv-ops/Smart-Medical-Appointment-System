import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ArrowLeft, Hospital, CheckCircle } from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setError('Enter a valid email address.'); return; }
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setError('Failed to send reset email. Please try again.');
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
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto mb-4 shadow-brand">
            <Hospital size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-gray-500 text-sm mt-1">We'll send you a reset link</p>
        </div>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <Input
                id="forgot-email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                leftIcon={<Mail size={16} />}
                error={error}
                required
              />

              <Button type="submit" isLoading={loading} className="w-full" rightIcon={<ArrowRight size={16} />}>
                Send Reset Link
              </Button>

              <Link to="/login" className="flex items-center justify-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 transition-colors mt-2">
                <ArrowLeft size={14} />
                Back to Sign In
              </Link>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="font-display text-lg font-semibold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm mb-6">
                We've sent a password reset link to <strong className="text-gray-700">{email}</strong>
              </p>
              <p className="text-xs text-gray-400 mb-6">Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-brand-600 font-medium hover:underline">try again</button>.
              </p>
              <Link to="/login">
                <Button variant="secondary" leftIcon={<ArrowLeft size={14} />}>Back to Sign In</Button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
