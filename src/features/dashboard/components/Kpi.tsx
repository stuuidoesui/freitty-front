import type { ReactNode } from 'react';

export const Kpi = ({
  accent,
  label,
  value,
  trend,
}: {
  accent: string;
  label: string;
  value: number;
  trend: ReactNode;
}) => {
  return (
    <div className={`rounded-card border border-line border-t-[3px] bg-white p-3.5 ${accent}`}>
      <div className="mb-1.5 text-2xs font-medium tracking-wide text-muted uppercase">{label}</div>
      <div className="text-2xl font-bold text-navy">{value}</div>
      <div className="mt-1 text-2xs">{trend}</div>
    </div>
  );
};
