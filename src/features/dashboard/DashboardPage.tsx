import { useQuery } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { api } from '../../api/client';
import type { ActivityPeriod } from '../../api/types';
import { OrderCard } from '../../components/OrderCard';
import { ErrorState } from '../../components/ui/EmptyState';
import { PageSkeleton } from '../../components/ui/Skeleton';
import { money } from '../../lib/format';

const PERIODS: { id: ActivityPeriod; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'CW' },
  { id: 'month', label: 'Month' },
  { id: 'quarter', label: 'Quarter' },
];

export function DashboardPage() {
  const [period, setPeriod] = useState<ActivityPeriod>('month');
  const summary = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: api.dashboardSummary,
  });
  const active = useQuery({
    queryKey: ['active-orders'],
    queryFn: api.activeOrders,
  });
  const activity = useQuery({
    queryKey: ['activity', period],
    queryFn: () => api.activity(period),
  });

  if (summary.isLoading) return <PageSkeleton />;
  if (summary.isError) {
    return (
      <ErrorState
        message={summary.error.message}
        onRetry={() => void summary.refetch()}
      />
    );
  }

  const s = summary.data;
  const alertChip = s?.needAttention.alerts[0];

  return (
    <div>
      <div className="mb-2 text-xs text-muted">
        Home <span className="text-link">›</span> Dashboard
      </div>
      <h1 className="mb-5 text-[22px] font-bold text-navy">Welcome, User 1 👋</h1>

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi
          accent="border-t-[#2E75B6]"
          label="Active Orders"
          value={s?.active.count ?? 0}
          trend={
            <span className="text-emerald-600">
              ▲ {s?.active.deltaThisWeek ?? 0} this week
            </span>
          }
        />
        <Kpi
          accent="border-t-emerald-600"
          label="Completed (30 d)"
          value={s?.completed30d.count ?? 0}
          trend={
            <span className="text-muted">
              {s?.completed30d.trend === 'same'
                ? '⟶ same as last month'
                : s?.completed30d.trend === 'up'
                  ? '▲ vs last month'
                  : '▼ vs last month'}
            </span>
          }
        />
        <Link
          to="/orders?tab=alerts"
          className="relative col-span-1 cursor-pointer rounded-[10px] border border-line border-t-[3px] border-t-red-600 bg-gradient-to-r from-red-50 to-red-100 p-3.5 sm:col-span-2"
        >
          <div className="mb-1.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-brand-dark">
            ⚠ Need Attention
          </div>
          <div className="flex flex-wrap items-baseline gap-4">
            <div>
              <div className="text-2xl font-bold text-brand-dark">
                {s?.needAttention.total ?? 0}
              </div>
              <div className="text-[10px] font-bold tracking-wider text-red-800 uppercase">
                Total
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-lg bg-orange-200 px-2 py-0.5 text-[11px] font-bold text-orange-800">
                {s?.needAttention.awaitingAction ?? 0} · awaiting your action
              </span>
              {alertChip ? (
                <span className="rounded-lg bg-red-200 px-2 py-0.5 text-[11px] font-bold text-red-900">
                  1 · alert ({alertChip.reason} · {alertChip.orderNumber})
                </span>
              ) : null}
            </div>
          </div>
          <div className="absolute right-3 bottom-2.5 text-[11px] font-extrabold text-brand-dark">
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
      {active.data?.length ? (
        <div className="mb-6 grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          {active.data.map((o) => (
            <OrderCard key={o.number} order={o} />
          ))}
        </div>
      ) : (
        <div className="mb-6 text-sm text-muted">No active orders.</div>
      )}

      <div className="rounded-[10px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-navy">📊 Your activity</h2>
          <div className="flex gap-1.5">
            {PERIODS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPeriod(p.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                  period === p.id
                    ? 'border border-brand bg-brand text-white'
                    : 'border border-slate-200 bg-white text-slate-500'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        {activity.data ? (
          <>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Completed orders
                  </span>
                  <span className="text-xl font-extrabold text-emerald-600">
                    {activity.data.completed.total}{' '}
                    <span className="text-[11px] font-semibold text-slate-500">
                      last 30d
                    </span>
                  </span>
                </div>
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activity.data.completed.series}>
                      <CartesianGrid vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#16A34A" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Spend
                  </span>
                  <span className="text-xl font-extrabold text-brand">
                    {money(activity.data.spend.totalCents)}{' '}
                    <span className="text-[11px] font-semibold text-slate-500">
                      last 30d
                    </span>
                  </span>
                </div>
                <div className="h-[140px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activity.data.spend.series}>
                      <CartesianGrid vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v) => money(Number(v))} />
                      <Area
                        type="monotone"
                        dataKey="valueCents"
                        stroke="#ED1C2E"
                        fill="#ED1C2E"
                        fillOpacity={0.12}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="mt-3.5 flex flex-wrap gap-4 rounded-md bg-slate-100 px-3.5 py-2.5 text-xs text-slate-600">
              <span>
                📈{' '}
                <strong className="text-emerald-600">
                  {activity.data.insights.completedChangePct >= 0 ? '+' : ''}
                  {activity.data.insights.completedChangePct}%
                </strong>{' '}
                completed orders vs previous month
              </span>
              <span>
                💰 <strong className="text-brand">{money(activity.data.insights.spentCents)}</strong> spent · avg{' '}
                {money(activity.data.insights.avgCents)}/order
              </span>
              <span>
                ⭐ Best week: {activity.data.insights.bestWeekLabel} (peak spend{' '}
                {money(activity.data.insights.bestWeekSpendCents)})
              </span>
            </div>
          </>
        ) : (
          <div className="h-32 animate-pulse rounded bg-gray-100" />
        )}
      </div>
    </div>
  );
}

function Kpi({
  accent,
  label,
  value,
  trend,
}: {
  accent: string;
  label: string;
  value: number;
  trend: ReactNode;
}) {
  return (
    <div className={`rounded-[10px] border border-line border-t-[3px] bg-white p-3.5 ${accent}`}>
      <div className="mb-1.5 text-[11px] font-medium tracking-wide text-muted uppercase">
        {label}
      </div>
      <div className="text-2xl font-bold text-navy">{value}</div>
      <div className="mt-1 text-[11px]">{trend}</div>
    </div>
  );
}
