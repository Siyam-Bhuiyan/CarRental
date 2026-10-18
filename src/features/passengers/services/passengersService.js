import passengersMock from '@/mocks/passengers.json';
import { delay } from '@/utils/delay';

export async function getPassengers() {
  return passengersMock;
}

export async function setPassengerFavorite(id, favorite) {
  await delay(120);
  return { id, favorite };
}
