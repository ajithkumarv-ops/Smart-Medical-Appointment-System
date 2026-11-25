import React from 'react';
import { cn, getStatusColor } from '@/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'red' | 'amber' | 'purple' | 'teal' | 'gray';
  status?: string;
  dot?: boolean;
  className?: string;
}

const dotColorMap: Record<string, string> = {
  'badge-blue':   'bg-blue-500',
  'badge-green':  'bg-green-500',
  'badge-red':    'bg-red-500',
  'badge-amber':  'bg-amber-500',
  'badge-purple': 'bg-purple-500',
  'badge-teal':   'bg-teal-500',
  'badge-gray':   'bg-gray-400',
};

export function Badge({ children, variant, status, dot, className }: BadgeProps) {
  const colorClass = status
    ? getStatusColor(status)
    : variant
      ? `badge-${variant}`
      : 'badge-gray';

  return (
    <span className={cn(colorClass, className)}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColorMap[colorClass] ?? 'bg-gray-400')} />
      )}
      {children}
    </span>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  return (
    <Badge status={status} dot className={className}>
      {label}
    </Badge>
  );
}
