import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';
import type { DateRange, OrderStatus, OrderTab } from '../../api/types';
import { OrderCard } from '../../components/OrderCard';
import { EmptyState, ErrorState } from '../../components/ui/EmptyState';
import { PageSkeleton } from '../../components/ui/Skeleton';
import { formatWhen, typeLabel } from '../../lib/format';
import { OrdersPipeline } from './OrdersPipeline';

type View = 'cards' | 'table' | 'pipeline';

const TABS: { id: OrderTab; label: string; key: keyof Awaited<ReturnType<typeof api.counts>> }[] = [
  { id: 'all', label: 'All', key: 'all' },
  { id: 'cross-dock', label: 'Cross-Dock', key: 'crossDock' },
  { id: 'consolidation', label: 'Consolidation', key: 'consolidation' },
  { id: 'alerts', label: 'Alerts', key: 'alerts' },
  { id: 'drafts', label: 'Drafts', key: 'drafts' },
];

export function OrdersPage() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as OrderTab) || 'all';
  const hub = params.get('hub') || 'all';
  const status = (params.get('status') as OrderStatus) || '';
  const dateRange = (params.get('dateRange') as DateRange) || 'all';
  const search = params.get('search') || '';
  const page = Number(params.get('page') || '1');
  const view = (params.get('view') as View) || 'cards';

  const query = useMemo(
    () => ({
      tab,
      hub,
      status,
      dateRange,
      search,
      page,
      limit: view === 'pipeline' ? 100 : 12,
    }),
    [tab, hub, status, dateRange, search, page, view],
  );

  const list = useQuery({
    queryKey: ['orders', query],
    queryFn: () => api.orders(query),
  });
  const counts = useQuery({ queryKey: ['order-counts'], queryFn: api.counts });

  function set(next: Record<string, string>) {
    const n = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => {
      if (!v || v === 'all') n.delete(k);
      else n.set(k, v);
    });
    if (!next.page) n.delete('page');
    setParams(n);
  }

  const exportHref = api.exportUrl({
    ...(tab !== 'all' ? { tab } : {}),
    ...(hub !== 'all' ? { hub } : {}),
    ...(status ? { status } : {}),
    ...(dateRange !== 'all' ? { dateRange } : {}),
    ...(search ? { search } : {}),
  });

  return (
    <div>
      <div className="mb-2 text-xs text-muted">
        Home <span className="text-link">›</span> Orders
      </div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h1 className="text-[22px] font-bold text-navy">All Orders</h1>
        <div className="ml-auto flex gap-2">
          <a
            href={exportHref}
            className="rounded-md border border-link px-4 py-2 text-[13px] font-semibold text-navy-deep"
          >
            📥 Export CSV
          </a>
        </div>
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => {
          const count = counts.data?.[t.key] ?? '—';
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => set({ tab: t.id })}
              className={`-mb-px px-4 py-2.5 text-[13px] font-semibold ${
                active
                  ? 'border-b-2 border-brand text-navy-deep'
                  : 'border-b-2 border-transparent text-muted'
              }`}
            >
              {t.label}{' '}
              <span
                className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] ${
                  t.id === 'alerts' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <select
          value={hub}
          onChange={(e) => set({ hub: e.target.value })}
          className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs"
        >
          <option value="all">Hub: All</option>
          <option value="Markham">Markham</option>
          <option value="Toronto">Toronto</option>
        </select>
        <select
          value={dateRange}
          onChange={(e) => set({ dateRange: e.target.value })}
          className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs"
        >
          <option value="all">Date: All</option>
          <option value="last-30">Last 30 days</option>
          <option value="today">Today</option>
          <option value="this-week">This week</option>
        </select>
        <select
          value={status}
          onChange={(e) => set({ status: e.target.value })}
          className="rounded-md border border-gray-300 px-2.5 py-1.5 text-xs"
        >
          <option value="">Status: Any</option>
          <option value="NEW">New</option>
          <option value="READY">Ready</option>
          <option value="IN_PROGRESS">In progress</option>
          <option value="DRAFT">Draft</option>
          <option value="COMPLETED">Completed</option>
          <option value="CLOSED">Closed</option>
        </select>
        <div className="ml-auto flex rounded-md bg-gray-100 p-0.5">
          {(['cards', 'table', 'pipeline'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => set({ view: v })}
              className={`rounded px-2.5 py-1 text-xs font-semibold capitalize ${
                view === v ? 'bg-white text-navy' : 'text-muted'
              }`}
            >
              {v === 'cards' ? '⊞ Cards' : v === 'table' ? '☰ Table' : '⎔ Pipeline'}
            </button>
          ))}
        </div>
      </div>

      {list.isLoading ? <PageSkeleton /> : null}
      {list.isError ? (
        <ErrorState message={list.error.message} onRetry={() => void list.refetch()} />
      ) : null}
      {list.data && list.data.items.length === 0 ? (
        <EmptyState title="No orders match these filters" hint="Clear filters or try another tab." />
      ) : null}

      {list.data && list.data.items.length > 0 && view === 'cards' ? (
        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
          {list.data.items.map((o) => (
            <OrderCard key={o.number} order={o} compact />
          ))}
        </div>
      ) : null}

      {list.data && list.data.items.length > 0 && view === 'table' ? (
        <div className="overflow-x-auto rounded-[10px] border border-line bg-white">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-gray-50 text-[11px] tracking-wide text-muted uppercase">
              <tr>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Hub</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Carrier</th>
                <th className="px-3 py-2">Q-ty</th>
              </tr>
            </thead>
            <tbody>
              {list.data.items.map((o) => (
                <tr key={o.number} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-bold text-navy-deep">
                    <Link to={`/orders/${o.number}`}>{o.number}</Link>
                  </td>
                  <td className="px-3 py-2">{typeLabel(o.type)}</td>
                  <td className="px-3 py-2">{o.statusLabel}</td>
                  <td className="px-3 py-2">{o.hub.name}</td>
                  <td className="px-3 py-2">{formatWhen(o.scheduledAt, false)}</td>
                  <td className="px-3 py-2">{o.carrier ?? '—'}</td>
                  <td className="px-3 py-2">{o.qtyLabel ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {list.data && view === 'pipeline' ? (
        <OrdersPipeline items={list.data.items} />
      ) : null}

      {list.data && view !== 'pipeline' ? (
        <div className="mt-5 flex items-center justify-between text-xs text-muted">
          <div>
            Showing {list.data.items.length} of {list.data.total}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => set({ page: String(page - 1) })}
              className="rounded-md border border-link px-2.5 py-1 font-semibold text-navy-deep disabled:opacity-40"
            >
              ← Prev
            </button>
            <button
              type="button"
              disabled={page >= list.data.pages}
              onClick={() => set({ page: String(page + 1) })}
              className="rounded-md border border-link px-2.5 py-1 font-semibold text-navy-deep disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
