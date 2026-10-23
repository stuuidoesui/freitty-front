import type { OrderStatus } from '@/shared/api/types';
import type { BadgeVariant } from '@/shared/styles/badge-variants';

const STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
  DRAFT: 'done',
  NEW: 'new',
  READY: 'prog',
  IN_PROGRESS: 'prog',
  ON_STOCK: 'prog',
  CONSOLIDATED: 'consol',
  IN_TRANSIT: 'prog',
  DECONSOLIDATED: 'neutral',
  COMPLETED: 'done',
  CLOSED: 'done',
};

export const statusVariant = (status: OrderStatus, hasAlert: boolean): BadgeVariant => {
  if (hasAlert) return 'alert';
  return STATUS_VARIANT[status];
};
