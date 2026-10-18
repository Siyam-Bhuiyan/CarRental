import { useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { getDrivingRoute } from '../services/drivingRouteService';

// Fetches the driving route for the current pickup / drop-off and stores it in the draft.
export default function useRoutePlan() {
  const pickup = useBookingStore((s) => s.pickup);
  const dropoff = useBookingStore((s) => s.dropoff);
  const plan = useBookingStore((s) => s.plan);
  const setPlan = useBookingStore((s) => s.setPlan);

  useEffect(() => {
    if (!pickup || !dropoff || plan) return undefined;
    let active = true;
    getDrivingRoute(pickup.coordinate, dropoff.coordinate).then((result) => {
      if (active) setPlan(result);
    });
    return () => {
      active = false;
    };
  }, [pickup, dropoff, plan, setPlan]);

  return { pickup, dropoff, plan, loading: !plan };
}
