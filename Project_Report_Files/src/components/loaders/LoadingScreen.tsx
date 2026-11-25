import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-hero">
      {/* Animated Medical Cross */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="mb-8"
      >
        <div className="relative w-20 h-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-4 border-white/20"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-1 rounded-full border-4 border-t-white/80 border-transparent"
          />
          {/* Cross icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-8 h-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-full bg-white rounded-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2.5 bg-white rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center"
      >
        <h1 className="font-display text-3xl font-bold text-white tracking-wide mb-1">
          Medi<span className="text-blue-300">Queue</span>
        </h1>
        <p className="text-blue-200 text-sm font-medium">{message}</p>
      </motion.div>

      {/* Dots animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-2 mt-8"
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-2.5 h-2.5 bg-blue-300 rounded-full"
          />
        ))}
      </motion.div>
    </div>
  );
}

// ─── Inline spinner ──────────────────────────────────────────────────────────
export function Spinner({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `3px solid rgba(27,79,216,0.15)`,
        borderTopColor: '#1B4FD8',
      }}
    />
  );
}
