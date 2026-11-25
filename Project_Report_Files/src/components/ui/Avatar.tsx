import { cn, getInitials } from '@/utils';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  online?: boolean;
}

const sizeMap = {
  xs:  { container: 'w-6 h-6',   text: 'text-[9px]', dot: 'w-1.5 h-1.5' },
  sm:  { container: 'w-8 h-8',   text: 'text-xs',    dot: 'w-2 h-2' },
  md:  { container: 'w-10 h-10', text: 'text-sm',    dot: 'w-2.5 h-2.5' },
  lg:  { container: 'w-12 h-12', text: 'text-base',  dot: 'w-3 h-3' },
  xl:  { container: 'w-16 h-16', text: 'text-xl',    dot: 'w-3.5 h-3.5' },
  '2xl':{ container:'w-20 h-20', text: 'text-2xl',   dot: 'w-4 h-4' },
};

export function Avatar({ name = '', src, size = 'md', className, online }: AvatarProps) {
  const { container, text, dot } = sizeMap[size];
  const initials = getInitials(name);

  return (
    <div className={cn('relative shrink-0', className)}>
      <div
        className={cn(
          container,
          'rounded-full flex items-center justify-center overflow-hidden',
          'ring-2 ring-white shadow-sm',
          !src && 'bg-gradient-brand font-semibold text-white',
          text
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{initials || '?'}</span>
        )}
      </div>
      {online !== undefined && (
        <span
          className={cn(
            dot,
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            online ? 'bg-green-500' : 'bg-gray-300'
          )}
        />
      )}
    </div>
  );
}

interface AvatarGroupProps {
  users: Array<{ name: string; src?: string }>;
  max?: number;
  size?: AvatarProps['size'];
}

export function AvatarGroup({ users, max = 4, size = 'sm' }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const extra   = users.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((u, i) => (
        <Avatar key={i} name={u.name} src={u.src} size={size} className="ring-2 ring-white" />
      ))}
      {extra > 0 && (
        <div className={cn(
          sizeMap[size].container,
          'rounded-full bg-gray-100 ring-2 ring-white flex items-center justify-center',
          sizeMap[size].text,
          'text-gray-600 font-semibold shrink-0'
        )}>
          +{extra}
        </div>
      )}
    </div>
  );
}
