import { lazy } from 'react';
import { useRouteError } from 'react-router-dom';
import { ErrorState } from '@/shared/ui/EmptyState';

export const DashboardPage = lazy(() =>
  import('@/features/dashboard/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  })),
);
export const OrdersPage = lazy(() =>
  import('@/features/orders/OrdersPage').then((module) => ({ default: module.OrdersPage })),
);
export const OrderDetailPage = lazy(() =>
  import('@/features/order-detail/OrderDetailPage').then((module) => ({
    default: module.OrderDetailPage,
  })),
);

export const RootError = () => {
  const error = useRouteError();
  const message = error instanceof Error ? error.message : 'Something went wrong';
  return (
    <div className="grid min-h-screen place-items-center bg-canvas p-6">
      <div className="w-full max-w-lg">
        <ErrorState message={message} onRetry={() => window.location.assign('/')} />
      </div>
    </div>
  );
};
