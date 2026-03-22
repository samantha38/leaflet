import { Marker, useMap } from "react-leaflet";
import { useEffect } from "react";

export default function LocationMarker({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
}