import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { fetchAllOrders } from '@/services/orders';
import { fetchProducts, fetchCategories } from '@/services/products';
import { fetchUsers } from '@/services/admin';

const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const PAYMENT_STATUSES = ['PENDING', 'PAID', 'FAILED'];

export function AdminReportsPage() {
  const [orderBreakdown, setOrderBreakdown] = useState([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [totals, setTotals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const [orderCounts, paymentCounts, categories, customers, products] = await Promise.all([
        Promise.all(ORDER_STATUSES.map((s) => fetchAllOrders({ status: s, limit: 1 }))),
        Promise.all(PAYMENT_STATUSES.map((s) => fetchAllOrders({ paymentStatus: s, limit: 1 }))),
        fetchCategories(),
        fetchUsers({ role: 'CUSTOMER', limit: 1 }),
        fetchProducts({ limit: 1 }),
      ]);

      if (!mounted) return;

      setOrderBreakdown(ORDER_STATUSES.map((s, i) => ({ label: s, count: orderCounts[i].meta.total })));
      setPaymentBreakdown(PAYMENT_STATUSES.map((s, i) => ({ label: s, count: paymentCounts[i].meta.total })));

      const categoryCounts = await Promise.all(
        categories.map((c) => fetchProducts({ categoryId: c.id, limit: 1 }).then((r) => ({ name: c.name, count: r.meta.total })))
      );
      if (!mounted) return;
      setCategoryBreakdown(categoryCounts.sort((a, b) => b.count - a.count));

      setTotals({ customers: customers.meta.total, products: products.meta.total });
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

  const maxOrderCount = Math.max(...orderBreakdown.map((b) => b.count), 1);
  const maxCategoryCount = Math.max(...categoryBreakdown.map((b) => b.count), 1);

  return (
    <div>
      <PageHeader
        title="Reports & Analytics"
        description="Tabular breakdowns computed from live store data. Charts aren't wired up yet — see README for adding a dedicated analytics endpoint."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-md border border-border bg-white p-5">
          <h3 className="mb-4 font-display text-base font-bold">Orders by Status</h3>
          <ul className="flex flex-col gap-3">
            {orderBreakdown.map((row) => (
              <li key={row.label}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-ink/70">{row.label}</span>
                  <span className="font-semibold text-ink">{row.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-ink"
                    style={{ width: `${(row.count / maxOrderCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-border bg-white p-5">
          <h3 className="mb-4 font-display text-base font-bold">Orders by Payment Status</h3>
          <ul className="flex flex-col gap-3">
            {paymentBreakdown.map((row) => (
              <li key={row.label} className="flex items-center justify-between rounded-sm bg-surface-muted px-4 py-3 text-sm">
                <span className="text-ink/70">{row.label}</span>
                <span className="font-bold text-ink">{row.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-border bg-white p-5 lg:col-span-2">
          <h3 className="mb-4 font-display text-base font-bold">Products by Category</h3>
          {categoryBreakdown.length === 0 ? (
            <p className="text-sm text-ink/50">No categories yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {categoryBreakdown.map((row) => (
                <li key={row.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-ink/70">{row.name}</span>
                    <span className="font-semibold text-ink">{row.count} products</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-muted">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(row.count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-md border border-border bg-white p-5">
          <h3 className="mb-4 font-display text-base font-bold">Store Totals</h3>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink/60">Total Customers</span>
              <span className="font-bold text-ink">{totals.customers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Total Products</span>
              <span className="font-bold text-ink">{totals.products}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/60">Total Orders</span>
              <span className="font-bold text-ink">
                {orderBreakdown.reduce((sum, r) => sum + r.count, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
