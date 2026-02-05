import { View, Text, FlatList, Pressable, Image } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as Location from "expo-location";

import { getEvents, getNearbyEvents } from "../../src/api/events";

type EventItem = {
  id: string;
  title: string;
  description?: string;
  date: string;
  imagenUrl?: string | null;
  category?: string; // 👈 NUEVO
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

  // =======================
  // Obtener ubicación
  // =======================
  useEffect(() => {
    (async () => {
      try {
        if (typeof window === "undefined") return;

        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") return;

        const pos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      } catch {}
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
    <View style={{ flex: 1, padding: 16, backgroundColor: "#f5f5f5" }}>
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
              padding: 14,
              borderRadius: 10,
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
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/tabs/${item.id}`)}
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            }}
          >
            {/* 🖼️ IMAGEN */}
            {item.imagenUrl && (
              <Image
                source={{ uri: item.imagenUrl }}
                style={{
                  width: "100%",
                  aspectRatio: 1 / 1.2,
                  maxHeight: 150,
                  backgroundColor: "transparent",
                }}
                resizeMode="contain"
              />
            )}

            {/* 🏷️ CATEGORÍA */}
            {item.category && (
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "#eef2ff",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  margin: 8,
                  marginBottom: 0,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: "#3730a3",
                    fontWeight: "600",
                  }}
                >
                  {item.category}
                </Text>
              </View>
            )}

            {/* 📄 CONTENIDO */}
            <View style={{ padding: 10 }}>
              <Text
                numberOfLines={2}
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  marginBottom: 4,
                }}
              >
                {item.title}
              </Text>

              <Text style={{ fontSize: 12, color: "#666" }}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
