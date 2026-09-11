import { create } from 'zustand';
import { fetchCurrentUser } from '@/services/orders';

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  isLoading: true,
  hasFetched: false,

  async loadCurrentUser() {
    set({ isLoading: true });
    try {
      const currentUser = await fetchCurrentUser();
      set({ currentUser, isLoading: false, hasFetched: true });
    } catch {
      set({ currentUser: null, isLoading: false, hasFetched: true });
    }
  },

  reset() {
    set({ currentUser: null, isLoading: true, hasFetched: false });
  },

  isAdmin: () => get().currentUser?.role === 'ADMIN',
}));
