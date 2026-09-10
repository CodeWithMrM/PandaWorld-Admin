import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** No Settings model on the backend yet — persisted locally for now. */
export const useSettingsStore = create(
  persist(
    (set) => ({
      storeName: 'PandaWorld Apparel',
      supportEmail: 'support@pandaworld.co.za',
      currency: 'ZAR',
      freeShippingThreshold: 899,
      standardShippingFee: 99,
      expressShippingFee: 149,
      update: (patch) => set(patch),
    }),
    { name: 'pandaworld-admin-settings' }
  )
);
