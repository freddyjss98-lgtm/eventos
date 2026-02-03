import { View, Text, FlatList, Pressable, Button } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as Location from "expo-location";
import { getEvents } from "../src/api/events";
import { logout } from "../app/auth/auth";

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para ubicación del usuario (expo-location)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  // Solicitar permisos y obtener ubicación actual al montar
  useEffect(() => {
    (async () => {
      try {
        // Protección para entornos sin window (SSR / build)
        if (typeof window === "undefined") return;

        const { status } = await Location.requestForegroundPermissionsAsync();
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
      } catch (err: any) {
        setLocationError(err?.message || "Error obteniendo la ubicación");
      }
    })();
  }, []);

  const handleLogout = () => {
    // Eliminar token y redirigir al login (MVP)
    logout();
    router.replace("/auth/login");
  };

  if (loading) {
    return <Text style={{ padding: 16 }}>Cargando eventos...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f5", padding: 16 }}>
      {/* Header: título + logout */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "700" }}>Eventos disponibles</Text>

        <Button title="Cerrar sesión" onPress={handleLogout} />
      </View>

      {/* (Opcional) Mostrar estado de ubicación si quieres hacer debug */}
      {userLocation ? (
        <Text style={{ color: "#333", marginBottom: 8 }}>
          Ubicación: {userLocation.latitude.toFixed(5)}, {userLocation.longitude.toFixed(5)}
        </Text>
      ) : locationError ? (
        <Text style={{ color: "red", marginBottom: 8 }}>{locationError}</Text>
      ) : null}

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/tabs/${item.id}`)}
            style={{
              backgroundColor: "#fff",
              padding: 16,
              borderRadius: 12,
              marginBottom: 12,
              // Shadow (iOS)
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              // Elevation (Android)
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 6 }}>
              {item.title}
            </Text>

            <Text style={{ color: "#666", marginBottom: 8 }}>
              {new Date(item.date).toLocaleDateString()}{" "}
              {new Date(item.date).toLocaleTimeString()}
            </Text>

            {item.description ? (
              <Text style={{ color: "#444", lineHeight: 20 }}>
                {item.description}
              </Text>
            ) : null}
          </Pressable>
        )}
      />
    </View>
  );
}