import { create } from 'zustand';
import { seedJourneys } from '@/mocks/journeys';

// All journeys known to the app. Seeded with mock data; new bookings are prepended.
export const useJourneysStore = create((set) => ({
  journeys: seedJourneys,
  addJourney: (journey) => set((state) => ({ journeys: [journey, ...state.journeys] })),
  setStatus: (id, status) =>
    set((state) => ({
      journeys: state.journeys.map((j) => (j.id === id ? { ...j, status } : j)),
    })),
}));

export const isUpcoming = (journey) => journey.status === 'BOOKED';
