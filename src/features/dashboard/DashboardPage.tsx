import { useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChartColumn,
  DollarSign,
  Hand,
  Star,
  TriangleAlert,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Tooltip, XAxis } from 'recharts';
import type { ActivityPeriod } from '@/shared/api/types';
import { money } from '@/shared/lib/format';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { ErrorState } from '@/shared/ui/EmptyState';
import { OrderCard } from '@/entities/order/ui/OrderCard';
import { PageSkeleton, Skeleton } from '@/shared/ui/Skeleton';
import {
  useActiveOrders,
  useActivity,
  useDashboardSummary,
  useMe,
} from '@/entities/order/api/queries';
import { WeekDelta } from './components/WeekDelta';
import { ChartBlock } from './components/ChartBlock';
import { Kpi } from './components/Kpi';

const PERIODS: { id: ActivityPeriod; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'CW' },
  { id: 'month', label: 'Month' },
  { id: 'quarter', label: 'Quarter' },
];

export const DashboardPage = () => {
  const [period, setPeriod] = useState<ActivityPeriod>('month');
  const [openOrderNumber, setOpenOrderNumber] = useState<string | null>(null);

  const toggleOrder = (number: string) => {
    setOpenOrderNumber((current) => (current === number ? null : number));
  };
  const me = useMe();
  const summary = useDashboardSummary();
  const active = useActiveOrders();
  const activity = useActivity(period);

  if (summary.isPending) return <PageSkeleton />;
  if (summary.isError) {
    return <ErrorState message={summary.error.message} onRetry={() => void summary.refetch()} />;
  }

  const stats = summary.data;
  const alerts = stats.needAttention.alerts;
  const alertPreview = alerts
    .slice(0, 2)
    .map((alert) => [alert.reason, alert.orderNumber].filter(Boolean).join(' · '))
    .join('; ');

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Dashboard' }]} />
      <h1 className="mb-5 text-[22px] font-bold text-navy">
        Welcome, {me.data?.name ?? (me.isError ? 'there' : '…')}{' '}
        <Hand className="inline size-5" aria-hidden="true" />
      </h1>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          accent="border-t-[#2E75B6]"
          label="Active Orders"
          value={stats.active.count}
          trend={<WeekDelta value={stats.active.deltaThisWeek} />}
        />
        <Kpi
          accent="border-t-emerald-600"
          label="Completed (30 d)"
          value={stats.completed30d.count}
          trend={
            <span className="text-muted">
              {stats.completed30d.trend === 'same' ? (
                <>
                  <ArrowRight className="inline size-3" aria-hidden="true" /> same as last month
                </>
              ) : stats.completed30d.trend === 'up' ? (
                <>
                  <ArrowUp className="inline size-3" aria-hidden="true" /> vs last month
                </>
              ) : (
                <>
                  <ArrowDown className="inline size-3" aria-hidden="true" /> vs last month
                </>
              )}
            </span>
          }
        />
        <Link
          to="/orders?tab=alerts"
          className="relative cursor-pointer rounded-card border border-line border-t-[3px] border-t-red-600 bg-gradient-to-r from-red-50 to-red-100 p-3.5 sm:col-span-2"
        >
          <div className="mb-1.5 text-2xs font-medium tracking-wide text-brand-dark uppercase">
            <TriangleAlert className="mr-1 inline size-3.5" aria-hidden="true" />
            Need Attention
          </div>
          <div className="flex flex-wrap items-baseline gap-4">
            <div>
              <div className="text-2xl font-bold text-brand-dark">{stats.needAttention.total}</div>
              <div className="text-[10px] font-bold tracking-wider text-red-800 uppercase">
                Total
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-lg bg-orange-200 px-2 py-0.5 text-2xs font-bold text-orange-800">
                {stats.needAttention.awaitingAction} · awaiting your action
              </span>
              {alerts.length > 0 ? (
                <span className="rounded-lg bg-red-200 px-2 py-0.5 text-2xs font-bold text-red-900">
                  {alerts.length} · {alerts.length === 1 ? 'alert' : 'alerts'} ({alertPreview}
                  {alerts.length > 2 ? ` +${alerts.length - 2}` : ''})
                </span>
              ) : null}
            </div>
          </div>
          <div className="absolute right-3 bottom-2.5 text-2xs font-extrabold text-brand-dark">
            Open list →
          </div>
        </Link>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-navy">Active Orders</h2>
        <Link to="/orders" className="text-xs font-semibold text-link">
          View all →
        </Link>
      </div>
      {active.isPending ? <Skeleton className="mb-6 h-48" /> : null}
      {active.isError ? (
        <div className="mb-6">
          <ErrorState message={active.error.message} onRetry={() => void active.refetch()} />
        </div>
      ) : null}
      {active.data?.length ? (
        <div className="mb-6 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          {active.data.map((order) => (
            <OrderCard
              key={order.number}
              order={order}
              open={openOrderNumber === order.number}
              onToggle={toggleOrder}
            />
          ))}
        </div>
      ) : null}
      {active.isSuccess && active.data.length === 0 ? (
        <p className="mb-6 text-sm text-muted">No active orders.</p>
      ) : null}

      <section className="rounded-card border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="inline-flex items-center gap-1.5 text-base font-bold text-navy">
            <ChartColumn className="size-4" aria-hidden="true" /> Your activity
          </h2>
          <fieldset className="m-0 flex min-w-0 gap-1.5 border-0 p-0">
            <legend className="sr-only">Activity period</legend>
            {PERIODS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={period === item.id}
                onClick={() => setPeriod(item.id)}
                className={`rounded-full px-3 py-1 text-2xs font-bold ${
                  period === item.id
                    ? 'border border-brand bg-brand text-white'
                    : 'border border-slate-200 bg-white text-slate-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </fieldset>
        </div>
        {activity.isPending ? <Skeleton className="h-32" /> : null}
        {activity.isError ? (
          <ErrorState message={activity.error.message} onRetry={() => void activity.refetch()} />
        ) : null}
        {activity.data ? (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <ChartBlock
                title="Completed orders"
                total={`${activity.data.completed.total}`}
                tone="text-emerald-600"
              >
                <BarChart data={activity.data.completed.series}>
                  <CartesianGrid vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="var(--color-emerald-600)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ChartBlock>
              <ChartBlock
                title="Spend"
                total={money(activity.data.spend.totalCents)}
                tone="text-brand"
              >
                <AreaChart data={activity.data.spend.series}>
                  <CartesianGrid vertical={false} stroke="#F1F5F9" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip formatter={(value) => money(Number(value ?? 0))} />
                  <Area
                    type="monotone"
                    dataKey="valueCents"
                    stroke="var(--color-brand)"
                    fill="var(--color-brand)"
                    fillOpacity={0.12}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartBlock>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-4 rounded-md bg-slate-100 px-3.5 py-2.5 text-xs text-slate-600">
              <span>
                <TrendingUp className="mr-1 inline size-3.5" aria-hidden="true" />
                <strong className="text-emerald-600">
                  {activity.data.insights.completedChangePct >= 0 ? '+' : ''}
                  {activity.data.insights.completedChangePct}%
                </strong>{' '}
                completed orders vs previous 30 days
              </span>
              <span>
                <DollarSign className="mr-1 inline size-3.5" aria-hidden="true" />
                <strong className="text-brand">
                  {money(activity.data.insights.spentCents)}
                </strong>{' '}
                spent · avg {money(activity.data.insights.avgCents)}/order
              </span>
              {activity.data.insights.bestWeekLabel ? (
                <span>
                  <Star className="mr-1 inline size-3.5" aria-hidden="true" />
                  Best week: {activity.data.insights.bestWeekLabel} (
                  {money(activity.data.insights.bestWeekSpendCents)})
                </span>
              ) : null}
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
};
