import { cn } from '@/shared/lib/cn';

export const buttonVariants = {
  primary: 'border-transparent bg-brand text-white hover:bg-brand-dark',
  outline: 'border-link bg-white text-navy-deep hover:bg-slate-50',
  ghost: 'border-transparent bg-transparent text-muted hover:text-navy',
} as const;

export const buttonSizes = {
  sm: 'px-3 py-[7px] text-xs',
  md: 'px-4 py-2 text-[13px]',
} as const;

export const buttonClass = (
  variant: keyof typeof buttonVariants = 'outline',
  size: keyof typeof buttonSizes = 'sm',
) => {
  return cn(
    'inline-flex items-center justify-center gap-1.5 rounded-md border font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link disabled:opacity-40',
    buttonVariants[variant],
    buttonSizes[size],
  );
};
