import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { OrderListItem } from '../api/types';
import { formatWhen, roleLabel, typeLabel } from '../lib/format';
import { statusVariant } from '../lib/status';
import { Badge } from './ui/Badge';

export function OrderCard({
  order,
  compact = false,
}: {
  order: OrderListItem;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const refs = order.subOrders;
  const alertBorder = order.hasAlert ? 'border-t-2 border-t-red-600' : '';
  const draftStyle = order.isDraft ? 'border-dashed opacity-80' : '';

  return (
    <Link
      to={`/orders/${order.number}`}
      data-testid="order-card"
      className={`order-card flex flex-col gap-2.5 rounded-[10px] border border-line bg-white p-4 transition hover:border-link hover:shadow-[0_4px_12px_rgba(31,78,121,0.08)] ${alertBorder} ${draftStyle}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex flex-wrap items-baseline gap-2">
            <div className="text-[15px] font-bold text-navy-deep">
              {order.number}
            </div>
            {refs.length > 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen((v) => !v);
                }}
                className="inline-flex items-baseline gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[12px] font-extrabold text-brand"
              >
                <span className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                  Ref N
                </span>
                <span className="font-mono">
                  {refs.length}
                  {compact ? '' : ' refs'}
                </span>
                <span className="text-[9px]">{open ? '▴' : '▾'}</span>
              </button>
            ) : order.refNumber ? (
              <span className="font-mono text-[13px]">
                <span className="mr-1 text-[9px] font-bold uppercase tracking-wide text-gray-400">
                  Ref N:
                </span>
                <span className="font-extrabold text-brand">{order.refNumber}</span>
              </span>
            ) : null}
          </div>
          <div className="text-[11px] text-muted">
            {typeLabel(order.type)}
            {order.service ? ` · ${order.service}` : ''}
            {refs.length > 0 ? ` · ${refs.length} sub` : ''}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1 text-[10.5px] text-muted">
            <span className="text-gray-400">by</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-0.5 pr-2 pl-0.5 font-bold text-navy">
              <span
                className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-extrabold text-white"
                style={{ background: order.createdBy.avatarColor ?? '#5B21B6' }}
              >
                {order.createdBy.code}
              </span>
              {order.createdBy.name}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${
                order.createdBy.role === 'ADMIN'
                  ? 'bg-violet-100 text-violet-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {roleLabel(order.createdBy.role)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={order.type === 'CONSOLIDATION' ? 'consol' : 'simple'}>
            {typeLabel(order.type)}
          </Badge>
          <Badge variant={statusVariant(order.statusLabel, order.hasAlert)}>
            {order.statusLabel}
          </Badge>
        </div>
      </div>

      {open && refs.length > 0 ? (
        <div className="rounded-md border border-red-200 bg-red-50/40 p-2">
          {refs.map((s) => (
            <div
              key={s.number}
              className="grid grid-cols-[110px_1fr_auto] gap-2 border-b border-dashed border-red-100 py-1 text-[11px] last:border-0"
            >
              <span className="font-mono font-bold text-violet-800">{s.number}</span>
              <span className="font-mono font-extrabold text-brand">{s.refNumber}</span>
              <span className="text-muted">
                {s.pallets} pallets
                {s.alert ? (
                  <em className="ml-1 text-red-600">⚠ {s.alert}</em>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <Field k="Hub" v={order.hub.name} />
        <Field k="Date" v={formatWhen(order.scheduledAt, !compact)} />
        <Field k="Q-ty" v={order.qtyLabel ?? '—'} />
        <Field k="Carrier" v={order.carrier ?? '—'} />
        {!compact && order.destination ? (
          <Field
            k="Destination"
            v={`${order.destination}${order.destinationNote ? ` · ${order.destinationNote}` : ''}`}
            wide={!order.trailersCount}
          />
        ) : null}
        {!compact && order.trailersCount ? (
          <div>
            <div className="text-muted">Trailers</div>
            <div className="font-semibold text-navy">
              <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[11px] font-extrabold text-violet-800">
                {order.trailersCount} consolidated
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t border-dashed border-line pt-2.5 text-xs text-muted">
        <div
          className={
            order.nextStepUrgent ? 'font-bold text-red-600' : undefined
          }
        >
          {order.nextStepUrgent ? '⚠ ' : ''}
          {order.isDraft ? 'Continue editing →' : `Next: ${order.nextStep ?? '—'}`}
        </div>
        <div className="flex gap-2">
          {order.isDraft ? (
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded bg-gray-100 text-[11px]">
              🗑
            </span>
          ) : (
            ['💬', '📷', '📄', '🖨', '⏱'].map((ic) => (
              <span
                key={ic}
                className="flex h-[22px] w-[22px] items-center justify-center rounded bg-gray-100 text-[11px]"
              >
                {ic}
              </span>
            ))
          )}
        </div>
      </div>
    </Link>
  );
}

function Field({
  k,
  v,
  wide,
}: {
  k: string;
  v: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? 'col-span-2' : undefined}>
      <div className="text-muted">{k}</div>
      <div className="font-semibold text-navy">{v}</div>
    </div>
  );
}
