const axios = require("axios");
const { calculateEmissions } = require("../utils/emissionCalculator");

async function getRoute(sourceLat, sourceLng, destLat, destLng) {
  try {
    const directionsResponse = await axios.post(
  "https://api.openrouteservice.org/v2/directions/driving-car",
  {
    coordinates: [
      [sourceLng, sourceLat],
      [destLng, destLat],
    ],

    alternative_routes: {
      target_count: 3,   // 🔥 number of routes you want
      share_factor: 0.6,
      weight_factor: 1.4
    },
  },
  {
    headers: {
      Authorization: process.env.ORS_API_KEY,
      "Content-Type": "application/json",
    },
  }
);

    const routes = directionsResponse.data.routes || [];

    const processedRoutes = routes.map((route) => {
      const distanceKm = route.summary.distance / 1000;
      const emissions = calculateEmissions(distanceKm);

      return {
        geometry: route.geometry,
        distanceKm,
        durationMin: route.summary.duration / 60,
        emissionsKg: emissions,
      };
    });

    const ecoRoute = processedRoutes.reduce((prev, curr) =>
      curr.emissionsKg < prev.emissionsKg ? curr : prev
    );

    return {
      routes: processedRoutes,
      recommended: ecoRoute,
    };

  } catch (error) {
    console.error("ORS error:", error.message);
    return { routes: [], recommended: null }; // ✅ prevents crash
  }
}

module.exports = {
  getRoute   // 🔴 THIS IS CRITICAL
};