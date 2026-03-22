import { useEffect, useState } from "react";

export const useGeolocation = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Location error:", err);
      }
    );
  }, []);

  return position;
};