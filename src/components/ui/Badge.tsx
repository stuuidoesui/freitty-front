import type { ReactNode } from 'react';
import type { BadgeVariant } from '../../lib/status';

const styles: Record<BadgeVariant, string> = {
  new: 'bg-emerald-100 text-emerald-800',
  prog: 'bg-blue-100 text-blue-800',
  alert: 'bg-red-100 text-red-800',
  done: 'bg-gray-200 text-gray-700',
  warn: 'bg-amber-100 text-amber-800',
  consol: 'bg-violet-100 text-violet-800',
  simple: 'bg-cyan-100 text-cyan-800',
  neutral: 'bg-gray-100 text-gray-700',
};

export function Badge({
  children,
  variant = 'neutral',
}: {
  children: ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
