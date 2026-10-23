import type { ReactElement } from 'react';
import { ResponsiveContainer } from 'recharts';

export const ChartBlock = ({
  title,
  total,
  tone,
  children,
}: {
  title: string;
  total: string;
  tone: string;
  children: ReactElement;
}) => {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {title}
        </span>
        <span className={`text-xl font-extrabold ${tone}`}>
          {total} <span className="text-2xs font-semibold text-slate-500">last 30d</span>
        </span>
      </div>
      <div className="h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
