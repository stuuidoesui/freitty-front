import type { OrderListItem } from '@/shared/api/types';

export const PipeCard = ({ order }: { order: OrderListItem }) => {
  return (
    <div className="rounded-md border border-line bg-white p-2 text-2xs">
      <div className="font-bold text-navy-deep">{order.number}</div>
      <div className="text-muted">{order.hub.name}</div>
      <div className="mt-1 font-semibold text-navy">{order.qtyLabel ?? '—'}</div>
    </div>
  );
};
