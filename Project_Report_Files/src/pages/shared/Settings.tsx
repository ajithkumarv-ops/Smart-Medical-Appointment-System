import { motion } from 'framer-motion';
import { User, Lock, Bell, Save } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/store/AuthContext';
import { Avatar } from '@/components/ui/Avatar';

export default function UserSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your profile and preferences</p>
      </motion.div>

      {/* Profile Card */}
      <Card>
        <CardHeader title="Profile" subtitle="Personal information" icon={<User size={18} />} />
        <div className="flex items-center gap-4 mb-6">
          <Avatar name={user?.full_name ?? ''} size="xl" online />
          <div>
            <p className="font-semibold text-gray-900">{user?.full_name}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            <button className="text-xs text-brand-600 hover:underline mt-1">Change photo</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name',  value: user?.full_name ?? '', type: 'text' },
            { label: 'Email',      value: user?.email ?? '',     type: 'email', readOnly: true },
            { label: 'Phone',      value: user?.phone ?? '',     type: 'tel' },
            { label: 'Role',       value: user?.role ?? '',      type: 'text', readOnly: true },
          ].map(f => (
            <div key={f.label}>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">{f.label}</label>
              <input type={f.type} defaultValue={f.value} readOnly={f.readOnly}
                className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-300 ${f.readOnly ? 'bg-gray-100 border-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50 border-gray-200'}`}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader title="Change Password" subtitle="Update your password" icon={<Lock size={18} />} />
        <div className="space-y-4">
          {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
            <div key={label}>
              <label className="text-xs font-medium text-gray-600 mb-1.5 block">{label}</label>
              <input type="password" placeholder="••••••••"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-gray-50" />
            </div>
          ))}
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader title="Notifications" subtitle="Alert preferences" icon={<Bell size={18} />} />
        <div className="space-y-4">
          {[
            { label: 'Email notifications', checked: true },
            { label: 'SMS alerts',          checked: false },
            { label: 'Push notifications',  checked: true },
            { label: 'Appointment reminders', checked: true },
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-checked:bg-brand-600 rounded-full transition-colors" />
                <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm text-gray-700">{item.label}</span>
            </label>
          ))}
        </div>
      </Card>

      <Button leftIcon={<Save size={16} />}>Save Changes</Button>
    </div>
  );
}
