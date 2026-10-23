import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <section className={cn('overflow-hidden rounded-card border border-line bg-white', className)}>
      {children}
    </section>
  );
};

export const CardHeader = ({
  title,
  extra,
  action,
}: {
  title: ReactNode;
  extra?: ReactNode;
  action?: ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line px-3.5 py-3">
      <div className="flex items-center gap-2">
        <div className="font-bold text-navy">{title}</div>
        {extra ? <div className="text-2xs text-muted">{extra}</div> : null}
      </div>
      {action}
    </div>
  );
};
