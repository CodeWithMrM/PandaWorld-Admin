import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Percent,
  Boxes,
  Star,
  Bell,
  BarChart3,
  Settings,
  ShieldCheck,
  Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotificationsStore } from '@/store/notificationsStore';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/products', label: 'Products', icon: Package },
      { to: '/categories', label: 'Categories', icon: FolderTree },
      { to: '/inventory', label: 'Inventory', icon: Boxes },
    ],
  },
  {
    label: 'Sales',
    items: [
      { to: '/orders', label: 'Orders', icon: ShoppingCart },
      { to: '/promotions', label: 'Promotions & Coupons', icon: Percent },
      { to: '/customers', label: 'Customers', icon: Users },
      { to: '/reviews', label: 'Reviews', icon: Star },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/notifications', label: 'Notifications', icon: Bell, showBadge: true },
      { to: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
      { to: '/admins', label: 'Admin Users', icon: ShieldCheck },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

export function AdminSidebar({ className }) {
  const unreadCount = useNotificationsStore((s) => s.unreadCount());

  return (
    <aside className={cn('flex h-full w-64 shrink-0 flex-col border-r border-border bg-white', className)}>
      <div className="flex h-[72px] shrink-0 items-center gap-2 border-b border-border px-6">
        <span className="font-display text-lg font-extrabold tracking-tightest text-ink">PANDAWORLD</span>
        <span className="rounded-full border border-ink/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink/50">
          Admin
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-6">
            <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest2 text-ink/35">
              {group.label}
            </p>
            <ul className="flex flex-col gap-1">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive ? 'bg-ink text-white' : 'text-ink/65 hover:bg-surface-muted hover:text-ink'
                      )
                    }
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {item.showBadge && unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <a
          href={import.meta.env.VITE_STOREFRONT_URL || 'http://localhost:5173'}
          className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-ink/65 transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <Store className="h-4 w-4" />
          Back to Store
        </a>
      </div>
    </aside>
  );
}
