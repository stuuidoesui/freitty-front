import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/app/layouts/AppLayout';
import { NotFound } from '../NotFound';
import { DashboardPage, OrderDetailPage, OrdersPage, RootError } from './routes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RootError />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/:number', element: <OrderDetailPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
