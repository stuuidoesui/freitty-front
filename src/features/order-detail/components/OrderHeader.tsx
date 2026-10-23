import {
  Camera,
  Clock,
  Download,
  Info,
  ArrowLeft,
  DollarSign,
  Menu,
  MessageSquare,
  Package,
  Pencil,
  Printer,
  QrCode,
  Truck,
} from 'lucide-react';
import type { OrderDetail } from '@/shared/api/types';
import { qtyDelta } from '@/entities/order/lib/domain';
import { typeLabel } from '@/entities/order/lib/labels';
import { statusVariant } from '@/entities/order/lib/status';
import { RefNumber } from '@/entities/order/ui/RefNumber';
import { roleLabel } from '@/entities/user/lib/labels';
import { comingSoon, useToast } from '@/shared/ui/toast/useToast';
import { Alert } from '@/shared/ui/Alert';
import { Avatar } from '@/shared/ui/Avatar';
import { Badge } from '@/shared/ui/Badge';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { Button, ButtonLink } from '@/shared/ui/Button';

export const OrderHeader = ({ order }: { order: OrderDetail }) => {
  const notify = useToast();
  const delta = qtyDelta(order);
  const photos =
    order.requiredPhotos > 0
      ? `${order.photoCount}/${order.requiredPhotos}`
      : String(order.photoCount);

  return (
    <header>
      <Breadcrumbs items={[{ label: 'Orders', to: '/orders' }, { label: order.number }]} />
      <div className="mb-3.5 flex items-center gap-3 border-b border-line pt-2 pb-3.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-[22px] font-black text-white">
          F
        </div>
        <h1 className="text-lg font-bold text-navy">{typeLabel(order.type)} management</h1>
        <div className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-muted">
          <Menu className="size-4" aria-hidden="true" />
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2.5">
        <ButtonLink to="/orders" aria-label="Back to orders">
          <ArrowLeft className="size-3.5" aria-hidden="true" />
        </ButtonLink>
        <span className="text-blue-600" aria-hidden="true">
          <Package className="size-5" />
        </span>
        <span className="text-[13px] text-muted">Order#:</span>
        <strong className="text-[15px] text-navy">{order.number}</strong>
        <span className="font-bold text-emerald-600" aria-hidden="true">
          $
        </span>
        <span className="text-base text-muted" aria-hidden="true">
          <Truck className="size-4" aria-hidden="true" />
        </span>
        <Badge variant={order.type === 'CONSOLIDATION' ? 'consol' : 'prog'}>
          {typeLabel(order.type)}
        </Badge>
        <Badge
          variant={
            order.status === 'ON_STOCK' ? 'new' : statusVariant(order.status, order.hasAlert)
          }
        >
          {order.status === 'ON_STOCK' ? `● ${order.statusLabel}` : order.statusLabel}
        </Badge>
        {order.nextStep ? <Badge variant="prog">{order.nextStep}</Badge> : null}
        {order.refNumber ? <RefNumber value={order.refNumber} /> : null}
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line bg-slate-50 py-0.5 pr-2.5 pl-1 text-2xs font-bold">
          <span className="font-medium text-gray-400">by</span>
          <Avatar code={order.createdBy.code} color={order.createdBy.avatarColor} />
          {order.createdBy.name}
          <span className="rounded bg-blue-100 px-1.5 text-[9px] font-extrabold tracking-wide text-blue-800 uppercase">
            {roleLabel(order.createdBy.role)}
          </span>
        </span>
        {delta != null ? (
          <Badge variant="warn">
            Actual ≠ Expected ({delta > 0 ? '+' : ''}
            {delta})
          </Badge>
        ) : null}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button
          onClick={() => comingSoon(notify, 'Comments')}
          aria-label={`${order.commentCount} comments`}
        >
          <MessageSquare className="size-3.5" aria-hidden="true" />{' '}
          <span className="text-gray-400">{order.commentCount}/0</span>
        </Button>
        <Button onClick={() => comingSoon(notify, 'Photos')} aria-label={`${photos} photos`}>
          <Camera className="size-3.5" aria-hidden="true" />{' '}
          <span className="text-gray-400">{photos}</span>
        </Button>
        <Button aria-label="Invoice" onClick={() => comingSoon(notify, 'Invoice')}>
          <DollarSign className="size-3.5" aria-hidden="true" />
        </Button>
        <Button aria-label="Print" onClick={() => comingSoon(notify, 'Print')}>
          <Printer className="size-3.5" aria-hidden="true" />
        </Button>
        <Button aria-label="Package" onClick={() => comingSoon(notify, 'Package')}>
          <Package className="size-3.5" aria-hidden="true" />
        </Button>
        <Button aria-label="History" onClick={() => comingSoon(notify, 'History')}>
          <Clock className="size-3.5" aria-hidden="true" />
        </Button>
        <div className="ml-auto flex gap-2">
          <Button onClick={() => comingSoon(notify, 'Share QR')}>
            <QrCode className="size-3.5" aria-hidden="true" /> Share QR
          </Button>
          <Button variant="primary" onClick={() => comingSoon(notify, 'BOL PDF')}>
            <Download className="size-3.5" aria-hidden="true" /> BOL PDF
          </Button>
          <Button variant="primary" onClick={() => comingSoon(notify, 'Edit')}>
            <Pencil className="size-3.5" aria-hidden="true" /> Edit
          </Button>
        </div>
      </div>

      <div className="mt-2.5">
        <Alert tone="info" icon={<Info className="size-4" />}>
          <strong>Read-only:</strong> Transfer операції між hub-ами виконує тільки call center. Якщо
          треба перенести — натисни Chat.
        </Alert>
      </div>
    </header>
  );
};
