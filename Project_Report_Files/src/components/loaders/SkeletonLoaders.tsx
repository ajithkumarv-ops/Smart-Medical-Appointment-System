import { cn } from '@/utils';

// ─── Skeleton Base ──────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div className={cn('shimmer rounded-lg', className)} style={style} aria-hidden="true" />
  );
}

// ─── Stat Card Skeleton ──────────────────────────────────────────────────────
export function StatCardSkeleton() {
  return (
    <div className="card p-6 flex items-center gap-4">
      <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

// ─── Table Skeleton ──────────────────────────────────────────────────────────
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="divide-y divide-gray-50">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" style={{ opacity: 1 - j * 0.1 }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Card Skeleton ──────────────────────────────────────────────────────────
export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('card p-6 space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

// ─── List Skeleton ──────────────────────────────────────────────────────────
export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
          <Skeleton className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Page Header Skeleton ───────────────────────────────────────────────────
export function PageHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <Skeleton className="h-10 w-32 rounded-xl" />
    </div>
  );
}
