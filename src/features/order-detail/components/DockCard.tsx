import { Truck } from 'lucide-react';
import type { OrderDetail } from '@/shared/api/types';
import { formatWhen } from '@/shared/lib/format';
import { Card } from '@/shared/ui/Card';

export const DockCard = ({ order }: { order: OrderDetail }) => {
  const dock = order.dock;
  return (
    <Card className="p-3.5">
      <h2 className="mb-2.5 text-2xs font-bold tracking-wide text-muted uppercase">
        Your assigned dock
      </h2>
      {dock ? (
        <>
          <div className="relative h-[150px] overflow-hidden rounded-lg bg-gradient-to-b from-gray-50 to-gray-200">
            <div className="absolute top-3 right-3 left-3 flex h-[22px] items-center justify-center rounded bg-navy text-[10px] font-bold tracking-widest text-white">
              {order.hub.name.toUpperCase()} HUB
            </div>
            <DockSlot number={dock.dockNumber - 1} className="left-[30px] w-[38px] bg-gray-400" />
            <div className="absolute top-11 left-1/2 flex h-[50px] w-[70px] -translate-x-1/2 items-center justify-center rounded border-2 border-red-800 bg-brand text-2xs font-bold text-white">
              DOCK {dock.dockNumber}
            </div>
            <DockSlot number={dock.dockNumber + 1} className="right-[30px] w-[38px] bg-gray-400" />
            <div className="absolute bottom-2.5 left-1/2 flex h-7 w-14 -translate-x-1/2 items-center justify-center rounded border-2 border-navy bg-white text-[9px] font-bold">
              <Truck className="size-2.5" aria-hidden="true" />{' '}
              {dock.trailer ?? order.trailer ?? '—'}
            </div>
          </div>
          <div className="mt-2.5 text-xs leading-relaxed">
            <div>
              <strong>
                Dock {dock.dockNumber} · Bay {dock.bay}
              </strong>
            </div>
            <div className="text-muted">Assigned {formatWhen(dock.assignedAt)}</div>
            <div className="mt-1 font-semibold text-emerald-600">● {dock.statusLabel}</div>
          </div>
        </>
      ) : (
        <p className="text-xs text-muted">No dock assigned yet.</p>
      )}
    </Card>
  );
};

const DockSlot = ({ number, className }: { number: number; className: string }) => {
  if (number < 1) return null;
  return (
    <div
      className={`absolute top-11 flex h-[50px] items-center justify-center rounded text-[9px] text-white ${className}`}
    >
      {number}
    </div>
  );
};
