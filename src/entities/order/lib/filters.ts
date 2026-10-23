import type { DateRange, OrderStatus, OrderTab } from '@/shared/api/types';

export type OrderView = 'cards' | 'table' | 'pipeline';

export type OrderFilters = {
  tab: OrderTab;
  hub: string;
  status: OrderStatus | '';
  dateRange: DateRange;
  search: string;
  page: number;
  view: OrderView;
};

export const ORDER_TABS = ['all', 'cross-dock', 'consolidation', 'alerts', 'drafts'] as const;
export const DATE_RANGES = ['all', 'today', 'this-week', 'last-30'] as const;
export const ORDER_VIEWS = ['cards', 'table', 'pipeline'] as const;
export const HUBS = ['all', 'Markham', 'Toronto'] as const;
export const FILTER_STATUSES = [
  'DRAFT',
  'NEW',
  'READY',
  'IN_PROGRESS',
  'ON_STOCK',
  'CONSOLIDATED',
  'IN_TRANSIT',
  'DECONSOLIDATED',
  'COMPLETED',
  'CLOSED',
] as const satisfies readonly OrderStatus[];

const PAGE_SIZE = 12;
export const PIPELINE_LIMIT = 100;

const DEFAULTS = {
  tab: 'all',
  hub: 'all',
  status: '',
  dateRange: 'all',
  search: '',
  page: '1',
  view: 'cards',
} as const;

const oneOf = <T extends string>(value: string | null, allowed: readonly T[], fallback: T): T => {
  if (value != null && (allowed as readonly string[]).includes(value)) return value as T;
  return fallback;
};

export const parseOrderFilters = (params: URLSearchParams): OrderFilters => {
  const page = Number(params.get('page'));
  return {
    tab: oneOf(params.get('tab'), ORDER_TABS, 'all'),
    hub: oneOf(params.get('hub'), HUBS, 'all'),
    status: oneOf(params.get('status'), FILTER_STATUSES, ''),
    dateRange: oneOf(params.get('dateRange'), DATE_RANGES, 'all'),
    search: params.get('search') ?? '',
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    view: oneOf(params.get('view'), ORDER_VIEWS, 'cards'),
  };
};

export const patchFilters = (
  current: URLSearchParams,
  patch: Partial<Record<keyof typeof DEFAULTS, string>>,
): URLSearchParams => {
  const next = new URLSearchParams(current);
  for (const [key, value] of Object.entries(patch) as [keyof typeof DEFAULTS, string][]) {
    if (!value || value === DEFAULTS[key]) next.delete(key);
    else next.set(key, value);
  }
  if (!('page' in patch)) next.delete('page');
  return next;
};

export const toListQuery = (filters: OrderFilters) => {
  return {
    tab: filters.tab,
    hub: filters.hub,
    status: filters.status,
    dateRange: filters.dateRange,
    search: filters.search,
    page: filters.view === 'pipeline' ? 1 : filters.page,
    limit: filters.view === 'pipeline' ? PIPELINE_LIMIT : PAGE_SIZE,
  };
};
