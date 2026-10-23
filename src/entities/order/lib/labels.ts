import type { Operation, OrderStatus, OrderType } from '@/shared/api/types';

export const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  CONSOLIDATION: 'Consolidation',
  CROSS_DOCK: 'Cross-Dock',
};

export const typeLabel = (type: OrderType): string => {
  return ORDER_TYPE_LABEL[type];
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  DRAFT: 'Draft',
  NEW: 'New',
  READY: 'Ready',
  IN_PROGRESS: 'In progress',
  ON_STOCK: 'On stock',
  CONSOLIDATED: 'Consolidated',
  IN_TRANSIT: 'In transit',
  DECONSOLIDATED: 'Deconsolidated',
  COMPLETED: 'Completed',
  CLOSED: 'Closed',
};

export const operationLabel = (type: Operation['type']): string => {
  return type.charAt(0) + type.slice(1).toLowerCase();
};

export const cargoSummary = (
  lines: { qty: number; unit: 'STANDARD' | 'XL'; unitSize: string | null }[],
): string => {
  if (lines.length === 0) return '—';
  return lines
    .map((line) => {
      const unit = line.unit === 'XL' ? 'XL' : 'Standard';
      return `${line.qty} × ${unit}${line.unitSize ? ` ${line.unitSize}` : ''}`;
    })
    .join(' · ');
};
