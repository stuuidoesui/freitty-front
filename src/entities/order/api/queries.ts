import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ActivityPeriod } from '@/shared/api/types';
import { api } from '@/shared/api/client';
import { toListQuery, type OrderFilters } from '../lib/filters';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,
  counts: () => [...orderKeys.all, 'counts'] as const,
  detail: (number: string) => [...orderKeys.all, 'detail', number] as const,
};

export const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
  active: () => [...dashboardKeys.all, 'active'] as const,
  activity: (period: ActivityPeriod) => [...dashboardKeys.all, 'activity', period] as const,
};

export const userKeys = {
  me: ['me'] as const,
};

export const useMe = () => {
  return useQuery({ queryKey: userKeys.me, queryFn: ({ signal }) => api.me(signal) });
};

export const useOrderCounts = () => {
  return useQuery({ queryKey: orderKeys.counts(), queryFn: ({ signal }) => api.counts(signal) });
};

export const useOrders = (filters: OrderFilters) => {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: ({ signal }) => api.orders(toListQuery(filters), signal),
    placeholderData: keepPreviousData,
  });
};

export const useOrder = (number: string) => {
  return useQuery({
    queryKey: orderKeys.detail(number),
    queryFn: ({ signal }) => api.order(number, signal),
    enabled: Boolean(number),
    retry: false,
  });
};

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: ({ signal }) => api.dashboardSummary(signal),
  });
};

export const useActiveOrders = () => {
  return useQuery({
    queryKey: dashboardKeys.active(),
    queryFn: ({ signal }) => api.activeOrders(signal),
  });
};

export const useActivity = (period: ActivityPeriod) => {
  return useQuery({
    queryKey: dashboardKeys.activity(period),
    queryFn: ({ signal }) => api.activity(period, signal),
  });
};
