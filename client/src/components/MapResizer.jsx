import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function MapResizer() {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  return null;
}