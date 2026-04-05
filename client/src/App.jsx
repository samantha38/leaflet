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

  const [source, setSource] = useState("");
  const [sourceCoords, setSourceCoords] = useState(null);

  const [destination, setDestination] = useState("");
  const [destinationCoords, setDestinationCoords] = useState(null);

  const [routes, setRoutes] = useState([]);
  const [recommendedEmission, setRecommendedEmission] = useState(null);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);

  // ✅ Use current location
  const useCurrentLocationAsSource = () => {
    if (!position) return;
    setSource("Current Location");
    setSourceCoords(position);
  };

  const useCurrentLocationAsDestination = () => {
    if (!position) return;
    setDestination("Current Location");
    setDestinationCoords(position);
  };

  const findRoutes = async () => {
    if (!sourceCoords || !destinationCoords) {
      alert("Source or destination missing");
      return;
    }

    try {
      const data = await fetchRoutes({
        sourceLat: sourceCoords[0],
        sourceLng: sourceCoords[1],
        destLat: destinationCoords[0],
        destLng: destinationCoords[1],
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
        {/* SOURCE */}
        <div className="input-group">
          <AutocompleteInput
            value={source}
            setValue={setSource}
            setCoords={setSourceCoords}
            placeholder="Enter source"
          />
          <button onClick={useCurrentLocationAsSource}>
            Use Current Location
          </button>
        </div>

        {/* DESTINATION */}
        <div className="input-group">
          <AutocompleteInput
            value={destination}
            setValue={setDestination}
            setCoords={setDestinationCoords}
            placeholder="Enter destination"
          />
          <button onClick={useCurrentLocationAsDestination}>
            Use Current Location
          </button>
        </div>

        <button onClick={findRoutes}>Find Routes</button>
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
          sourceCoords={sourceCoords}
          destinationCoords={destinationCoords}
          recommendedEmission={recommendedEmission}
          selectedRouteIndex={selectedRouteIndex}
          setSelectedRouteIndex={setSelectedRouteIndex}
        />
      )}
    </div>
  );
}

export default App;