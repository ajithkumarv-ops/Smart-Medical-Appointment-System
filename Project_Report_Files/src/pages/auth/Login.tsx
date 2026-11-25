import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Hospital } from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input, PasswordInput } from '@/components/ui/Input';

const DEMO_ACCOUNTS = [
  { role: 'Admin',     email: 'admin@mediqueue.com',     password: 'admin123',     color: 'bg-purple-100 text-purple-700' },
  { role: 'Doctor',    email: 'doctor@mediqueue.com',    password: 'doctor123',    color: 'bg-blue-100 text-blue-700' },
  { role: 'Reception', email: 'reception@mediqueue.com', password: 'reception123', color: 'bg-teal-100 text-teal-700' },
  { role: 'Patient',   email: 'patient@mediqueue.com',   password: 'patient123',   color: 'bg-green-100 text-green-700' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // Redirect to role dashboard
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="auth-card p-8 lg:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center mx-auto mb-4 shadow-brand">
            <Hospital size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your MediQueue account</p>
        </div>

        {/* Demo accounts */}
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Demo Accounts</p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(d => (
              <button
                key={d.role}
                type="button"
                onClick={() => fillDemo(d.email, d.password)}
                className={`text-xs font-semibold px-3 py-2 rounded-xl transition-all hover:opacity-80 ${d.color}`}
              >
                {d.role}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Input
            id="login-email"
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            leftIcon={<Mail size={16} />}
            autoComplete="email"
            required
          />
          <PasswordInput
            id="login-password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="remember-me" className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-400" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-brand-600 font-medium hover:text-brand-700 transition-colors">
              Forgot password?
            </Link>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium"
            >
              {error}
            </motion.div>
          )}

          <Button
            type="submit"
            isLoading={loading}
            className="w-full text-base py-3.5"
            rightIcon={<ArrowRight size={18} />}
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:text-brand-700 transition-colors">
            Create account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
