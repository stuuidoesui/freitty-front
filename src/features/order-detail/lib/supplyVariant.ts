import type { BadgeVariant } from '@/shared/styles/badge-variants';

export const supplyVariant = (category: string): BadgeVariant => {
  if (/secure/i.test(category)) return 'prog';
  if (/edge|corner/i.test(category)) return 'warn';
  if (/wrap/i.test(category)) return 'new';
  return 'simple';
};
