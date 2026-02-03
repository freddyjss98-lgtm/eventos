import { View, Text, FlatList, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as Location from "expo-location";

import { getEvents, getNearbyEvents } from "../../src/api/events";

type EventItem = {
  id: string;
  title: string;
  description?: string;
  date: string;
};

type NearbyEvent = EventItem & {
  distance?: number;
};

export default function EventsScreen() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<NearbyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [locationError, setLocationError] = useState<string | null>(null);

  // =======================
  // Obtener ubicación
  // =======================
  useEffect(() => {
    (async () => {
      try {
        if (typeof window === "undefined") return;

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocationError("Permiso de ubicación denegado");
          return;
        }

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      } catch {
        setLocationError("Error obteniendo ubicación");
      }
    })();
  }, []);

  // =======================
  // Cargar eventos
  // =======================
  useEffect(() => {
    getEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  // =======================
  // Cargar eventos cercanos
  // =======================
  useEffect(() => {
    if (!userLocation) return;

    getNearbyEvents(
      userLocation.latitude,
      userLocation.longitude,
      10
    ).then(setNearbyEvents);
  }, [userLocation]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando eventos...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {/* ===================== */}
      {/* UBICACIÓN */}
      {/* ===================== */}
      {userLocation && (
        <Text style={{ marginBottom: 12, color: "#555" }}>
          Ubicación: {userLocation.latitude.toFixed(5)},{" "}
          {userLocation.longitude.toFixed(5)}
        </Text>
      )}

      {locationError && (
        <Text style={{ color: "red", marginBottom: 12 }}>
          {locationError}
        </Text>
      )}

      {/* ===================== */}
      {/* EVENTOS CERCA DE TI */}
      {/* ===================== */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}>
        Eventos cerca de ti
      </Text>

      {nearbyEvents.length === 0 ? (
        <Text style={{ color: "#666", marginBottom: 16 }}>
          No hay eventos cercanos
        </Text>
      ) : (
        nearbyEvents.map((event) => (
          <Pressable
            key={event.id}
            onPress={() => router.push(`/tabs/${event.id}`)}
            style={{
              padding: 16,
              borderWidth: 1,
              borderRadius: 8,
              marginBottom: 12,
              backgroundColor: "#fff",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {event.title}
            </Text>

            <Text style={{ color: "#555", marginTop: 4 }}>
              📍{" "}
              {typeof event.distance === "number"
                ? `${event.distance.toFixed(2)} km`
                : "Distancia no disponible"}
            </Text>
          </Pressable>
        ))
      )}

      {/* ===================== */}
      {/* LISTADO GENERAL */}
      {/* ===================== */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        Eventos disponibles
      </Text>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/tabs/${item.id}`)}
            style={{
              padding: 16,
              borderWidth: 1,
              borderRadius: 8,
              marginBottom: 12,
              backgroundColor: "#fff",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600" }}>
              {item.title}
            </Text>

            <Text style={{ color: "#555", marginTop: 4 }}>
              {new Date(item.date).toLocaleString()}
            </Text>

            {item.description && (
              <Text style={{ marginTop: 8, color: "#666" }}>
                {item.description}
              </Text>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}
