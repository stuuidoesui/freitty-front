import type { ReactNode } from 'react';

export const MetaGrid = ({ rows }: { rows: [string, ReactNode][] }) => {
  return (
    <div className="grid grid-cols-[130px_1fr] gap-x-3.5 gap-y-1.5 text-[13px]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <div className="text-muted">{label}</div>
          <div className="font-medium text-navy">{value}</div>
        </div>
      ))}
    </div>
  );
};
