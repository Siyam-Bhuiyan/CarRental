import { create } from 'zustand';
import { DEMO_USER_LOCATION } from '@/config/demo';

export const CURRENT_LOCATION = {
  id: 'current',
  title: 'Malaga Ave',
  address: '1116 Malaga Ave, Coral Gables, FL 33134',
  coordinate: DEMO_USER_LOCATION,
};

const initial = {
  pickup: CURRENT_LOCATION,
  dropoff: null,
  when: null, // { id, label, date }
  vehicleId: null,
  notes: '',
  plan: null, // { coordinates, distanceKm, durationMin }
};

// The booking in progress. Lives across the search -> vehicles -> checkout screens.
export const useBookingStore = create((set) => ({
  ...initial,
  setPickup: (pickup) => set({ pickup, plan: null }),
  setDropoff: (dropoff) => set({ dropoff, plan: null }),
  setWhen: (when) => set({ when }),
  setVehicle: (vehicleId) => set({ vehicleId }),
  setNotes: (notes) => set({ notes }),
  setPlan: (plan) => set({ plan }),
  swapStops: () =>
    set((s) => (s.dropoff ? { pickup: s.dropoff, dropoff: s.pickup, plan: null } : {})),
  reset: () => set(initial),
}));
