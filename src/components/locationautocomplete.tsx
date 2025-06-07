"use client";

import { useState, useEffect } from "react";
import axios from "axios";

type Suggestion = {
  name: string;
  city?: string;
  country?: string;
  coordinates: [number, number];
};

export default function LocationAutocomplete({
  onSelect,
}: {
  onSelect: (location: Suggestion) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) return;

      try {
        const res = await axios.get("https://photon.komoot.io/api/", {
          params: { q: query },
        });

        const results = res.data.features.map((feature: any) => ({
          name: feature.properties.name,
          city: feature.properties.city,
          country: feature.properties.country,
          coordinates: feature.geometry.coordinates,
        }));

        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (suggestion: Suggestion) => {
    setQuery(`${suggestion.name}, ${suggestion.city || ""}, ${suggestion.country || ""}`);
    setShowDropdown(false);
    onSelect(suggestion);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a location"
        className="w-full p-2 border rounded-md"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border mt-1 max-h-60 overflow-y-auto shadow-md rounded-md">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(s)}
            >
              {s.name}, {s.city || ""}, {s.country || ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
