import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, AlertTriangle, Check } from 'lucide-react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { fetchAllOrders } from '@/services/orders';
import { fetchProducts } from '@/services/products';
import { useNotificationsStore } from '@/store/notificationsStore';
import { formatCurrency, formatDate, cn } from '@/lib/utils';

export function AdminNotificationsPage() {
  const { notifications, setNotifications, isRead, markRead, markAllRead } = useNotificationsStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchAllOrders({ limit: 10 }), fetchProducts({ limit: 100 })]).then(([orderData, productData]) => {
      if (!mounted) return;

      const orderNotifications = orderData.orders.map((o) => ({
        id: `order-${o.id}`,
        type: 'order',
        title: `New order #${o.id.slice(-8).toUpperCase()}`,
        description: `${o.user?.name || 'A customer'} placed an order for ${formatCurrency(o.total)}`,
        createdAt: o.createdAt,
        link: `/orders/${o.id}`,
      }));

      const stockNotifications = productData.products
        .filter((p) => p.stock <= 5)
        .map((p) => ({
          id: `stock-${p.id}`,
          type: 'stock',
          title: p.stock <= 0 ? `"${p.name}" is out of stock` : `"${p.name}" is running low`,
          description: p.stock <= 0 ? 'Restock as soon as possible.' : `Only ${p.stock} unit(s) remaining.`,
          createdAt: p.updatedAt,
          link: '/inventory',
        }));

      const combined = [...orderNotifications, ...stockNotifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotifications(combined);
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [setNotifications]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Recent orders and inventory alerts, generated from live store data."
        actions={
          <Button variant="default" size="sm" onClick={markAllRead}>
            <Check className="h-4 w-4" /> Mark all as read
          </Button>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState title="You're all caught up" description="No new orders or stock alerts right now." />
      ) : (
        <ul className="flex flex-col gap-2">
          {notifications.map((n) => {
            const read = isRead(n.id);
            return (
              <li key={n.id}>
                <Link
                  to={n.link}
                  onClick={() => markRead(n.id)}
                  className={cn(
                    'flex items-start gap-4 rounded-md border p-4 transition-colors',
                    read ? 'border-border bg-white' : 'border-ink/15 bg-surface-muted'
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                      n.type === 'stock' ? 'bg-accent/10' : 'bg-ink/5'
                    )}
                  >
                    {n.type === 'stock' ? (
                      <AlertTriangle className="h-4 w-4 text-accent" />
                    ) : (
                      <ShoppingCart className="h-4 w-4 text-ink" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={cn('text-sm', read ? 'font-medium text-ink/70' : 'font-semibold text-ink')}>
                      {n.title}
                    </p>
                    <p className="mt-0.5 text-xs text-ink/50">{n.description}</p>
                    <p className="mt-1 text-[11px] text-ink/35">{formatDate(n.createdAt)}</p>
                  </div>
                  {!read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
