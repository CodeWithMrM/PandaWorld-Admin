import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/StatusBadge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { fetchOrderById, updateOrderStatus } from '@/services/orders';
import { formatCurrency, formatDate } from '@/lib/utils';

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    fetchOrderById(id)
      .then(setOrder)
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (status) => {
    try {
      const updated = await updateOrderStatus(id, status);
      setOrder((o) => ({ ...o, ...updated }));
      toast.success(`Order marked as ${status}`);
    } catch (err) {
      toast.error(err.message || 'Could not update status');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!order) {
    return <p className="py-16 text-center text-sm text-ink/55">Order not found.</p>;
  }

  return (
    <div>
      <Link to="/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <PageHeader
        title={`Order #${order.id.slice(-8).toUpperCase()}`}
        description={`Placed on ${formatDate(order.createdAt)} by ${order.user?.name || 'a customer'} (${order.user?.email || '—'})`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-md border border-border bg-white">
            <div className="border-b border-border p-5">
              <h3 className="font-display text-base font-bold">Items</h3>
            </div>
            <ul className="divide-y divide-border">
              {order.items?.map((item) => (
                <li key={item.id} className="flex items-start gap-3 p-4 md:items-center md:gap-4 md:p-5">
                  <div className="h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                    {item.product?.imageUrl && (
                      <img src={item.product.imageUrl} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-ink">{item.product?.name}</p>
                    <p className="text-xs text-ink/45">Qty {item.quantity} × {formatCurrency(item.price)}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-ink">{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-border p-5">
              <span className="font-display font-bold">Order Total</span>
              <span className="font-display text-xl font-bold">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-border bg-white p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/45">Order Status</p>
            <Select value={order.status} onValueChange={handleStatusChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-border bg-white p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/45">Payment</p>
            <PaymentStatusBadge status={order.paymentStatus} />
            <p className="mt-3 text-xs text-ink/45">
              Payment status is set automatically by PayFast's ITN webhook and can't be changed manually here.
            </p>
            <Button variant="default" size="sm" className="mt-3 w-full" disabled title="Refunds aren't automated yet — process via the PayFast merchant dashboard.">
              Issue Refund
            </Button>
          </div>

          <div className="rounded-md border border-border bg-white p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/45">Shipping Address</p>
            <p className="text-sm text-ink/70">{order.shippingAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
