import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format date to readable string */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  }).format(new Date(dateStr));
}

/** Format time from 24h to 12h */
export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

/** Get initials from full name */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Format currency */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
}

/** Format large numbers */
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
}

/** Get status color class */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    scheduled:   'badge-blue',
    confirmed:   'badge-teal',
    in_progress: 'badge-amber',
    completed:   'badge-green',
    cancelled:   'badge-red',
    no_show:     'badge-gray',
    waiting:     'badge-blue',
    called:      'badge-amber',
    done:        'badge-green',
    skipped:     'badge-red',
  };
  return map[status] ?? 'badge-gray';
}

/** Delay utility */
export const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

/** Get greeting based on time */
export function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/** Truncate text */
export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
