import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPassengers, setPassengerFavorite } from '../services/passengersService';

export const TABS = { active: 'active', archived: 'archived' };

export default function usePassengers() {
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(TABS.active);

  useEffect(() => {
    let active = true;
    getPassengers().then((data) => {
      if (!active) return;
      setPassengers(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(
    () => passengers.filter((p) => p.archived === (tab === TABS.archived)),
    [passengers, tab],
  );

  // Optimistic toggle; the service call is fire-and-forget in the mock.
  const toggleFavorite = useCallback(
    (id) => {
      const current = passengers.find((p) => p.id === id);
      if (!current) return;
      setPassengers((list) =>
        list.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)),
      );
      setPassengerFavorite(id, !current.favorite);
    },
    [passengers],
  );

  return { passengers: visible, loading, tab, setTab, toggleFavorite };
}
