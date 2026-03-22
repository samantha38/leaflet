import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import LocationMarker from "./LocationMarker";
import FitRoutes from "./FitRoutes";
import MapResizer from "./MapResizer";   // ✅ NEW

export default function MapView({
  position,
  routes,
  recommendedEmission
}) {
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
              route.emissionsKg === recommendedEmission
                ? "green"
                : "blue",
            weight: 5,
          }}
        />
      ))}
    </MapContainer>
  );
}