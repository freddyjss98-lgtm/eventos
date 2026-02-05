"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";

type Props = {
  onSelect: (lat: number, lng: number) => void;
};

function LocationMarker({ onSelect }: Props) {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function MapPicker({ onSelect }: Props) {
  return (
    <MapContainer
      center={[-3.99, -79.20]} // Ecuador por defecto
      zoom={13}
      style={{
        height: 300,
        width: "100%",
        borderRadius: 8,
        marginBottom: 16,
      }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker onSelect={onSelect} />
    </MapContainer>
  );
}
