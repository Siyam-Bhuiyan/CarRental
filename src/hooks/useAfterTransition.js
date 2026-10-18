import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from 'expo-router';

// Returns false while the screen is still sliding in, true once the navigation transition
// has finished. Screens render a light skeleton until then and mount their heavy content
// (map tiles, long lists, entrance animations) afterwards, so the slide itself stays smooth.
// A timeout covers cases where the event never fires (first screen, web).
export default function useAfterTransition(fallbackMs = 500) {
  const navigation = useNavigation();
  const [ready, setReady] = useState(Platform.OS === 'web');

  useEffect(() => {
    if (ready) return undefined;
    const finish = () => setReady(true);
    const unsubscribe = navigation.addListener('transitionEnd', finish);
    const timer = setTimeout(finish, fallbackMs);
    return () => {
      unsubscribe?.();
      clearTimeout(timer);
    };
  }, [navigation, ready, fallbackMs]);

  return ready;
}
