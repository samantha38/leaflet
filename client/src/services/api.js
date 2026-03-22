export const fetchSuggestions = async (text) => {
  const res = await fetch(
    `http://localhost:5000/api/autocomplete?text=${text}`
  );

  return res.json();
};

export const fetchRoutes = async (payload) => {
  const response = await fetch(
    "http://localhost:5000/api/find-route",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return response.json();
};