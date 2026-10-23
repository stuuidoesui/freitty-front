import type {
  ActivityPeriod,
  ActivityResponse,
  DashboardSummary,
  Me,
  OrderCounts,
  OrderDetail,
  OrderListItem,
  OrderListQuery,
  OrderListResponse,
} from './types';

const API = import.meta.env.VITE_API_URL ?? '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const errorMessage = (text: string, fallback: string): string => {
  if (!text) return fallback;
  try {
    const body = JSON.parse(text) as { message?: unknown };
    if (Array.isArray(body.message)) return body.message.map(String).join(', ');
    if (typeof body.message === 'string' && body.message) return body.message;
  } catch {
    return text;
  }
  return text;
};

export const orderSearchParams = (params: OrderListQuery): URLSearchParams => {
  const q = new URLSearchParams();
  if (params.tab && params.tab !== 'all') q.set('tab', params.tab);
  if (params.hub && params.hub !== 'all') q.set('hub', params.hub);
  if (params.status) q.set('status', params.status);
  if (params.dateRange && params.dateRange !== 'all') q.set('dateRange', params.dateRange);
  if (params.search) q.set('search', params.search);
  if (params.page) q.set('page', String(params.page));
  if (params.limit) q.set('limit', String(params.limit));
  return q;
};

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const headers = new Headers(init?.headers);
  if (init?.body != null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(res.status, errorMessage(text, res.statusText));
  }
  return (await res.json()) as T;
};

export const api = {
  me: (signal?: AbortSignal) => request<Me>('/api/me', { signal }),
  dashboardSummary: (signal?: AbortSignal) =>
    request<DashboardSummary>('/api/dashboard/summary', { signal }),
  activeOrders: (signal?: AbortSignal) =>
    request<OrderListItem[]>('/api/dashboard/active-orders', { signal }),
  activity: (period: ActivityPeriod, signal?: AbortSignal) =>
    request<ActivityResponse>(`/api/dashboard/activity?period=${period}`, { signal }),
  orders: (params: OrderListQuery, signal?: AbortSignal) =>
    request<OrderListResponse>(`/api/orders?${orderSearchParams(params).toString()}`, { signal }),
  counts: (signal?: AbortSignal) => request<OrderCounts>('/api/orders/counts', { signal }),
  order: (number: string, signal?: AbortSignal) =>
    request<OrderDetail>(`/api/orders/${encodeURIComponent(number)}`, { signal }),
};
