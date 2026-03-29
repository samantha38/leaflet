import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import FitRoutes from "./FitRoutes";
import MapResizer from "./MapResizer";   // ✅ NEW
import { Popup } from "react-leaflet";

export default function MapView({
  position,
  routes,
  recommendedEmission,
  selectedRouteIndex,
  setSelectedRouteIndex
}){
  return (
    <MapContainer
      center={position}   // ✅ FIXED
      zoom={13}
      className="map-container"
      style={{ height: "100vh", width: "100%" }}
    >

      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapResizer /> {/* ✅ CRITICAL FIX */}

      <LocationMarker position={position} />

      <FitRoutes routes={routes} />

      {routes.map((route, index) => (
  <Polyline
    key={index}
    positions={route.coordinates}
    pathOptions={{
      color:
        index === selectedRouteIndex
          ? "green"
          : "blue",
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