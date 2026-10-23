import { Link } from 'react-router-dom';
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  MessageSquare,
  Printer,
  Trash2,
  TriangleAlert,
} from 'lucide-react';
import { typeLabel } from '@/entities/order/lib/labels';
import { statusVariant } from '@/entities/order/lib/status';
import { UserBadge } from '@/entities/user/ui/UserBadge';
import type { OrderListItem } from '@/shared/api/types';
import { cn } from '@/shared/lib/cn';
import { formatWhen } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/Badge';
import { OrderField } from './OrderField';
import { RefNumber } from './RefNumber';

export const OrderCard = ({
  order,
  compact = false,
  open = false,
  onToggle,
}: {
  order: OrderListItem;
  compact?: boolean;
  open?: boolean;
  onToggle: (number: string) => void;
}) => {
  const refs = order.subOrders;

  return (
    <article
      data-testid="order-card"
      className={cn(
        'relative flex flex-col gap-2.5 rounded-card border border-line bg-white p-4 transition hover:border-link hover:shadow-[0_4px_12px_rgba(31,78,121,0.08)]',
        order.hasAlert && 'border-t-2 border-t-red-600',
        order.isDraft && 'border-dashed opacity-80',
      )}
    >
      <Link
        to={`/orders/${order.number}`}
        aria-label={`Open order ${order.number}`}
        className="absolute inset-0 z-0 rounded-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
      />

      <div className="pointer-events-none relative z-10 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <div className="text-[15px] font-bold text-navy-deep">{order.number}</div>
              {refs.length > 1 ? (
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => onToggle(order.number)}
                  className="pointer-events-auto inline-flex items-baseline gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[12px] font-extrabold text-brand"
                >
                  <span className="text-[9px] font-bold tracking-wide text-gray-400 uppercase">
                    Ref N
                  </span>
                  <span className="font-mono">
                    {refs.length}
                    {compact ? '' : ' refs'}
                  </span>
                  {open ? (
                    <ChevronUp className="size-3" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="size-3" aria-hidden="true" />
                  )}
                </button>
              ) : order.refNumber ? (
                <RefNumber value={order.refNumber} />
              ) : null}
            </div>
            <div className="text-2xs text-muted">
              {typeLabel(order.type)}
              {order.service ? ` · ${order.service}` : ''}
              {refs.length > 0 ? ` · ${refs.length} sub` : ''}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1 text-muted">
              <span className="text-[10.5px] text-gray-400">by</span>
              <UserBadge user={order.createdBy} size="sm" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-1">
            <Badge variant={order.type === 'CONSOLIDATION' ? 'consol' : 'simple'}>
              {typeLabel(order.type)}
            </Badge>
            <Badge variant={statusVariant(order.status, order.hasAlert)}>{order.statusLabel}</Badge>
          </div>
        </div>

        {open && refs.length > 0 ? (
          <div className="rounded-md border border-red-200 bg-red-50/40 p-2">
            {refs.map((sub) => (
              <div
                key={sub.number}
                className="grid grid-cols-[110px_1fr_auto] gap-2 border-b border-dashed border-red-100 py-1 text-2xs last:border-0"
              >
                <span className="font-mono font-bold text-violet-800">{sub.number}</span>
                <span className="font-mono font-extrabold text-brand">{sub.refNumber}</span>
                <span className="text-muted">
                  {sub.pallets} pallets
                  {sub.alert ? <em className="ml-1 text-red-600"> {sub.alert}</em> : null}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <OrderField label="Hub" value={order.hub.name} />
          <OrderField label="Date" value={formatWhen(order.scheduledAt, !compact)} />
          <OrderField label="Q-ty" value={order.qtyLabel ?? '—'} />
          <OrderField label="Carrier" value={order.carrier ?? '—'} />
          {!compact && order.destination ? (
            <OrderField
              label="Destination"
              value={`${order.destination}${order.destinationNote ? ` · ${order.destinationNote}` : ''}`}
              wide={!order.trailersCount}
            />
          ) : null}
          {!compact && order.trailersCount ? (
            <div>
              <div className="text-muted">Trailers</div>
              <div className="font-semibold text-navy">
                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-2xs font-extrabold text-violet-800">
                  {order.trailersCount} consolidated
                </span>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between border-t border-dashed border-line pt-2.5 text-xs text-muted">
          <div className={order.nextStepUrgent ? 'font-bold text-red-600' : undefined}>
            {order.nextStepUrgent ? (
              <TriangleAlert className="mr-1 inline size-3.5" aria-hidden="true" />
            ) : null}
            {order.isDraft ? 'Continue editing →' : `Next: ${order.nextStep ?? '—'}`}
          </div>
          <div className="flex gap-2" aria-hidden="true">
            {order.isDraft ? (
              <span className="flex h-[22px] w-[22px] items-center justify-center rounded bg-gray-100 text-muted">
                <Trash2 className="size-3" aria-hidden="true" />
              </span>
            ) : (
              (
                [
                  ['comments', MessageSquare],
                  ['photos', Camera],
                  ['documents', FileText],
                  ['print', Printer],
                  ['history', Clock],
                ] as const
              ).map(([id, Icon]) => (
                <span
                  key={id}
                  className="flex h-[22px] w-[22px] items-center justify-center rounded bg-gray-100 text-muted"
                >
                  <Icon className="size-3" aria-hidden="true" />
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
