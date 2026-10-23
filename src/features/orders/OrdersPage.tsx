import { useMemo, useState } from 'react';
import { Columns3, Download, LayoutGrid, List } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { OrderListItem } from '@/shared/api/types';
import { cn } from '@/shared/lib/cn';
import { formatWhen } from '@/shared/lib/format';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { Button } from '@/shared/ui/Button';
import { EmptyState, ErrorState } from '@/shared/ui/EmptyState';
import { OrderCard } from '@/entities/order/ui/OrderCard';
import { PageSkeleton } from '@/shared/ui/Skeleton';
import { Select } from '@/shared/ui/Select';
import { SegmentedControl } from '@/shared/ui/SegmentedControl';
import { DataTable } from '@/shared/ui/Table';
import { Tabs } from '@/shared/ui/Tabs';
import {
  DATE_RANGES,
  FILTER_STATUSES,
  HUBS,
  parseOrderFilters,
  patchFilters,
  type OrderView,
} from '@/entities/order/lib/filters';
import { STATUS_LABEL, typeLabel } from '@/entities/order/lib/labels';
import { useOrderCounts, useOrders } from '@/entities/order/api/queries';
import { OrdersPipeline } from './components/OrdersPipeline';

const TAB_ITEMS = [
  { id: 'all' as const, label: 'All', key: 'all' as const },
  { id: 'cross-dock' as const, label: 'Cross-Dock', key: 'crossDock' as const },
  { id: 'consolidation' as const, label: 'Consolidation', key: 'consolidation' as const },
  { id: 'alerts' as const, label: 'Alerts', key: 'alerts' as const, tone: 'danger' as const },
  { id: 'drafts' as const, label: 'Drafts', key: 'drafts' as const },
];

const DATE_LABEL: Record<(typeof DATE_RANGES)[number], string> = {
  all: 'Date: All',
  'last-30': 'Last 30 days',
  today: 'Today',
  'this-week': 'This week',
};

