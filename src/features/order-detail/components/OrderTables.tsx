import { Lightbulb, Pencil, Trash2 } from 'lucide-react';
import type { Operation, OrderDetail, Supply } from '@/shared/api/types';
import { operationLabel } from '@/entities/order/lib/labels';
import { comingSoon, useToast } from '@/shared/ui/toast/useToast';
import { money } from '@/shared/lib/format';
import { formatWhen } from '@/shared/lib/format';
import { supplyVariant } from '../lib/supplyVariant';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { Card, CardHeader } from '@/shared/ui/Card';
import { DataTable, type Column } from '@/shared/ui/Table';
import { OperationActions } from './OperationActions';

export const OrderTables = ({ order }: { order: OrderDetail }) => {
  const notify = useToast();
  return (
    <div className="mt-4 space-y-3.5">
      <Card>
        <CardHeader
          title="Operations"
          action={<Button onClick={() => comingSoon(notify, 'Add operation')}>+ Operation</Button>}
        />
        {order.operations.length === 0 ? (
          <p className="px-3.5 py-6 text-sm text-muted">No operations yet.</p>
        ) : (
          <DataTable
            columns={operationColumns}
            rows={order.operations}
            rowKey={(operation) =>
              `${operation.type}-${operation.appliedAt}-${operation.trailer ?? ''}`
            }
            rowClassName={(operation) => (operation.type === 'DISPOSAL' ? 'bg-red-50' : undefined)}
          />
        )}
      </Card>

      <Card>
        <CardHeader
          title="Supplies"
          extra="mandatory stock items purchased as Platform Sale"
          action={<Button onClick={() => comingSoon(notify, 'Add supply')}>+ Supply</Button>}
        />
        {order.supplies.length === 0 ? (
          <p className="px-3.5 py-6 text-sm text-muted">No supplies on this order.</p>
        ) : (
          <DataTable
            columns={supplyColumns(notify)}
            rows={order.supplies}
            rowKey={(supply) => supply.sku}
            footer={
              <tfoot className="bg-gray-50 text-xs">
                <tr className="border-t border-line">
                  <td colSpan={4} className="px-3 py-2.5 text-right font-semibold text-muted">
                    Supply subtotal
                  </td>
                  <td className="px-3 py-2.5 text-right font-bold text-navy">
                    {money(order.supplySubtotalCents, 2)}
                  </td>
                  <td className="px-3 py-2.5 text-2xs text-muted">Invoice line items</td>
                </tr>
              </tfoot>
            }
          />
        )}
        <p className="border-t border-purple-200 bg-purple-50 px-3.5 py-2 text-2xs text-violet-800">
          <Lightbulb className="mr-1 inline size-3.5" aria-hidden="true" />
          Supply picker (FOE catalog — 16 SKUs) is available during Cross-Dock / Sub-order creation
          and in Builder delegation mode. Client sees only Platform price; warehouse cost and margin
          split are hidden.
        </p>
      </Card>
    </div>
  );
};

const operationColumns: Column<Operation>[] = [
  {
    id: 'type',
    header: 'Operation',
    cell: (operation) => (
      <span>
        {operation.billable ? <span className="font-bold text-emerald-600">$ </span> : null}
        {operation.type === 'DISPOSAL' ? (
          <Badge variant="alert">Disposal</Badge>
        ) : (
          operationLabel(operation.type)
        )}
      </span>
    ),
  },
  { id: 'trailer', header: 'Trailer', cell: (operation) => operation.trailer ?? '—' },
  {
    id: 'qty',
    header: 'Q-ty',
    align: 'right',
    cell: (operation) => (
      <span
        className={
          operation.type === 'DISPOSAL'
            ? 'font-semibold text-red-600'
            : 'font-semibold text-blue-600'
        }
      >
        {operation.qty}
      </span>
    ),
  },
  { id: 'unit', header: 'Unit', cell: (operation) => operation.unit },
  {
    id: 'applied',
    header: 'Applied at',
    cell: (operation) => <span className="text-muted">{formatWhen(operation.appliedAt)}</span>,
  },
  {
    id: 'action',
    header: 'Action',
    cell: (operation) => <OperationActions operation={operation} />,
  },
];

const supplyColumns = (notify: (message: string) => void): Column<Supply>[] => {
  return [
    { id: 'sku', header: 'SKU', cell: (supply) => supply.sku },
    {
      id: 'category',
      header: 'Category',
      cell: (supply) => <Badge variant={supplyVariant(supply.category)}>{supply.category}</Badge>,
    },
    {
      id: 'qty',
      header: 'Q-ty',
      align: 'right',
      cell: (supply) => <span className="font-semibold">{supply.qty}</span>,
    },
    { id: 'unit', header: 'Unit $', align: 'right', cell: (supply) => money(supply.unitCents, 2) },
    {
      id: 'total',
      header: 'Line total',
      align: 'right',
      cell: (supply) => <span className="font-semibold">{money(supply.lineTotalCents, 2)}</span>,
    },
    {
      id: 'action',
      header: 'Action',
      cell: (supply) => (
        <button
          type="button"
          className="inline-flex items-center gap-1 text-gray-400"
          aria-label={`Edit or remove ${supply.sku}`}
          onClick={() => comingSoon(notify, 'Supply actions')}
        >
          <Pencil className="size-3.5" aria-hidden="true" />
          <Trash2 className="size-3.5" aria-hidden="true" />
        </button>
      ),
    },
  ];
};
