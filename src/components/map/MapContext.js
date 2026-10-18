import { createContext, useContext } from 'react';

// Gives overlays (markers, polylines) the projection of the map that renders them.
// `project({ latitude, longitude })` returns screen coordinates in the map's own space.
export const MapContext = createContext(null);

export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('Map overlays must be rendered inside <TileMap>');
  return ctx;
}
