import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import polyline from "polyline";

// Fix marker icons (important for Vite)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationMarker({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);

  return position ? <Marker position={position} /> : null;
}

function FitRoutes({ routes }) {
  const map = useMap();

  useEffect(() => {
    if (!routes.length) return;

    const allCoords = routes.flatMap((route) => route.coordinates);

    const bounds = L.latLngBounds(allCoords);

    map.fitBounds(bounds, { padding: [50, 50] });

  }, [routes, map]);

  return null;
}

function App() {
  const [position, setPosition] = useState(null);
  const [destination, setDestination] = useState("");
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [recommendedEmission, setRecommendedEmission] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // ✅ Enable geolocation
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

  // ✅ Fetch autocomplete suggestions
  const fetchSuggestions = async (text) => {
    if (!text) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/autocomplete?text=${text}`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  };

  // ✅ Backend call
  const findRoutes = async () => {


  if (!position || !destinationCoords) {
    alert("Location or destination missing");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/find-route",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceLat: position[0],
          sourceLng: position[1],
          destLat: destinationCoords[1],
          destLng: destinationCoords[0],
        }),
      }
    );

    const data = await response.json();

    const decodedRoutes = data.routes.map((route) => ({
      ...route,
      coordinates: polyline.decode(route.geometry),
    }));

    setRoutes(decodedRoutes);
    setRecommendedEmission(data.recommended.emissionsKg);

  } catch (error) {
    console.error("Route fetch error:", error);
  }
};

  return (
    <div className="map-wrapper">
      <div className="controls">
        <div className="autocomplete-container">
        <input
          id="destination"
          name="destination"
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => {
            const value = e.target.value;
            setDestination(value);
            fetchSuggestions(value);
          }}
        />

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => {
                  setDestination(s.label);
                  setDestinationCoords(s.coordinates); // store coordinates
                  setSuggestions([]);
                }}
              >
                {s.label}
              </li>
            ))}
          </ul>
        )}
        </div>
        <button onClick={findRoutes}>Find Routes</button>
      </div>

      <MapContainer
        center={[0, 0]}
        zoom={2}
        className="map-container"
      >

        <FitRoutes routes={routes} />
        
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker position={position} />

        {/* Draw routes */}
        {routes.map((route, index) => (
          <Polyline
            key={index}
            positions={route.coordinates}
            pathOptions={{
              color:
                route.emissionsKg === recommendedEmission
                  ? "green"
                  : "blue",
              weight: 5,
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}

export default App;