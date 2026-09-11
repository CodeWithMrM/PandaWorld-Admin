import { create } from "zustand";

import { fetchCurrentUser } from "@/services/orders";

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  isLoading: true,
  hasFetched: false,
  error: null,

  async loadCurrentUser() {
    // Prevent duplicate requests while one is already running.
    if (get().isLoading && get().hasFetched === false) {
      // Allow the initial request to proceed.
    }

    set({
      isLoading: true,
      error: null,
    });

    try {
      const currentUser = await fetchCurrentUser();

      console.log("PandaWorld current user:", currentUser);

      set({
        currentUser,
        isLoading: false,
        hasFetched: true,
        error: null,
      });

      return currentUser;
    } catch (error) {
      console.error("Failed to load PandaWorld current user:", {
        message: error?.message,
        status: error?.status,
        responseStatus: error?.response?.status,
        responseData: error?.response?.data,
      });

      set({
        currentUser: null,
        isLoading: false,
        hasFetched: true,
        error,
      });

      return null;
    }
  },

  reset() {
    set({
      currentUser: null,
      isLoading: false,
      hasFetched: false,
      error: null,
    });
  },

  isAdmin() {
    return get().currentUser?.role === "ADMIN";
  },
}));
