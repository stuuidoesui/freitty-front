export function money(cents: number, digits = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(cents / 100);
}

export function formatWhen(iso: string | null | undefined, withTime = true): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
}

export function roleLabel(role: string): string {
  if (role === 'ADMIN') return 'Admin';
  if (role === 'DISPATCHER') return 'Dispatcher';
  if (role === 'FLOOR_LEAD') return 'Floor lead';
  if (role === 'DRIVER') return 'Driver';
  return role;
}

export function typeLabel(type: string): string {
  return type === 'CONSOLIDATION' ? 'Consolidation' : 'Cross-Dock';
}
