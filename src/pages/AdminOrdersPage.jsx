import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Eye } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable } from '@/components/admin/DataTable';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/StatusBadge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { fetchAllOrders, updateOrderStatus } from '@/services/orders';
import { formatCurrency, formatDate } from '@/lib/utils';

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PAYMENT_OPTIONS = ['PENDING', 'PAID', 'FAILED'];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    setIsLoading(true);
    fetchAllOrders({
      page,
      limit: 10,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined,
    })
      .then((data) => {
        setOrders(data.orders);
        setMeta(data.meta);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(load, [page, statusFilter, paymentFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStatusChange = async (order, status) => {
    try {
      await updateOrderStatus(order.id, status);
      toast.success(`Order #${order.id.slice(-8).toUpperCase()} marked as ${status}`);
      load();
    } catch (err) {
      toast.error(err.message || 'Could not update order status');
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'Order ID',
      render: (o) => (
        <Link to={`/orders/${o.id}`} className="font-mono text-xs font-semibold text-ink hover:underline">
          #{o.id.slice(-8).toUpperCase()}
        </Link>
      ),
    },
    { key: 'customer', header: 'Customer', render: (o) => o.user?.name || '—' },
    { key: 'date', header: 'Date', render: (o) => formatDate(o.createdAt) },
    { key: 'total', header: 'Total', render: (o) => formatCurrency(o.total) },
    { key: 'payment', header: 'Payment', render: (o) => <PaymentStatusBadge status={o.paymentStatus} /> },
    {
      key: 'status',
      header: 'Status',
      render: (o) => (
        <Select value={o.status} onValueChange={(v) => handleStatusChange(o, v)}>
          <SelectTrigger className="h-9 w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (o) => (
        <Link to={`/orders/${o.id}`} className="inline-flex rounded-full p-2 text-ink/50 transition-colors hover:bg-surface-muted hover:text-ink">
          <Eye className="h-4 w-4" />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Orders" description="View and manage all customer orders." />

      <div className="mb-4 flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Order Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={paymentFilter} onValueChange={(v) => { setPaymentFilter(v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Payment Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            {PAYMENT_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        rows={orders}
        isLoading={isLoading}
        page={page}
        totalPages={meta?.totalPages || 1}
        onPageChange={setPage}
        emptyTitle="No orders found"
      />
    </div>
  );
}
