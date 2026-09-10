import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * The backend has no Notification model yet, so there's nothing to fetch
 * from an endpoint. Instead, `AdminNotificationsPage` synthesizes real,
 * meaningful notifications from data the backend already has — new
 * orders and low/out-of-stock products — via `setNotifications` below.
 * Only the read/unread state is persisted client-side; the notifications
 * themselves are recomputed from live data each time the page loads.
 */
export const useNotificationsStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      readIds: [],

      setNotifications: (notifications) => set({ notifications }),

      markRead: (id) => {
        if (!get().readIds.includes(id)) {
          set({ readIds: [...get().readIds, id] });
        }
      },

      markAllRead: () => {
        set({ readIds: get().notifications.map((n) => n.id) });
      },

      isRead: (id) => get().readIds.includes(id),

      unreadCount: () => get().notifications.filter((n) => !get().readIds.includes(n.id)).length,
    }),
    { name: 'pandaworld-admin-notifications', partialize: (state) => ({ readIds: state.readIds }) }
  )
);
