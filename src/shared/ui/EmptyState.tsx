import { Package } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './Button';

export const EmptyState = ({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) => {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center">
      <Package className="mx-auto text-muted" aria-hidden="true" />
      <div className="mt-3 text-sm font-semibold text-navy">{title}</div>
      {hint ? <div className="mt-1 text-xs text-muted">{hint}</div> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
};

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <div className="text-sm font-semibold text-red-800">Could not load data</div>
      <div className="mt-1 text-xs text-red-700">{message}</div>
      {onRetry ? (
        <Button variant="primary" className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
};
