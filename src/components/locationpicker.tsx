"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

type Props = {
  lat: number;
  lng: number;
  label?: string;
};

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  map.setView([lat, lng], 13);
  return null;
}
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
export default function LocationMap({ lat, lng, label = "Event location" }: Props) {
  return (
<MapContainer
  center={[lat, lng]}
  zoom={13}
  scrollWheelZoom={true}
  dragging={false}
  zoomControl={true}
  style={{ height: "160px", width: "100%" }}
  className="rounded-lg overflow-hidden z-0"
>

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={customIcon}>
        <Popup>
          {label} <br /> This is your selected spot.
        </Popup>
      </Marker>
      <FlyTo lat={lat} lng={lng} />
    </MapContainer>
  );
}