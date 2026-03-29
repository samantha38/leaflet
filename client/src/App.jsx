import { useState } from "react";
import "./App.css";

import { useGeolocation } from "./hooks/useGeolocation";
import { fetchRoutes } from "./services/api";
import { decodeRoutes } from "./utils/decodePolyline";
import { fixLeafletIcons } from "./styles/mapFix";

import MapView from "./components/MapView";
import AutocompleteInput from "./components/AutocompleteInput";

fixLeafletIcons();

function App() {

  const position = useGeolocation();

  const [destination, setDestination] = useState("");
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [recommendedEmission, setRecommendedEmission] = useState(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);

  const findRoutes = async () => {

    if (!position || !destinationCoords) {
      alert("Location or destination missing");
      return;
    }

    try {

      const data = await fetchRoutes({
        sourceLat: position[0],
        sourceLng: position[1],
        destLat: destinationCoords[1],
        destLng: destinationCoords[0],
      });

      const decodedRoutes = decodeRoutes(data.routes);

      setRoutes(decodedRoutes);
      setRecommendedEmission(data.recommended.emissionsKg);

    } catch (error) {
      console.error("Route fetch error:", error);
    }
  };

  return (
    <div className="map-wrapper">

      <div className="controls">

        <AutocompleteInput
          destination={destination}
          setDestination={setDestination}
          setDestinationCoords={setDestinationCoords}
        />

        <button onClick={findRoutes}>
          Find Routes
        </button>

      </div>
        <div className="route-info">
  {routes.map((route, index) => (
    <div
      key={index}
      className={`route-card ${
        index === selectedRouteIndex ? "active" : ""
      }`}
      onClick={() => setSelectedRouteIndex(index)}
    >
      <strong>Route {index + 1}</strong>
      <p>Distance: {route.distanceKm.toFixed(2)} km</p>
      <p>Time: {route.durationMin.toFixed(1)} min</p>
      <p>Emissions: {route.emissionsKg.toFixed(2)} kg</p>
    </div>
  ))}
</div>
      {position && (
      <MapView
  position={position}
  routes={routes}
  recommendedEmission={recommendedEmission}
  selectedRouteIndex={selectedRouteIndex}
  setSelectedRouteIndex={setSelectedRouteIndex}
/>
)}

    </div>
  );
}

export default App;