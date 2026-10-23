const moneyFormat = new Map<number, Intl.NumberFormat>();

export const money = (cents: number, digits = 0): string => {
  let format = moneyFormat.get(digits);
  if (!format) {
    format = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    });
    moneyFormat.set(digits, format);
  }
  return format.format(cents / 100);
};

export const formatWhen = (iso: string | null | undefined, withTime = true): string => {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    day: 'numeric',
    month: 'short',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });
};
