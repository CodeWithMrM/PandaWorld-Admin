import { Badge } from '@/components/ui/badge';

const ORDER_STATUS_VARIANT = {
  PENDING: 'outline',
  PROCESSING: 'muted',
  SHIPPED: 'accentOutline',
  DELIVERED: 'success',
  CANCELLED: 'ink',
};

const PAYMENT_STATUS_VARIANT = {
  PENDING: 'outline',
  PAID: 'success',
  FAILED: 'accent',
};

export function OrderStatusBadge({ status }) {
  return <Badge variant={ORDER_STATUS_VARIANT[status] || 'outline'}>{status}</Badge>;
}

export function PaymentStatusBadge({ status }) {
  return <Badge variant={PAYMENT_STATUS_VARIANT[status] || 'outline'}>{status}</Badge>;
}

export function RoleBadge({ role }) {
  return <Badge variant={role === 'ADMIN' ? 'accent' : 'outline'}>{role}</Badge>;
}
