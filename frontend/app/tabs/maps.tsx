"use client";

import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { router } from "expo-router";
import { getNearbyEvents } from "../../src/api/events";

/* 🔧 FIX icons Leaflet */
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 📍 Icono del usuario
const userIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🎉 Icono de eventos
const eventIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});




type Event = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
};

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (typeof window === "undefined") return;

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setError("Permiso de ubicación denegado");
          return;
        }

        const pos = await Location.getCurrentPositionAsync({});
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setUserLocation({ latitude: lat, longitude: lng });

        const nearby = await getNearbyEvents(lat, lng, 10);
        setEvents(nearby);
      } catch {
        setError("No se pudo obtener la ubicación");
      }
    })();
  }, []);

  if (error) {
    return (
      <View style={{ padding: 24 }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  if (!userLocation) {
    return (
      <View style={{ padding: 24 }}>
        <Text>Cargando mapa…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 👤 Usuario */}
        <Marker
  position={[userLocation.latitude, userLocation.longitude]}
  icon={userIcon}
>
  <Popup>Estás aquí</Popup>
</Marker>


        {/* 🎉 Eventos */}
        {events.map((event) => (
  <Marker
    key={event.id}
    position={[event.latitude, event.longitude]}
    icon={eventIcon}
  >
    <Popup>
      <Text style={{ fontWeight: "bold" }}>{event.title}</Text>

      {event.distanceKm !== undefined && (
        <Text>{event.distanceKm.toFixed(2)} km</Text>
      )}

      <Text
        style={{ color: "blue", marginTop: 8 }}
        onPress={() => router.push(`/tabs/${event.id}`)}
      >
        Ver evento
      </Text>
    </Popup>
  </Marker>
))}

      </MapContainer>
    </View>
  );
}
