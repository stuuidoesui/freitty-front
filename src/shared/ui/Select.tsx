import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export const Select = ({
  label,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) => {
  return (
    <select
      aria-label={label}
      className={cn('rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs', className)}
      {...props}
    />
  );
};
