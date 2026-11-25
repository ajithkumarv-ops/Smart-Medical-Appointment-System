import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatNumber } from '@/utils';

interface StatCardProps {
  label:    string;
  value:    string | number;
  icon:     React.ElementType;
  color:    string;  // tailwind gradient class e.g. "from-blue-500 to-blue-600"
  trend?:   { value: number; label: string };
  subtitle?: string;
  delay?:   number;
}

export function StatCard({ label, value, icon: Icon, color, trend, subtitle, delay = 0 }: StatCardProps) {
  const isUp   = (trend?.value ?? 0) > 0;
  const isFlat = (trend?.value ?? 0) === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.4,0,0.2,1] }}
      whileHover={{ y: -2 }}
      className="stat-card group"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="font-display text-3xl font-bold text-gray-900 leading-none">
          {typeof value === 'number' ? formatNumber(value) : value}
        </p>
        {trend && (
          <div className={cn('flex items-center gap-1 mt-1.5 text-xs font-semibold', isUp ? 'text-green-600' : isFlat ? 'text-gray-400' : 'text-red-500')}>
            {isUp ? <TrendingUp size={12} /> : isFlat ? <Minus size={12} /> : <TrendingDown size={12} />}
            <span>{isUp ? '+' : ''}{trend.value}% {trend.label}</span>
          </div>
        )}
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
