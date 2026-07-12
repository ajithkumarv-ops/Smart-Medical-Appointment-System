import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hospital, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero text-white p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 text-center max-w-md w-full glass rounded-3xl p-8 lg:p-10 border border-white/10"
      >
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} className="text-amber-400" />
        </div>

        <h1 className="font-display text-7xl font-extrabold text-white tracking-tight mb-2">
          404
        </h1>
        <h2 className="font-display text-xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-blue-200 text-sm leading-relaxed mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="secondary" className="w-full sm:w-auto" leftIcon={<ArrowLeft size={16} />}>
              Go to Homepage
            </Button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white border-2 border-white/20 hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
          >
            Go Back
          </button>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="mt-12 flex items-center gap-2 text-blue-300 text-sm opacity-60">
        <Hospital size={16} />
        <span>MediQueue System</span>
      </div>
    </div>
  );
}
