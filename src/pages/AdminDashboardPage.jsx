import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingCart, Users, Package, AlertTriangle, Clock } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { OrderStatusBadge } from '@/components/admin/StatusBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { fetchAllOrders } from '@/services/orders';
import { fetchProducts } from '@/services/products';
import { fetchUsers } from '@/services/admin';
import { formatCurrency, formatDate } from '@/lib/utils';

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [allOrders, pendingOrders, customers, products] = await Promise.all([
        fetchAllOrders({ limit: 5 }),
        fetchAllOrders({ status: 'PENDING', limit: 1 }),
        fetchUsers({ role: 'CUSTOMER', limit: 1 }),
        fetchProducts({ limit: 100 }), // demo-scale: see README note on analytics
      ]);

      if (!mounted) return;

      // Revenue is summed from PAID orders only, across the orders we have
      // in hand (last page fetched) — a real analytics endpoint would sum
      // this server-side across the whole table. Good enough for a
      // first-pass dashboard without a dedicated backend aggregation route.
      const paidOrders = allOrders.orders.filter((o) => o.paymentStatus === 'PAID');
      const revenue = paidOrders.reduce((sum, o) => sum + Number(o.total), 0);

      setStats({
        totalOrders: allOrders.meta.total,
        pendingOrders: pendingOrders.meta.total,
        totalCustomers: customers.meta.total,
        totalProducts: products.meta.total,
        revenueSample: revenue,
      });
      setRecentOrders(allOrders.orders);
      setLowStockProducts(products.products.filter((p) => p.stock <= 5).slice(0, 5));
      setIsLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Dashboard" description="Here's what's happening across PandaWorld right now." />

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Revenue (recent orders)" value={formatCurrency(stats.revenueSample)} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.totalOrders} />
        <StatCard icon={Users} label="Total Customers" value={stats.totalCustomers} />
        <StatCard icon={Package} label="Products in Catalog" value={stats.totalProducts} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-md border border-border bg-white p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold">
              <Clock className="h-4 w-4 text-ink/50" /> Recent Activity
            </h3>
            <Link to="/orders" className="text-xs font-semibold text-ink underline underline-offset-4">
              View all orders
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink/50">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentOrders.map((order) => (
                <li key={order.id} className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-ink">
                      Order #{order.id.slice(-8).toUpperCase()} — {order.user?.name || 'Customer'}
                    </p>
                    <p className="text-xs text-ink/45">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-bold text-ink">{formatCurrency(order.total)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-md border border-border bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
            <AlertTriangle className="h-4 w-4 text-accent" /> Low Stock
          </h3>
          {lowStockProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink/50">All products well-stocked.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {lowStockProducts.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <Link to="/inventory" className="min-w-0 text-sm text-ink/75 hover:text-ink line-clamp-1">
                    {p.name}
                  </Link>
                  <span className="text-xs font-bold text-accent">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-ink/40">
        Note: revenue/order counts above are computed from currently-loaded pages, not a dedicated
        analytics query — see README for adding a backend aggregation endpoint if you need
        exact totals at scale.
      </p>
    </div>
  );
}
