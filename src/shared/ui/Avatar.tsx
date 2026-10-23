import { cn } from '@/shared/lib/cn';

const sizes = {
  sm: 'h-4 w-4 text-[8px]',
  md: 'h-[18px] w-[18px] text-[9px]',
  lg: 'h-7 w-7 text-[11px]',
} as const;

export const Avatar = ({
  code,
  color,
  size = 'md',
}: {
  code: string;
  color?: string;
  size?: keyof typeof sizes;
}) => {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-extrabold text-white',
        sizes[size],
      )}
      style={{ background: color ?? '#0EA5E9' }}
    >
      {code}
    </span>
  );
};
