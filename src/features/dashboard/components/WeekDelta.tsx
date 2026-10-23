import { ArrowDown, ArrowUp } from 'lucide-react';

export const WeekDelta = ({ value }: { value: number }) => {
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-emerald-600">
        <ArrowUp className="size-3" aria-hidden="true" /> {value} this week
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-red-600">
        <ArrowDown className="size-3" aria-hidden="true" /> {Math.abs(value)} this week
      </span>
    );
  }
  return <span className="text-muted">No change this week</span>;
};
