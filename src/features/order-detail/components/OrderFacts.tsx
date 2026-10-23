import type { OrderDetail } from '@/shared/api/types';
import { formatWhen } from '@/shared/lib/format';
import { cargoUnitSummary } from '@/entities/order/lib/cargoUnitSummary';
import { formatDelta, qtyDelta } from '@/entities/order/lib/domain';
import { typeLabel } from '@/entities/order/lib/labels';
import { roleLabel } from '@/entities/user/lib/labels';
import { Badge } from '@/shared/ui/Badge';
import { Card } from '@/shared/ui/Card';
import { DockCard } from './DockCard';
import { MetaGrid } from './MetaGrid';
import { PhotoStrip } from './PhotoStrip';
import { ServiceBadges } from './ServiceBadges';

export const OrderFacts = ({ order }: { order: OrderDetail }) => {
  const delta = qtyDelta(order);
  return (
    <>
      <Card className="mt-4 p-3.5">
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          <MetaGrid
            rows={[
              ['Customer', order.customer ?? order.createdBy.name],
              ['Hub', `${order.hub.name} (${order.hub.region})`],
              [
                'Services',
                <ServiceBadges
                  key="services"
                  services={
                    order.services.length
                      ? order.services
                      : [order.service ?? typeLabel(order.type)]
                  }
                />,
              ],
              [
                'Date',
                <span key="date" className="font-semibold text-red-600">
                  {formatWhen(order.scheduledAt)}
                </span>,
              ],
              [
                'Declared q-ty',
                order.declaredQty != null ? (
                  <span key="declared">
                    <strong>{order.declaredQty}</strong>{' '}
                    <span className="text-2xs font-medium text-muted">
                      {cargoUnitSummary(order.cargoLines)}
                    </span>
                  </span>
                ) : (
                  '—'
                ),
              ],
              [
                'Actual q-ty',
                order.actualQty != null ? (
                  <span key="actual" className="font-semibold text-amber-900">
                    {order.actualQty}{' '}
                    {delta != null ? (
                      <span className="rounded-full bg-orange-400 px-2 py-[2px] text-[10px] text-white">
                        Δ {formatDelta(delta)}
                      </span>
                    ) : null}
                  </span>
                ) : (
                  '—'
                ),
              ],
              [
                'Trailer type',
                order.trailerType ? (
                  <Badge key="trailer-type" variant="neutral">
                    {order.trailerType}
                  </Badge>
                ) : (
                  '—'
                ),
              ],
            ]}
          />
          <MetaGrid
            rows={[
              ['Carrier', order.carrier ?? '—'],
              ['Phone', order.carrierPhone ?? '—'],
              ['Truck / trailer', [order.truck, order.trailer].filter(Boolean).join(' / ') || '—'],
              [
                'Dock',
                order.dock ? (
                  <strong key="dock" className="text-brand">
                    Dock {order.dock.dockNumber} · Bay {order.dock.bay}
                  </strong>
                ) : (
                  '—'
                ),
              ],
              [
                'Assigned to',
                order.dock?.assignedTo ? (
                  <span key="assigned-to" className="font-semibold text-brand">
                    {order.dock.assignedTo.name} (
                    {roleLabel(order.dock.assignedTo.role).toLowerCase()})
                  </span>
                ) : (
                  '—'
                ),
              ],
              [
                'Status flow',
                <span key="status-flow" className="text-2xs">
                  {order.statusFlow ?? '—'}
                </span>,
              ],
              [
                'Deltas detected',
                order.deltasCount ? (
                  <span key="deltas">
                    <Badge variant="warn">
                      {order.deltaLabel ?? `${order.deltasCount} (q-ty)`}
                    </Badge>{' '}
                    <span className="ml-1.5 text-2xs font-bold text-blue-600">View all →</span>
                  </span>
                ) : (
                  '0'
                ),
              ],
            ]}
          />
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-3.5 lg:grid-cols-[300px_1fr]">
        <DockCard order={order} />
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <Card className="p-3">
            <div className="mb-1.5 text-[10px] font-bold tracking-wide text-muted uppercase">
              Expected (BOL)
            </div>
            <div className="text-[28px] font-bold text-navy">{order.declaredQty ?? '—'}</div>
            <div className="text-2xs text-muted">{cargoUnitSummary(order.cargoLines)}</div>
          </Card>
          <Card className="border-amber-200 bg-amber-50 p-3">
            <div className="mb-1.5 text-[10px] font-bold tracking-wide text-amber-900 uppercase">
              Actual (warehouse)
            </div>
            <div className="flex items-baseline gap-1.5 text-[28px] font-bold text-amber-900">
              {order.actualQty ?? '—'}
              {delta != null ? (
                <span className="rounded-full bg-orange-400 px-2 py-0.5 text-xs text-white">
                  {formatDelta(delta)}
                </span>
              ) : null}
            </div>
            <div className="text-2xs text-amber-900">Delta from BOL · read-only</div>
          </Card>
          <Card className="p-3">
            <div className="mb-1.5 text-[10px] font-bold tracking-wide text-muted uppercase">
              Warehouse note
            </div>
            <div className="text-xs leading-relaxed text-navy">
              {order.warehouseNote ? `“${order.warehouseNote}”` : 'No warehouse notes.'}
            </div>
            <PhotoStrip count={order.photoCount} />
          </Card>
        </div>
      </div>
    </>
  );
};
