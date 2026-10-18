import { useEffect, useState } from 'react';
import { getJourney } from '../services/journeyService';
import { getRoute } from '../services/routeService';

export default function useJourney(id) {
  const [journey, setJourney] = useState(null);
  const [route, setRoute] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    Promise.all([getJourney(id), getRoute(id)])
      .then(([journeyData, routeData]) => {
        if (!active) return;
        setJourney(journeyData);
        setRoute(routeData);
      })
      .catch((e) => active && setError(e));
    return () => {
      active = false;
    };
  }, [id]);

  return { journey, route, loading: !journey && !error, error };
}
