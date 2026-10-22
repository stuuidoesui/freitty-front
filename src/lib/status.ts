export type BadgeVariant =
  | 'new'
  | 'prog'
  | 'alert'
  | 'done'
  | 'warn'
  | 'consol'
  | 'simple'
  | 'neutral';

export function statusVariant(label: string, hasAlert: boolean): BadgeVariant {
  if (hasAlert || /alert/i.test(label)) return 'alert';
  const l = label.toLowerCase();
  if (l.includes('new')) return 'new';
  if (l.includes('progress') || l.includes('stock') || l.includes('ready'))
    return 'prog';
  if (l.includes('draft')) return 'done';
  if (l.includes('done') || l.includes('closed') || l.includes('completed'))
    return 'done';
  if (l.includes('warn') || l.includes('delta')) return 'warn';
  return 'neutral';
}
