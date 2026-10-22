import { describe, expect, it } from 'vitest';
import { money, typeLabel } from './format';

describe('format', () => {
  it('formats cents as USD', () => {
    expect(money(245000)).toBe('$2,450');
    expect(money(450, 2)).toBe('$4.50');
  });

  it('labels order types', () => {
    expect(typeLabel('CONSOLIDATION')).toBe('Consolidation');
    expect(typeLabel('CROSS_DOCK')).toBe('Cross-Dock');
  });
});
