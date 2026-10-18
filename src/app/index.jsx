import { Redirect } from 'expo-router';
import { DEFAULT_JOURNEY_ID, ROUTES } from '@/constants/routes';

export default function Index() {
  return <Redirect href={ROUTES.journey(DEFAULT_JOURNEY_ID)} />;
}
