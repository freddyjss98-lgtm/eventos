import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import { api } from "../../../src/api/client";

export default function OrganizerEventDetail() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    api
      .get(`/events/${id}`)
      .then((res) => setEvent(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Text style={{ padding: 20 }}>Cargando evento...</Text>;
  }

  if (!event) {
    return <Text style={{ padding: 20 }}>Evento no encontrado</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {event.title}
      </Text>

      <Text style={{ marginVertical: 8 }}>
        📅 {new Date(event.date).toLocaleString()}
      </Text>

      <Text style={{ marginTop: 12 }}>
        {event.description}
      </Text>

      {event.latitude && event.longitude && (
        <Text style={{ marginTop: 12, color: "#555" }}>
          📍 {event.latitude}, {event.longitude}
        </Text>
      )}

      {/* BOTÓN EDITAR */}
      <Pressable
        onPress={() => router.push(`/organizer/events/${id}/edit`)}
        style={{
          marginTop: 20,
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ textAlign: "center", fontWeight: "600" }}>
          ✏️ Editar evento
        </Text>
      </Pressable>

      {/* BOTÓN VOLVER */}
      <Pressable
        onPress={() => router.back()}
        style={{
          marginTop: 10,
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          backgroundColor: "#fff",
        }}
      >
        <Text style={{ textAlign: "center" }}>
          ⬅ Volver
        </Text>
      </Pressable>
    </View>
  );
}
