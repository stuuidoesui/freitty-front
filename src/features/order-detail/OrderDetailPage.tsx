import { useParams } from 'react-router-dom';
import { ApiError } from '@/shared/api/client';
import { ErrorState } from '@/shared/ui/EmptyState';
import { PageSkeleton } from '@/shared/ui/Skeleton';
import { useOrder } from '@/entities/order/api/queries';
import { OrderFacts } from './components/OrderFacts';
import { OrderHeader } from './components/OrderHeader';
import { OrderTables } from './components/OrderTables';

export const OrderDetailPage = () => {
  const { number = '' } = useParams();
  const query = useOrder(number);

  if (query.isPending) return <PageSkeleton />;
  if (query.isError) {
    const notFound = query.error instanceof ApiError && query.error.status === 404;
    return (
      <ErrorState
        message={notFound ? `Order ${number} was not found` : query.error.message}
        onRetry={notFound ? undefined : () => void query.refetch()}
      />
    );
  }
  if (!query.data) return null;

  return (
    <article>
      <OrderHeader order={query.data} />
      <OrderFacts order={query.data} />
      <OrderTables order={query.data} />
    </article>
  );
};
