import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import FitRoutes from "./FitRoutes";
import MapResizer from "./MapResizer";

export default function MapView({
  position,
  routes,
  sourceCoords,
  destinationCoords,
  recommendedEmission,
  selectedRouteIndex,
  setSelectedRouteIndex
}) {
  return (
    <MapContainer
      center={position}
      zoom={13}
      className="map-container"
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapResizer />

      {/* Current Location */}
      <LocationMarker position={position} />

      {/* Source Marker */}
      {sourceCoords && (
        <Marker position={sourceCoords}>
          <Popup>Source</Popup>
        </Marker>
      )}

      {/* Destination Marker */}
      {destinationCoords && (
        <Marker position={destinationCoords}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      <FitRoutes routes={routes} />

      {routes.map((route, index) => (
        <Polyline
          key={index}
          positions={route.coordinates}
          pathOptions={{
            color: index === selectedRouteIndex ? "green" : "blue",
            weight: index === selectedRouteIndex ? 6 : 4,
            opacity: 0.7,
          }}
          eventHandlers={{
            click: () => setSelectedRouteIndex(index),
          }}
        >
          <Popup>
            <strong>Route {index + 1}</strong><br />
            Distance: {route.distanceKm.toFixed(2)} km<br />
            Time: {route.durationMin.toFixed(1)} min<br />
            Emissions: {route.emissionsKg.toFixed(2)} kg
          </Popup>
        </Polyline>
      ))}
    </MapContainer>
  );
}