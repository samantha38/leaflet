const autocompleteService = require("../services/autocompleteService");
const orsService = require("../services/orsService");

exports.autocomplete = async (req, res) => {
  try {
    const text = req.query.text;

    if (!text) {
      return res.json([]);
    }

    const suggestions = await autocompleteService.getSuggestions(text);
    res.json(suggestions);

  } catch (err) {
    console.error("Autocomplete error:", err);
    res.status(500).json({ error: "Autocomplete failed" });
  }
};

exports.findRoute = async (req, res) => {
  try {
    const { sourceLat, sourceLng, destLat, destLng } = req.body;

    if (!sourceLat || !sourceLng || !destLat || !destLng) {
      return res.status(400).json({ error: "Missing coordinates" });
    }

    const routeData = await orsService.getRoute(
      sourceLat,
      sourceLng,
      destLat,
      destLng
    );

    res.json(routeData);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};