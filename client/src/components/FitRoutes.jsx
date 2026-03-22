import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FitRoutes({ routes }) {
  const map = useMap();

  useEffect(() => {
    if (!routes.length) return;

    const bounds = routes.flatMap(route => route.coordinates);
    map.fitBounds(bounds, { padding: [50, 50] });

  }, [routes, map]);

  return null;
}