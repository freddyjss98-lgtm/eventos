// frontend/app/organizer/my-events.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { api } from "../../src/api/client";
import { Event } from "../../src/types";

export default function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/events/me")
      .then((res) => setEvents(res.data as Event[]))
      .catch((err) => {
        if (__DEV__) console.error("GET MY EVENTS ERROR", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (eventId: string) => {
    try {
      if (__DEV__) console.log("🗑️ Intentando borrar:", eventId);

      const res = await api.delete(`/events/${eventId}`);

      if (res.status >= 200 && res.status < 300) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      } else {
        throw new Error("No se pudo eliminar el evento");
      }
    } catch (error: any) {
      if (__DEV__) console.error("❌ Error delete:", error?.response?.data || error);
      Alert.alert("Error", "No se pudo eliminar el evento");
    }
  };

  const confirmDelete = (eventId: string) => {
    // WEB
    if (Platform.OS === "web") {
      const ok = window.confirm("¿Estás seguro de eliminar este evento?");
      if (ok) {
        handleDelete(eventId);
      }
      return;
    }

    // ANDROID / IOS
    Alert.alert("Eliminar evento", "¿Estás seguro de eliminar este evento?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => handleDelete(eventId) },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      {/* VOLVER */}
      <Pressable
        onPress={() => router.replace("/organizer")}
        style={{
          marginBottom: 20,
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ textAlign: "center", fontWeight: "600" }}>⬅ Volver al panel</Text>
      </Pressable>

      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Mis eventos
      </Text>

      {loading && <Text>Cargando eventos...</Text>}

      {!loading && events.length === 0 && <Text>No tienes eventos creados aún.</Text>}

      {events.map((event) => (
        <View
          key={event.id}
          style={{
            borderWidth: 1,
            borderRadius: 10,
            padding: 16,
            marginBottom: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{event.title}</Text>

          <Text style={{ marginVertical: 6, color: "#555" }}>
            {new Date(event.date).toLocaleString()}
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
            <Pressable
              onPress={() => router.push(`/organizer/events/${event.id}`)}
              style={{ paddingVertical: 4 }}
            >
              <Text style={{ color: "#2563eb", fontWeight: "500", textDecorationLine: "underline" }}>
                ✏️ Editar evento
              </Text>
            </Pressable>

            <Pressable
              onPress={() => confirmDelete(event.id)}
              style={{ paddingVertical: 4 }}
              android_ripple={{ color: "#fee2e2" }}
            >
              <Text style={{ color: "#dc2626", fontWeight: "500", textDecorationLine: "underline" }}>
                🗑️ Eliminar evento
              </Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
