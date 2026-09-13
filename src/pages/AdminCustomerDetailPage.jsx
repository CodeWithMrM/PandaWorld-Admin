import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/StatusBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { fetchUserById } from '@/services/admin';
import { fetchAllOrders } from '@/services/orders';
import { formatCurrency, formatDate } from '@/lib/utils';

export function AdminCustomerDetailPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchUserById(id), fetchAllOrders({ userId: id, limit: 50 })])
      .then(([user, orderData]) => {
        setCustomer(user);
        setOrders(orderData.orders);
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (!customer) {
    return <p className="py-16 text-center text-sm text-ink/55">Customer not found.</p>;
  }

  const totalSpent = orders.filter((o) => o.paymentStatus === 'PAID').reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div>
      <Link to="/customers" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/60 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </Link>

      <PageHeader title={customer.name} description={customer.email} />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-md border border-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Total Orders</p>
          <p className="mt-1 font-display text-xl font-bold">{orders.length}</p>
        </div>
        <div className="rounded-md border border-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Total Spent</p>
          <p className="mt-1 font-display text-xl font-bold">{formatCurrency(totalSpent)}</p>
        </div>
        <div className="rounded-md border border-border bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Customer Since</p>
          <p className="mt-1 font-display text-xl font-bold">{formatDate(customer.createdAt)}</p>
        </div>
      </div>

      <div className="rounded-md border border-border bg-white">
        <div className="border-b border-border p-5">
          <h3 className="font-display text-base font-bold">Order History</h3>
        </div>
        {orders.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink/50">No orders from this customer yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {orders.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <Link to={`/orders/${order.id}`} className="text-sm font-semibold text-ink hover:underline">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </Link>
                  <p className="text-xs text-ink/45">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <PaymentStatusBadge status={order.paymentStatus} />
                  <span className="text-sm font-bold text-ink">{formatCurrency(order.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
