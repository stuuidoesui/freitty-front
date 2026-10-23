import type { UserRole } from '@/shared/api/types';

export const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: 'Admin',
  DISPATCHER: 'Dispatcher',
  FLOOR_LEAD: 'Floor lead',
  DRIVER: 'Driver',
};

export const roleLabel = (role: UserRole): string => {
  return ROLE_LABEL[role];
};