export const OrdersPage = () => {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const filters = useMemo(() => parseOrderFilters(params), [params]);
  const list = useOrders(filters);
  const counts = useOrderCounts();
  const [openOrderNumber, setOpenOrderNumber] = useState<string | null>(null);

  const toggleOrder = (number: string) => {
    setOpenOrderNumber((current) => (current === number ? null : number));
  };

  const update = (patch: Parameters<typeof patchFilters>[1]) => {
    setParams(patchFilters(params, patch));
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Orders' }]} />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[22px] font-bold text-navy">All Orders</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="md">
            <Download className="size-3.5" aria-hidden="true" /> Export CSV
          </Button>
          <Button variant="primary" size="md">
            + New Order
          </Button>
        </div>
      </div>

      <Tabs
        label="Order categories"
        value={filters.tab}
        onChange={(tab) => update({ tab })}
        tabs={TAB_ITEMS.map((tab) => ({
          id: tab.id,
          label: tab.label,
          count: counts.data?.[tab.key] ?? '—',
          tone: 'tone' in tab ? tab.tone : undefined,
        }))}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select
          label="Hub"
          value={filters.hub}
          onChange={(event) => update({ hub: event.target.value })}
        >
          {HUBS.map((hub) => (
            <option key={hub} value={hub}>
              {hub === 'all' ? 'Hub: All' : hub}
            </option>
          ))}
        </Select>
        <Select
          label="Date range"
          value={filters.dateRange}
          onChange={(event) => update({ dateRange: event.target.value })}
        >
          {DATE_RANGES.map((range) => (
            <option key={range} value={range}>
              {DATE_LABEL[range]}
            </option>
          ))}
        </Select>
        <Select
          label="Status"
          value={filters.status}
          onChange={(event) => update({ status: event.target.value })}
        >
          <option value="">Status: Any</option>
          {FILTER_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </Select>
        <div className="ml-auto">
          <SegmentedControl<OrderView>
            label="Order view"
            value={filters.view}
            onChange={(view) => update({ view })}
            options={[
              {
                id: 'cards',
                label: (
                  <>
                    <LayoutGrid className="size-3.5" aria-hidden="true" /> Cards
                  </>
                ),
              },
              {
                id: 'table',
                label: (
                  <>
                    <List className="size-3.5" aria-hidden="true" /> Table
                  </>
                ),
              },
              {
                id: 'pipeline',
                label: (
                  <>
                    <Columns3 className="size-3.5" aria-hidden="true" /> Pipeline
                  </>
                ),
              },
            ]}
          />
        </div>
      </div>

      {filters.view !== 'pipeline' ? (
        <div className="mb-3.5 rounded-md border border-violet-200 border-l-[3px] border-l-violet-800 bg-violet-50 px-3.5 py-2.5 text-[11.5px] leading-[1.55] text-violet-900">
          <strong className="inline-flex items-center gap-1">
            <Columns3 className="size-3.5" aria-hidden="true" /> Pipeline view:
          </strong>{' '}
          замість лінійного списку — 7 колонок kanban (Draft · Ready · In Progress · Consolidated ·
          In Transit · Deconsolidated · Closed). Фільтр chip-ами над колонками.
        </div>
      ) : null}

      {list.isPending ? <PageSkeleton /> : null}
      {list.isError ? (
        <ErrorState message={list.error.message} onRetry={() => void list.refetch()} />
      ) : null}
      {list.data && list.data.items.length === 0 ? (
        <EmptyState
          title="No orders match these filters"
          hint="Clear a filter or try another tab."
        />
      ) : null}

      {list.data && list.data.items.length > 0 ? (
        <div className={cn(list.isPlaceholderData && 'opacity-60')}>
          {filters.view === 'cards' ? (
            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
              {list.data.items.map((order) => (
                <OrderCard
                  key={order.number}
                  order={order}
                  compact
                  open={openOrderNumber === order.number}
                  onToggle={toggleOrder}
                />
              ))}
            </div>
          ) : null}

          {filters.view === 'table' ? (
            <div className="rounded-card border border-line bg-white">
              <DataTable
                columns={orderColumns}
                rows={list.data.items}
                rowKey={(order) => order.number}
                rowLabel={(order) => `Open order ${order.number}`}
                onRow={(order) => navigate(`/orders/${order.number}`)}
              />
            </div>
          ) : null}

          {filters.view === 'pipeline' ? (
            <OrdersPipeline
              items={list.data.items}
              hiddenCount={Math.max(list.data.total - list.data.items.length, 0)}
            />
          ) : null}
        </div>
      ) : null}

      {list.data && filters.view !== 'pipeline' ? (
        <div className="mt-5 flex items-center justify-between text-xs text-muted">
          <div>
            Showing {list.data.items.length} of {list.data.total}
          </div>
          <div className="flex gap-1">
            <Button
              disabled={filters.page <= 1}
              onClick={() => update({ page: String(filters.page - 1) })}
            >
              ← Prev
            </Button>
            <Button
              disabled={filters.page >= list.data.pages}
              onClick={() => update({ page: String(filters.page + 1) })}
            >
              Next →
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const orderColumns = [
  {
    id: 'number',
    header: 'Order',
    cell: (order: OrderListItem) => (
      <span className="font-bold text-navy-deep">{order.number}</span>
    ),
  },
  { id: 'type', header: 'Type', cell: (order: OrderListItem) => typeLabel(order.type) },
  { id: 'status', header: 'Status', cell: (order: OrderListItem) => order.statusLabel },
  { id: 'hub', header: 'Hub', cell: (order: OrderListItem) => order.hub.name },
  {
    id: 'date',
    header: 'Date',
    cell: (order: OrderListItem) => formatWhen(order.scheduledAt, false),
  },
  { id: 'carrier', header: 'Carrier', cell: (order: OrderListItem) => order.carrier ?? '—' },
  { id: 'qty', header: 'Q-ty', cell: (order: OrderListItem) => order.qtyLabel ?? '—' },
];
