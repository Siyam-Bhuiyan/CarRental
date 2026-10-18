import upcomingJson from './journey.json';
import routeJson from './route.json';

// Seed data for the journeys store: the sample upcoming journey plus two completed rides.
const route = routeJson.coordinates;
const chauffeur = { name: 'Daniel Reyes', vehicle: 'Black SUV' };
const paidCard = { brand: 'visa', last4: '4242', expiry: '12/26', status: 'Active' };

export const upcomingJourney = { ...upcomingJson, route };

const past = (id, scheduledAt, reverse) => ({
  ...upcomingJson,
  id,
  status: 'COMPLETED',
  scheduledAt,
  origin: reverse ? upcomingJson.destination : upcomingJson.origin,
  destination: reverse ? upcomingJson.origin : upcomingJson.destination,
  route: reverse ? [...route].reverse() : route,
  chauffeur,
  payment: { ...upcomingJson.payment, status: 'PAID', card: paidCard },
});

export const seedJourneys = [
  upcomingJourney,
  past('LGA201987', '2025-05-18T18:10:00', false),
  past('LGA201342', '2025-04-02T07:45:00', true),
];
