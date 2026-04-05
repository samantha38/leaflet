import { useState, useRef } from "react";
import { fetchSuggestions } from "../services/api";

export default function AutocompleteInput({
  value,
  setValue,
  setCoords,
  placeholder
}) {
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  const handleChange = (val) => {
    setValue(val);

    if (!val) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        if (val.length >= 3) {
          const data = await fetchSuggestions(val);
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    }, 400);
  };

  return (
    <div className="autocomplete-container">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      />

      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => {
                setValue(s.label);

                // ✅ FIX: convert [lng, lat] → [lat, lng]
                setCoords([s.coordinates[1], s.coordinates[0]]);

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