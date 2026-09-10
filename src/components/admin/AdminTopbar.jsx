import { Link } from 'react-router-dom';
import { Bell, Search, Menu } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { useNotificationsStore } from '@/store/notificationsStore';

export function AdminTopbar({ onMenuClick }) {
  const unreadCount = useNotificationsStore((s) => s.unreadCount());

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-sm p-2 text-ink transition-colors hover:bg-surface-muted lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden max-w-sm flex-1 sm:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            type="text"
            placeholder="Search orders, products, customers…"
            className="w-72 rounded-sm border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/35 focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-muted"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-ink/70" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Link>
        <div className="h-8 w-px bg-border" />
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
}
