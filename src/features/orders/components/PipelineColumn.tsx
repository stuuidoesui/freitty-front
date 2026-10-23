import type { OrderListItem, PipelineColumn as PipelineColumnId } from '@/shared/api/types';
import { PipeCard } from './PipeCard';

export const PipelineColumn = ({
  column,
  items,
}: {
  column: { id: PipelineColumnId; label: string };
  items: OrderListItem[];
}) => {
  return (
    <div className="min-w-[180px] flex-1 rounded-lg border border-line bg-gray-50 p-2">
      <div className="mb-2 flex items-center justify-between text-2xs font-bold tracking-wide text-muted uppercase">
        {column.label}
        <span className="rounded-full bg-gray-200 px-1.5 text-[10px]">{items.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((order) => (
          <PipeCard key={order.number} order={order} />
        ))}
      </div>
    </div>
  );
};
