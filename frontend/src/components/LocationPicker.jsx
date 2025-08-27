import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

export default function LocationPicker({ value, onChange, handleLocationChange, formData, handleEventChange }) {
  const defaultCenter = { lat: 14.5995, lng: 120.9842 }; // Manila default

  const safeValue =
    value && value.lat != null && value.lng != null
      ? value
      : defaultCenter;

  const [markerPos, setMarkerPos] = useState(safeValue);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Sync input when parent `value` changes
useEffect(() => {
  if (value?.address) {
    setSearchTerm(value.address);   // 👈 show full address
  } else if (value?.name) {
    setSearchTerm(value.name);      // fallback
  }
}, [value]);


  // Autocomplete search (fetch suggestions as user types)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchTerm
        )}&addressdetails=1&limit=5`
      )
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch(() => setSuggestions([]));
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSelect = (loc) => {
  const lat = parseFloat(loc.lat);
  const lng = parseFloat(loc.lon);

  // Update marker position
  setMarkerPos({ lat, lng });

  // Update parent component
  onChange?.({ name: loc.display_name, lat, lng });

  handleLocationChange({
    place_id: loc.place_id,
    name: loc.display_name.split(",")[0],
    address: loc.display_name,
  });

  setSearchTerm(loc.display_name);
  setSuggestions([]);
};


  // Click map to move marker
  function MapClickHandler() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPos({ lat, lng });
        onChange?.({
          name: "",
          lat,
          lng,
        });
      },
    });
    return null;
  }

  return (
    <div className="flex flex-col"> {/* Fixed height */}
  {/* Search box */}
  <p className="block text-sm font-medium text-gray-700 mb-2">Location of the Event/Address</p>

  <input 
    type="text" 
    placeholder="Floor/Unit No./Building Name"
    value={formData.venue_specific} 
    name="venue_specific" 
    onChange={handleEventChange}
    className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none mb-3"
  />
  <div className="relative mb-2">
    <input
      type="text"
      placeholder="Search venue"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
    {suggestions.length > 0 && (
      <ul className="absolute left-0 z-1000 w-full bg-white border border-gray-200 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
        {suggestions.map((loc, idx) => (
          <li
            key={idx}
            onClick={() => handleSelect(loc)}
            className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm transition-colors duration-150"
          >
            {loc.display_name}
          </li>
        ))}
      </ul>
    )}
  </div>

  {/* Map */}
  <div className="z-10 rounded-lg overflow-hidden shadow-inner h-64 md:h-75 lg:md:h-100">
    <MapContainer
      center={markerPos}
      zoom={14}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={markerPos}>
        <Popup>{value?.address || searchTerm || `Lat: ${markerPos.lat}, Lng: ${markerPos.lng}`}</Popup>
      </Marker>
      <MapClickHandler />
    </MapContainer>
  </div>
</div>

  );
}