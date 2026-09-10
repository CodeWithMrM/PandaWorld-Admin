import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * The backend has no Coupon model yet, so promotions live entirely in this
 * browser for now — a working mockup of the intended UX. Swap for real
 * `/api/coupons` CRUD once that endpoint exists; the storefront's
 * `CartPage` currently validates against a couple of hardcoded demo codes
 * (PANDA10 / WELCOME15) rather than reading from here — wire both up to
 * the same backend endpoint together.
 */
export const usePromotionsStore = create(
  persist(
    (set, get) => ({
      promotions: [
        { id: 'demo-1', code: 'PANDA10', type: 'percentage', value: 10, active: true, usageCount: 0 },
        { id: 'demo-2', code: 'WELCOME15', type: 'percentage', value: 15, active: true, usageCount: 0 },
      ],

      addPromotion: (promo) => {
        set({ promotions: [...get().promotions, { id: crypto.randomUUID(), usageCount: 0, ...promo }] });
      },

      togglePromotion: (id) => {
        set({
          promotions: get().promotions.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
        });
      },

      removePromotion: (id) => {
        set({ promotions: get().promotions.filter((p) => p.id !== id) });
      },
    }),
    { name: 'pandaworld-admin-promotions' }
  )
);
