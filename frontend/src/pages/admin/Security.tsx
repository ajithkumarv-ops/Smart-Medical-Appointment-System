import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, Key, History, Eye, EyeOff } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminSecurity() {
  const [showKey, setShowKey] = useState(false);

  const securityLogs = [
    { id: '1', action: 'Failed Login Attempt', user: 'admin@mediqueue.com', ip: '192.168.1.105', time: '10 mins ago', status: 'blocked' },
    { id: '2', action: 'Role Update (Doctor -> Admin)', user: 'superadmin@mediqueue.com', ip: '192.168.1.100', time: '1 hour ago', status: 'success' },
    { id: '3', action: 'Password Change Request', user: 'doctor@mediqueue.com', ip: '192.168.1.112', time: '3 hours ago', status: 'success' },
    { id: '4', action: 'API Key Generated', user: 'admin@mediqueue.com', ip: '192.168.1.100', time: '1 day ago', status: 'success' },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Security & Access</h1>
        <p className="page-subtitle">Manage system access, keys, and view security audits</p>
      </motion.div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-emerald-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">SSL / Encryption</p>
              <h3 className="text-xl font-bold text-gray-900 mt-0.5">TLS 1.3 Active</h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-brand-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Key size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Supabase Auth</p>
              <h3 className="text-xl font-bold text-gray-900 mt-0.5">MFA Optional</h3>
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-amber-500">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert size={22} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Recent Threats</p>
              <h3 className="text-xl font-bold text-gray-900 mt-0.5">0 Detected</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Credentials */}
        <Card>
          <CardHeader title="API Credentials" subtitle="Supabase environment configuration" icon={<Key size={18} />} />
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Supabase URL</label>
              <input 
                type="text" 
                readOnly 
                value="https://xyzcompany.supabase.co" 
                className="w-full px-4 py-2.5 text-sm font-mono rounded-xl border border-gray-200 bg-gray-50 text-gray-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Anon Key</label>
              <div className="relative">
                <input 
                  type={showKey ? 'text' : 'password'} 
                  readOnly 
                  value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzaG5kc2prc..." 
                  className="w-full px-4 py-2.5 pr-12 text-sm font-mono rounded-xl border border-gray-200 bg-gray-50 text-gray-600 focus:outline-none"
                />
                <button 
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="pt-2">
              <Button size="sm" variant="secondary" className="w-full">Rotate Credentials</Button>
            </div>
          </div>
        </Card>

        {/* Security Audit Log */}
        <Card>
          <CardHeader title="Security Audit" subtitle="Recent actions & event log" icon={<History size={18} />} />
          <div className="space-y-3">
            {securityLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-all">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-2.5 h-2.5 rounded-full ${log.status === 'blocked' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{log.action}</p>
                    <p className="text-xs text-gray-400">{log.user} · IP: {log.ip}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-medium">{log.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
