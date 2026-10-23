import type { ReactNode } from 'react';
import { badgeStyles, type BadgeVariant } from '@/shared/styles/badge-variants';

export const Badge = ({
  children,
  variant = 'neutral',
}: {
  children: ReactNode;
  variant?: BadgeVariant;
}) => {
  return (
    <span
      className={`inline-block rounded-full px-2 py-[3px] text-[10px] font-bold tracking-[0.3px] uppercase ${badgeStyles[variant]}`}
    >
      {children}
    </span>
  );
};
