import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import type { OrderListItem, PipelineColumn } from '../../api/types';
import { CSS } from '@dnd-kit/utilities';

const COLUMNS: { id: PipelineColumn; label: string }[] = [
  { id: 'DRAFT', label: 'Draft' },
  { id: 'READY', label: 'Ready' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'CONSOLIDATED', label: 'Consolidated' },
  { id: 'IN_TRANSIT', label: 'In Transit' },
  { id: 'DECONSOLIDATED', label: 'Deconsolidated' },
  { id: 'CLOSED', label: 'Closed' },
];

export function OrdersPipeline({ items }: { items: OrderListItem[] }) {
  const qc = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const patch = useMutation({
    mutationFn: ({ number, status }: { number: string; status: 'READY' }) =>
      api.patchStatus(number, status),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['orders'] });
      void qc.invalidateQueries({ queryKey: ['order-counts'] });
    },
  });

  function onDragEnd(event: DragEndEvent) {
    const over = event.over?.id;
    const from = event.active.data.current as OrderListItem | undefined;
    if (!from || over !== 'READY') return;
    if (from.status !== 'DRAFT') return;
    patch.mutate({ number: from.number, status: 'READY' });
  }

  return (
    <div>
      <div className="mb-3 rounded-md border border-violet-200 border-l-[3px] border-l-violet-800 bg-violet-50 px-3.5 py-2.5 text-[11.5px] text-violet-900">
        <strong>Pipeline view:</strong> 7 columns. Drag-drop is limited by role — a client
        can only move <em>Draft → Ready</em>.
      </div>
      {patch.isError ? (
        <div className="mb-2 rounded bg-red-50 px-3 py-2 text-xs text-red-800">
          {patch.error.message}
        </div>
      ) : null}
      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              column={col}
              items={items.filter((o) => o.pipelineColumn === col.id)}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}

function Column({
  column,
  items,
}: {
  column: { id: PipelineColumn; label: string };
  items: OrderListItem[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  return (
    <div
      ref={setNodeRef}
      className={`min-w-[180px] flex-1 rounded-lg border bg-gray-50 p-2 ${
        isOver ? 'border-brand bg-red-50' : 'border-line'
      }`}
    >
      <div className="mb-2 flex items-center justify-between text-[11px] font-bold tracking-wide text-muted uppercase">
        {column.label}
        <span className="rounded-full bg-gray-200 px-1.5 text-[10px]">{items.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((o) => (
          <PipeCard key={o.number} order={o} />
        ))}
      </div>
    </div>
  );
}

function PipeCard({ order }: { order: OrderListItem }) {
  const canDrag = order.status === 'DRAFT';
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.number,
    data: order,
    disabled: !canDrag,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : 1,
    cursor: canDrag ? 'grab' : 'default',
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="rounded-md border border-line bg-white p-2 text-[11px]"
    >
      <div className="font-bold text-navy-deep">{order.number}</div>
      <div className="text-muted">{order.hub.name}</div>
      <div className="mt-1 font-semibold text-navy">{order.qtyLabel ?? '—'}</div>
      {canDrag ? (
        <div className="mt-1 text-[10px] font-semibold text-link">Drag to Ready</div>
      ) : null}
    </div>
  );
}
