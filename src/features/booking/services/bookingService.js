import { delay } from '@/utils/delay';
import { useJourneysStore } from '@/store/journeysStore';
import { DISCOUNT_PERCENT } from './pricing';

const newId = () => `LGA${Math.floor(100000 + Math.random() * 900000)}`;

// Turns a paid booking draft into a journey record in the shape the Journey screen reads.
export async function createJourney({
  pickup,
  dropoff,
  when,
  vehicle,
  notes,
  plan,
  price,
  card,
}) {
  await delay(300);
  const journey = {
    id: newId(),
    type: 'Point to Point',
    status: 'BOOKED',
    scheduledAt: when.date,
    origin: {
      title: pickup.title,
      address: pickup.address,
      coordinate: pickup.coordinate,
    },
    destination: {
      title: dropoff.title,
      address: dropoff.address,
      coordinate: dropoff.coordinate,
    },
    route: plan.coordinates,
    preferences: {
      passengers: 1,
      carryOnBags: 1,
      largeBags: 0,
      childSeat: 'None',
      accessibleVehicle: 'No',
      petFriendly: 'No Need',
    },
    chauffeur: null,
    vehicleName: vehicle.name,
    notes: notes?.trim() || 'No additional notes.',
    payment: {
      status: 'PAID',
      baseFare: price.baseFare,
      discountPercent: DISCOUNT_PERCENT,
      card,
    },
  };
  useJourneysStore.getState().addJourney(journey);
  return journey;
}
