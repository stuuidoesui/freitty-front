import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export type Column<T> = {
  id: string;
  header: string;
  align?: 'left' | 'right';
  cell: (row: T) => ReactNode;
};

export const DataTable = <T,>({
  columns,
  rows,
  rowKey,
  onRow,
  rowLabel,
  rowClassName,
  footer,
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRow?: (row: T) => void;
  rowLabel?: (row: T) => string;
  rowClassName?: (row: T) => string | undefined;
  footer?: ReactNode;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-gray-50 text-2xs tracking-wide text-muted uppercase">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className={cn('px-3 py-2 font-medium', column.align === 'right' && 'text-right')}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={cn(
                'border-t border-gray-100',
                onRow && 'cursor-pointer hover:bg-slate-50',
                rowClassName?.(row),
              )}
              role={onRow ? 'button' : undefined}
              aria-label={rowLabel?.(row)}
              tabIndex={onRow ? 0 : undefined}
              onClick={onRow ? () => onRow(row) : undefined}
              onKeyDown={
                onRow
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onRow(row);
                      }
                    }
                  : undefined
              }
            >
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={cn('px-3 py-2.5', column.align === 'right' && 'text-right')}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer}
      </table>
    </div>
  );
};
