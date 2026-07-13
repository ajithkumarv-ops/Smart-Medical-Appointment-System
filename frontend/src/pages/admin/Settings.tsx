import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Save } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Configure system preferences and hospital details</p>
      </motion.div>

      {/* Hospital Info */}
      <Card>
        <CardHeader title="Hospital Information" subtitle="Basic details" icon={<Settings size={18} />} />
        <div className="space-y-4">
          {[
            { label: 'Hospital Name',    defaultValue: 'MediQueue General Hospital', type: 'text' },
            { label: 'Contact Email',    defaultValue: 'info@mediqueue.com',         type: 'email' },
            { label: 'Phone Number',     defaultValue: '+1 (555) 000-1234',          type: 'tel' },
            { label: 'Address',          defaultValue: '456 Health Avenue, New York, NY 10001', type: 'text' },
            { label: 'Registration No.', defaultValue: 'HOS-NY-2020-00123',          type: 'text' },
          ].map(field => (
            <div key={field.label}>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">{field.label}</label>
              <input
                type={field.type}
                defaultValue={field.defaultValue}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-300 bg-gray-50"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader title="Notifications" subtitle="Alert preferences" icon={<Bell size={18} />} />
        <div className="space-y-4">
          {[
            { label: 'Email notifications for new appointments', checked: true },
            { label: 'SMS alerts for emergency cases', checked: true },
            { label: 'Daily summary report', checked: false },
            { label: 'System health alerts', checked: true },
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

      {/* Security */}
      <Card>
        <CardHeader title="Security" subtitle="Access control" icon={<Shield size={18} />} />
        <div className="space-y-4">
          {[
            { label: 'Two-factor authentication', checked: false },
            { label: 'Session timeout (30 min)', checked: true },
            { label: 'IP whitelist enabled', checked: false },
            { label: 'Audit log retention (90 days)', checked: true },
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

      <div className="flex gap-3">
        <Button leftIcon={<Save size={16} />}>Save Changes</Button>
        <Button variant="secondary">Discard</Button>
      </div>
    </div>
  );
}
