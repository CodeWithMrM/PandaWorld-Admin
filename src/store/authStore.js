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
      console.log('Current user data:', currentUser);
      set({ currentUser, isLoading: false, hasFetched: true });
    } catch (error) {
      console.error('Error loading current user:', error);
      set({ currentUser: null, isLoading: false, hasFetched: true });
    }
  },

  reset() {
    set({ currentUser: null, isLoading: true, hasFetched: false });
  },

  isAdmin: () => get().currentUser?.role === 'ADMIN',
}));
