import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiError, api } from '../../api/client';
import { Badge } from '../../components/ui/Badge';
import { statusVariant } from '../../lib/status';
import { ErrorState } from '../../components/ui/EmptyState';
import { PageSkeleton } from '../../components/ui/Skeleton';
import { formatWhen, money, roleLabel, typeLabel } from '../../lib/format';

export function OrderDetailPage() {
  const { number = '' } = useParams();
  const q = useQuery({
    queryKey: ['order', number],
    queryFn: () => api.order(number),
    enabled: Boolean(number),
    retry: false,
  });

  if (q.isLoading) return <PageSkeleton />;
  if (q.isError) {
    const notFound = q.error instanceof ApiError && q.error.status === 404;
    return (
      <ErrorState
        message={notFound ? `Order ${number} was not found` : q.error.message}
        onRetry={notFound ? undefined : () => void q.refetch()}
      />
    );
  }
  const o = q.data;
  if (!o) return null;

  const delta = (o.actualQty ?? 0) - (o.declaredQty ?? 0);

  return (
    <div>
      <div className="mb-2 text-xs text-muted">
        <Link to="/orders" className="text-link">
          Orders
        </Link>{' '}
        <span>›</span> {o.number}
      </div>

      <div className="mb-3.5 flex items-center gap-3 border-b border-line py-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-[22px] font-black text-white">
          F
        </div>
        <div className="text-lg font-bold text-navy">
          {typeLabel(o.type)} management
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <Link
          to="/orders"
          className="rounded-md border border-link px-2.5 py-1.5 text-sm font-semibold text-navy-deep"
        >
          ←
        </Link>
        <span className="text-xl text-blue-600">📦</span>
        <span className="text-[13px] text-muted">Order#:</span>
        <strong className="text-[15px] text-navy">{o.number}</strong>
        <span className="font-bold text-emerald-600">$</span>
        <Badge variant={o.type === 'CONSOLIDATION' ? 'consol' : 'simple'}>
          {typeLabel(o.type)}
        </Badge>
        <Badge variant={statusVariant(o.statusLabel, o.hasAlert)}>{o.statusLabel}</Badge>
        {o.nextStep ? <Badge variant="prog">{o.nextStep}</Badge> : null}
        {o.refNumber ? (
          <span className="font-mono text-[13px]">
            <span className="mr-1 text-[9px] font-bold tracking-wide text-gray-400 uppercase">
              Ref N:
            </span>
            <span className="font-extrabold text-brand">{o.refNumber}</span>
          </span>
        ) : null}
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line bg-slate-50 py-0.5 pr-2.5 pl-1 text-[11.5px] font-bold">
          <span className="font-medium text-gray-400">by</span>
          <span
            className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full text-[9px] font-extrabold text-white"
            style={{ background: o.createdBy.avatarColor ?? '#0EA5E9' }}
          >
            {o.createdBy.code}
          </span>
          {o.createdBy.name}
          <span className="rounded bg-blue-100 px-1.5 text-[9px] font-extrabold tracking-wide text-blue-800 uppercase">
            {roleLabel(o.createdBy.role)}
          </span>
        </span>
        {delta !== 0 && o.actualQty != null ? (
          <Badge variant="warn">⚠ Actual ≠ Expected</Badge>
        ) : null}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <IconBtn>
          💬 <span className="text-gray-400">{o.commentCount}/0</span>
        </IconBtn>
        <IconBtn>
          📷{' '}
          <span className="text-gray-400">
            {o.photoCount}/{o.requiredPhotos || 5}
          </span>
        </IconBtn>
        <IconBtn>$</IconBtn>
        <IconBtn>🖨</IconBtn>
        <IconBtn>📦</IconBtn>
        <IconBtn>🕘</IconBtn>
        <div className="ml-auto flex gap-2">
          <IconBtn>📷 Share QR</IconBtn>
          <button
            type="button"
            className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white"
          >
            📥 BOL PDF
          </button>
          <button
            type="button"
            className="rounded-md bg-brand px-3.5 py-1.5 text-xs font-semibold text-white"
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      <div className="mb-3.5 flex items-center gap-2.5 rounded-lg border border-amber-200 border-l-[3px] border-l-amber-500 bg-amber-50 px-3.5 py-2.5 text-xs text-amber-900">
        <span className="text-base">ℹ️</span>
        <span>
          <strong>Read-only:</strong> Transfer операції між hub-ами виконує тільки call
          center. Якщо треба перенести — натисни Chat.
        </span>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3.5 rounded-[10px] border border-line bg-white p-3.5 md:grid-cols-2">
        <MetaGrid
          rows={[
            ['Customer', o.customer ?? o.createdBy.name],
            ['Hub', `${o.hub.name} (${o.hub.region})`],
            [
              'Services',
              o.services.length
                ? o.services.join(' · ')
                : (o.service ?? typeLabel(o.type)),
            ],
            ['Date', formatWhen(o.scheduledAt)],
            [
              'Declared q-ty',
              o.declaredQty != null ? String(o.declaredQty) : '—',
            ],
            [
              'Actual q-ty',
              o.actualQty != null
                ? `${o.actualQty}${delta ? `  Δ ${delta > 0 ? '+' : ''}${delta}` : ''}`
                : '—',
            ],
            ['Trailer type', o.trailerType ?? '—'],
          ]}
        />
        <MetaGrid
          rows={[
            ['Carrier', o.carrier ?? '—'],
            ['Phone', o.carrierPhone ?? '—'],
            [
              'Truck / trailer',
              [o.truck, o.trailer].filter(Boolean).join(' / ') || '—',
            ],
            [
              'Dock',
              o.dock ? `Dock ${o.dock.dockNumber} · Bay ${o.dock.bay}` : '—',
            ],
            [
              'Assigned to',
              o.dock?.assignedTo
                ? `${o.dock.assignedTo.name} (${roleLabel(o.dock.assignedTo.role).toLowerCase()})`
                : '—',
            ],
            ['Status flow', o.statusFlow ?? '—'],
            [
              'Deltas detected',
              o.deltaLabel ?? (o.deltasCount ? String(o.deltasCount) : '0'),
            ],
          ]}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3.5 lg:grid-cols-[300px_1fr]">
        <div className="rounded-[10px] border border-line bg-white p-3.5">
          <div className="mb-2.5 text-[11px] font-bold tracking-wide text-muted uppercase">
            Your assigned dock
          </div>
          <div className="relative h-[150px] overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-gray-200">
            <div className="absolute top-3 right-3 left-3 flex h-[22px] items-center justify-center rounded bg-navy text-[10px] font-bold tracking-widest text-white">
              {o.hub.name.toUpperCase()} HUB
            </div>
            <div className="absolute top-11 left-[30px] flex h-[50px] w-[38px] items-center justify-center rounded bg-gray-400 text-[9px] text-white">
              {(o.dock?.dockNumber ?? 12) - 1}
            </div>
            <div className="absolute top-11 left-1/2 flex h-[50px] w-[70px] -translate-x-1/2 items-center justify-center rounded border-2 border-red-800 bg-brand text-[11px] font-bold text-white">
              DOCK {o.dock?.dockNumber ?? 12}
            </div>
            <div className="absolute top-11 right-[30px] flex h-[50px] w-[38px] items-center justify-center rounded bg-gray-400 text-[9px] text-white">
              {(o.dock?.dockNumber ?? 12) + 1}
            </div>
            <div className="absolute bottom-2.5 left-1/2 flex h-7 w-14 -translate-x-1/2 items-center justify-center rounded border-2 border-navy bg-white text-[9px] font-bold">
              🚚 {o.dock?.trailer ?? o.trailer ?? '—'}
            </div>
          </div>
          {o.dock ? (
            <div className="mt-2.5 text-xs leading-relaxed">
              <div>
                <strong>
                  Dock {o.dock.dockNumber} · Bay {o.dock.bay}
                </strong>
              </div>
              <div className="text-muted">Assigned {formatWhen(o.dock.assignedAt)}</div>
              <div className="mt-1 font-semibold text-emerald-600">
                ● {o.dock.statusLabel}
              </div>
            </div>
          ) : (
            <div className="mt-2 text-xs text-muted">No dock assigned yet.</div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <div className="rounded-[10px] border border-line bg-white p-3">
            <div className="mb-1.5 text-[10px] font-bold tracking-wide text-muted uppercase">
              Expected (BOL)
            </div>
            <div className="text-[28px] font-bold text-navy">{o.declaredQty ?? '—'}</div>
            <div className="text-[11px] text-muted">Standard · 48×40</div>
          </div>
          <div className="rounded-[10px] border border-amber-200 bg-amber-50 p-3">
            <div className="mb-1.5 text-[10px] font-bold tracking-wide text-amber-900 uppercase">
              Actual (warehouse)
            </div>
            <div className="flex items-baseline gap-1.5 text-[28px] font-bold text-amber-900">
              {o.actualQty ?? '—'}
              {delta ? (
                <span className="rounded-full bg-orange-400 px-2 py-0.5 text-xs text-white">
                  {delta > 0 ? '+' : ''}
                  {delta}
                </span>
              ) : null}
            </div>
            <div className="text-[11px] text-amber-900">Delta from BOL · read-only</div>
          </div>
          <div className="rounded-[10px] border border-line bg-white p-3">
            <div className="mb-1.5 text-[10px] font-bold tracking-wide text-muted uppercase">
              Warehouse note
            </div>
            <div className="text-xs leading-relaxed text-navy">
              {o.warehouseNote ? `“${o.warehouseNote}”` : 'No warehouse notes.'}
            </div>
            <div className="mt-1.5 flex gap-1">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded bg-gray-200 text-sm">
                📷
              </div>
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded bg-gray-200 text-sm">
                📷
              </div>
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded bg-gray-200 text-[11px] text-muted">
                +3
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3.5 overflow-hidden rounded-[10px] border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-3.5 py-3">
          <div className="font-bold text-navy">Operations</div>
          <button type="button" className="rounded-md border border-link px-2.5 py-1 text-xs font-semibold text-navy-deep">
            + Operation
          </button>
        </div>
        {o.operations.length === 0 ? (
          <div className="px-3.5 py-6 text-sm text-muted">No operations yet.</div>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead className="bg-gray-50 text-[11px] tracking-wide text-muted uppercase">
              <tr>
                <th className="px-3.5 py-2">Operation</th>
                <th className="px-1.5 py-2">Trailer</th>
                <th className="px-1.5 py-2 text-right">Q-ty</th>
                <th className="px-1.5 py-2">Unit</th>
                <th className="px-1.5 py-2">Applied at</th>
                <th className="px-1.5 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {o.operations.map((op) => (
                <tr
                  key={`${op.type}-${op.appliedAt}`}
                  className={`border-t border-gray-100 ${op.type === 'DISPOSAL' ? 'bg-red-50' : ''}`}
                >
                  <td className="px-3.5 py-2.5">
                    {op.billable ? <span className="font-bold text-emerald-600">$ </span> : null}
                    {op.type === 'DISPOSAL' ? (
                      <Badge variant="alert">Disposal</Badge>
                    ) : (
                      op.type.charAt(0) + op.type.slice(1).toLowerCase()
                    )}
                  </td>
                  <td className="px-1.5 py-2.5">{op.trailer ?? '—'}</td>
                  <td className="px-1.5 py-2.5 text-right font-semibold text-blue-600">
                    {op.qty}
                  </td>
                  <td className="px-1.5 py-2.5">{op.unit}</td>
                  <td className="px-1.5 py-2.5 text-muted">{formatWhen(op.appliedAt)}</td>
                  <td className="px-1.5 py-2.5 text-gray-400">
                    💬 {op.commentCount} · 📷 {op.photoCount} · ⧉ · 🗑
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="overflow-hidden rounded-[10px] border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <strong className="text-navy">Supplies</strong>
            <span className="text-[11px] text-muted">
              mandatory stock items purchased as Platform Sale
            </span>
          </div>
          <button type="button" className="rounded-md border border-link px-2.5 py-1 text-xs font-semibold text-navy-deep">
            + Supply
          </button>
        </div>
        {o.supplies.length === 0 ? (
          <div className="px-3.5 py-6 text-sm text-muted">No supplies on this order.</div>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead className="bg-gray-50 text-[11px] tracking-wide text-muted uppercase">
              <tr>
                <th className="px-3.5 py-2">SKU</th>
                <th className="px-1.5 py-2">Category</th>
                <th className="px-1.5 py-2 text-right">Q-ty</th>
                <th className="px-1.5 py-2 text-right">Unit $</th>
                <th className="px-1.5 py-2 text-right">Line total</th>
                <th className="px-3.5 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {o.supplies.map((s) => (
                <tr key={s.sku} className="border-t border-gray-100">
                  <td className="px-3.5 py-2.5">{s.sku}</td>
                  <td className="px-1.5 py-2.5">
                    <Badge variant="simple">{s.category}</Badge>
                  </td>
                  <td className="px-1.5 py-2.5 text-right font-semibold">{s.qty}</td>
                  <td className="px-1.5 py-2.5 text-right">{money(s.unitCents, 2)}</td>
                  <td className="px-1.5 py-2.5 text-right font-semibold">
                    {money(s.lineTotalCents, 2)}
                  </td>
                  <td className="px-3.5 py-2.5 text-gray-400">✏️ · 🗑</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 text-xs">
              <tr className="border-t border-line">
                <td colSpan={4} className="px-3.5 py-2.5 text-right font-semibold text-muted">
                  Supply subtotal
                </td>
                <td className="px-1.5 py-2.5 text-right font-bold text-navy">
                  {money(o.supplySubtotalCents, 2)}
                </td>
                <td className="px-3.5 py-2.5 text-[11px] text-muted">→ Invoice line items</td>
              </tr>
            </tfoot>
          </table>
        )}
        <div className="border-t border-purple-200 bg-purple-50 px-3.5 py-2 text-[11px] text-violet-800">
          💡 Client sees only Platform price; warehouse cost and margin split are hidden.
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="rounded-md border border-link px-3 py-1.5 text-xs font-semibold text-navy-deep"
    >
      {children}
    </button>
  );
}

function MetaGrid({ rows }: { rows: [string, string][] }) {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-x-3.5 gap-y-1.5 text-[13px]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <div className="text-muted">{k}</div>
          <div className="font-medium text-navy">{v}</div>
        </div>
      ))}
    </div>
  );
}
