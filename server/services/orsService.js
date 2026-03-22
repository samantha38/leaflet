exports.getSuggestions = async (text) => {

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${text}&limit=5`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "bus-route-app",
    },
  });

  const data = await response.json();

  return data.map((place) => ({
    label: place.display_name,
    coordinates: [
      parseFloat(place.lon),
      parseFloat(place.lat)
    ],
  }));
};