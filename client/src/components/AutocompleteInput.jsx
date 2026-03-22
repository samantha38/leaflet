import { useState } from "react";
import { fetchSuggestions } from "../services/api";
import { useRef } from "react";

export default function AutocompleteInput({
  destination,
  setDestination,
  setDestinationCoords
}) {
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  const handleChange = (value) => {
  setDestination(value);

  if (!value) {
    setSuggestions([]);
    return;
  }

  // clear previous timer
  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  // set new timer
  debounceRef.current = setTimeout(async () => {
    try {
      if (value.length >= 3) {
        const data = await fetchSuggestions(value);
        setSuggestions(data);
      }
    } catch (err) {
      console.error("Autocomplete error:", err);
    }
  }, 400); // 400ms delay
};

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        placeholder="Enter destination"
        value={destination}
        onChange={(e) => handleChange(e.target.value)}
      />

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => {
                setDestination(s.label);
                setDestinationCoords(s.coordinates);
                setSuggestions([]);
              }}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}