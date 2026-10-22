export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center">
      <div className="text-3xl">📦</div>
      <div className="mt-3 text-sm font-semibold text-navy">{title}</div>
      {hint ? <div className="mt-1 text-xs text-muted">{hint}</div> : null}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <div className="text-sm font-semibold text-red-800">Could not load data</div>
      <div className="mt-1 text-xs text-red-700">{message}</div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white"
        >
          Retry
        </button>
      ) : null}
    </div>
  );
}
