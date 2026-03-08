const express = require("express");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5000;

/* ---------- AUTOCOMPLETE ---------- */

app.get("/api/autocomplete", async (req, res) => {
  const text = req.query.text;

  if (!text) {
    return res.json([]);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${text}&limit=5`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "bus-route-app",
      },
    });

    const data = await response.json();

    const suggestions = data.map((place) => ({
      label: place.display_name,
      coordinates: [parseFloat(place.lon), parseFloat(place.lat)],
    }));

    res.json(suggestions);

  } catch (err) {
    console.error("Autocomplete error:", err);
    res.status(500).json({ error: "Autocomplete failed" });
  }
});

/* ---------- FIND ROUTE ---------- */

app.post("/api/find-route", async (req, res) => {
  try {
    const { sourceLat, sourceLng, destLat, destLng } = req.body;


    console.log("SOURCE:", sourceLat, sourceLng);
    console.log("DEST:", destLat, destLng); 

    
    if (!sourceLat || !sourceLng || !destLat || !destLng) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    const directionsResponse = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        coordinates: [
          [sourceLng, sourceLat],
          [destLng, destLat],
        ],
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const routes = directionsResponse.data.routes;

    const emissionFactor = 0.21;

    const processedRoutes = routes.map((route) => {
      const distanceKm = route.summary.distance / 1000;
      const emissions = distanceKm * emissionFactor;

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

    res.json({
      routes: processedRoutes,
      recommended: ecoRoute,
    });

  } catch (error) {
    if (error.response) {
      console.error("ORS ERROR:", error.response.data);
    } else {
      console.error(error.message);
    }

    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});