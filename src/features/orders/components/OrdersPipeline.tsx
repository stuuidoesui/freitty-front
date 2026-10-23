import type { OrderListItem, PipelineColumn as PipelineColumnId } from '@/shared/api/types';
import { PipelineColumn } from './PipelineColumn';

const COLUMNS: { id: PipelineColumnId; label: string }[] = [
  { id: 'DRAFT', label: 'Draft' },
  { id: 'READY', label: 'Ready' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'CONSOLIDATED', label: 'Consolidated' },
  { id: 'IN_TRANSIT', label: 'In Transit' },
  { id: 'DECONSOLIDATED', label: 'Deconsolidated' },
  { id: 'CLOSED', label: 'Closed' },
];

export const OrdersPipeline = ({
  items,
  hiddenCount,
}: {
  items: OrderListItem[];
  hiddenCount: number;
}) => {
  return (
    <div>
      {hiddenCount > 0 ? (
        <p className="text-xs text-muted">
          Showing the first {items.length} of {items.length + hiddenCount} orders. Narrow the
          filters to see the rest.
        </p>
      ) : null}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
        {COLUMNS.map((column) => (
          <PipelineColumn
            key={column.id}
            column={column}
            items={items.filter((order) => order.pipelineColumn === column.id)}
          />
        ))}
      </div>
    </div>
  );
};
