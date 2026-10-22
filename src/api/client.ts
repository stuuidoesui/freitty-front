import type { ActivityPeriod, ActivityResponse, DashboardSummary, Me, OrderCounts, OrderDetail, OrderListItem, OrderListResponse, OrderStatus, OrderTab, DateRange } from './types';

const API = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, text || res.statusText);
  }
  if (res.headers.get('content-type')?.includes('text/csv')) {
    return (await res.text()) as T;
  }
  return (await res.json()) as T;
}

export const api = {
  me: () => request<Me>('/api/me'),
  health: () => request<{ status: string }>('/api/health'),
  dashboardSummary: () => request<DashboardSummary>('/api/dashboard/summary'),
  activeOrders: () => request<OrderListItem[]>('/api/dashboard/active-orders'),
  activity: (period: ActivityPeriod) =>
    request<ActivityResponse>(`/api/dashboard/activity?period=${period}`),
  orders: (params: {
    tab?: OrderTab;
    hub?: string;
    status?: OrderStatus | '';
    dateRange?: DateRange;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const q = new URLSearchParams();
    if (params.tab) q.set('tab', params.tab);
    if (params.hub && params.hub !== 'all') q.set('hub', params.hub);
    if (params.status) q.set('status', params.status);
    if (params.dateRange) q.set('dateRange', params.dateRange);
    if (params.search) q.set('search', params.search);
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    return request<OrderListResponse>(`/api/orders?${q.toString()}`);
  },
  counts: () => request<OrderCounts>('/api/orders/counts'),
  order: (number: string) => request<OrderDetail>(`/api/orders/${number}`),
  patchStatus: (number: string, status: OrderStatus) =>
    request<OrderDetail>(`/api/orders/${number}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  exportUrl: (params: Record<string, string>) => {
    const q = new URLSearchParams(params);
    return `${API}/api/orders/export.csv?${q.toString()}`;
  },
};
