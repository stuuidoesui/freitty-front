import { useQuery } from '@tanstack/react-query';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { api } from '../api/client';
import { money } from '../lib/format';

export function AppLayout() {
  const { data: me } = useQuery({ queryKey: ['me'], queryFn: api.me });
  const { data: counts } = useQuery({
    queryKey: ['order-counts'],
    queryFn: api.counts,
  });
  const location = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const ordersActive = location.pathname.startsWith('/orders');

  function onSearch(e: FormEvent) {
    e.preventDefault();
    navigate(`/orders?search=${encodeURIComponent(q)}`);
  }

  function comingSoon(label: string) {
    setToast(`${label} is outside this assignment’s scope`);
    window.setTimeout(() => setToast(null), 2500);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="bg-navy text-white">
        <div className="px-5 pt-5 pb-6 text-[22px] font-extrabold tracking-tight">
          FREITT<span className="text-brand">Y</span>
        </div>
        <nav>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-2.5 border-l-[3px] px-5 py-2.5 text-sm ${
                isActive && !ordersActive
                  ? 'border-brand bg-[#2e75b626] font-semibold text-white'
                  : 'border-transparent text-[#B0B8C4] hover:text-white'
              }`
            }
          >
            🏠 Dashboard
          </NavLink>
          <NavLink
            to="/orders"
            className={() =>
              `flex items-center gap-2.5 border-l-[3px] px-5 py-2.5 text-sm ${
                ordersActive
                  ? 'border-brand bg-[#2e75b626] font-semibold text-white'
                  : 'border-transparent text-[#B0B8C4] hover:text-white'
              }`
            }
          >
            📦 Orders
            {counts ? (
              <span className="ml-auto rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold">
                {counts.alerts || me?.notificationCount || 0}
              </span>
            ) : null}
          </NavLink>
          <button
            type="button"
            onClick={() => comingSoon('Settings')}
            className="flex w-full items-center gap-2.5 border-l-[3px] border-transparent px-5 py-2.5 text-left text-sm text-[#B0B8C4] hover:text-white"
          >
            ⚙️ Settings
          </button>
        </nav>
        <div className="mt-5 border-t border-white/10 p-5">
          <button
            type="button"
            onClick={() => comingSoon('New Order')}
            className="w-full rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white"
          >
            + New Order
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col bg-canvas">
        <header className="flex flex-wrap items-center gap-3 border-b border-line bg-white px-4 py-3 md:px-6">
          <form onSubmit={onSearch} className="flex max-w-[420px] flex-1 items-center gap-2 rounded-lg bg-gray-100 px-3.5 py-2 text-[13px] text-muted">
            <span>🔍</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search orders, invoices, documents…"
              className="w-full bg-transparent outline-none"
            />
          </form>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => comingSoon('Billing')}
              className="flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-brand-dark"
            >
              💳 {me ? money(me.account.balanceCents) : '—'}
              <span className="text-[10px] font-semibold text-red-600">
                Top up →
              </span>
            </button>
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              🔔
              {(me?.notificationCount ?? 0) > 0 ? (
                <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full border-2 border-white bg-brand" />
              ) : null}
            </div>
            <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-gray-100 sm:flex">
              ❓
            </div>
            <div className="flex items-center gap-2.5 rounded-full bg-gray-100 py-1 pr-3 pl-1">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{
                  background: me?.avatarColor ?? 'linear-gradient(#2E75B6,#1F4E79)',
                }}
              >
                {me?.code ?? 'U1'}
              </div>
              <div className="text-[13px] font-semibold">{me?.name ?? 'User 1'}</div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      {toast ? (
        <div className="fixed right-4 bottom-4 z-50 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
