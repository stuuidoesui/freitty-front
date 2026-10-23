import { Suspense, useState, type FormEvent } from 'react';
import { Bell, CircleHelp, CreditCard, Menu, Package, Search, Settings, X } from 'lucide-react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useMe, useOrderCounts } from '@/entities/order/api/queries';
import { patchFilters } from '@/entities/order/lib/filters';
import { comingSoon, useToast } from '@/shared/ui/toast/useToast';
import { money } from '@/shared/lib/format';
import { cn } from '@/shared/lib/cn';
import { Avatar } from '@/shared/ui/Avatar';
import { NavItem } from '@/shared/ui/NavItem';
import { PageSkeleton } from '@/shared/ui/Skeleton';

export const AppLayout = () => {
  const me = useMe();
  const counts = useOrderCounts();
  const notify = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const urlSearch = params.get('search') ?? '';
  const [query, setQuery] = useState(urlSearch);
  const [syncedSearch, setSyncedSearch] = useState(urlSearch);
  if (urlSearch !== syncedSearch) {
    setSyncedSearch(urlSearch);
    setQuery(urlSearch);
  }

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(location.pathname);
  if (location.pathname !== menuPath) {
    setMenuPath(location.pathname);
    setMenuOpen(false);
  }

  const onSearch = (event: FormEvent) => {
    event.preventDefault();
    const next = location.pathname.startsWith('/orders')
      ? patchFilters(params, { search: query })
      : patchFilters(new URLSearchParams(), { search: query });
    void navigate({ pathname: '/orders', search: next.toString() });
  };

  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      {menuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-navy/40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <aside
        className={cn(
          'z-40 flex w-[220px] flex-col bg-navy text-white max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:transition-transform',
          menuOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-6 text-[22px] font-extrabold tracking-tight">
          <span>
            FREITT<span className="text-brand">Y</span>
          </span>
          <button
            type="button"
            className="md:hidden"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <nav className="flex flex-col" aria-label="Primary">
          <NavItem to="/orders" icon={<Package className="size-4" aria-hidden="true" />}>
            Orders
            {counts.data && counts.data.alerts > 0 && !location.pathname.startsWith('/orders/') ? (
              <span className="ml-auto rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold">
                {counts.data.alerts}
              </span>
            ) : null}
          </NavItem>
          <button
            type="button"
            onClick={() => comingSoon(notify, 'Settings')}
            className="flex w-full items-center gap-2.5 border-l-[3px] border-transparent px-5 py-2.5 text-left text-sm text-sidebar-muted hover:text-white"
          >
            <Settings className="size-4" aria-hidden="true" /> Settings
          </button>
        </nav>
        {location.pathname === '/' ? (
          <div className="mt-5 border-t border-white/10 p-5">
            <button
              type="button"
              onClick={() => comingSoon(notify, 'New Order')}
              className="w-full rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white"
            >
              + New Order
            </button>
          </div>
        ) : null}
      </aside>

      <div className="flex min-w-0 flex-col bg-canvas">
        <header className="flex flex-wrap items-center gap-3 border-b border-line bg-white px-4 py-3 md:px-6">
          <button
            type="button"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
          <search className="max-w-[420px] flex-1">
            <form
              onSubmit={onSearch}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-3.5 py-2 text-[13px] text-muted"
            >
              <Search className="size-4 shrink-0" aria-hidden="true" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  location.pathname.startsWith('/orders/')
                    ? 'Search…'
                    : 'Search orders, invoices, documents…'
                }
                aria-label="Search orders"
                className="w-full bg-transparent outline-none"
              />
            </form>
          </search>
          <div className="ml-auto flex items-center gap-2">
            {!location.pathname.startsWith('/orders/') ? (
              <button
                type="button"
                onClick={() => comingSoon(notify, 'Billing')}
                className="mr-1 flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-brand-dark"
              >
                <CreditCard className="size-3.5" aria-hidden="true" />{' '}
                {me.data ? money(me.data.account.balanceCents) : '—'}
                <span className="text-[10px] font-semibold text-red-600">Top up →</span>
              </button>
            ) : null}
            <button
              type="button"
              aria-label={
                me.data && me.data.notificationCount > 0
                  ? `${me.data.notificationCount} notifications`
                  : 'Notifications'
              }
              onClick={() => comingSoon(notify, 'Notifications')}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100"
            >
              <Bell className="size-4" aria-hidden="true" />
              {(me.data?.notificationCount ?? 0) > 0 ? (
                <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full border-2 border-white bg-brand" />
              ) : null}
            </button>
            {location.pathname === '/' ? (
              <button
                type="button"
                aria-label="Help"
                onClick={() => comingSoon(notify, 'Help')}
                className="hidden h-9 w-9 items-center justify-center rounded-lg bg-gray-100 sm:flex"
              >
                <CircleHelp className="size-4" aria-hidden="true" />
              </button>
            ) : null}
            <div className="flex items-center gap-2.5 rounded-full bg-gray-100 py-1 pr-3 pl-1">
              <Avatar code={me.data?.code ?? '…'} color={me.data?.avatarColor} size="lg" />
              <div className="text-[13px] font-semibold">{me.data?.name ?? '…'}</div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Suspense fallback={<PageSkeleton />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
};
