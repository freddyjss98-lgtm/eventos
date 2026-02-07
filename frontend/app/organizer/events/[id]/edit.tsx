// frontend/app/organizer/events/[id]/edit.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { api } from "../../../../src/api/client";
import { Event } from "../../../../src/types";

export default function EditEvent() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del evento
  useEffect(() => {
    if (!id) return;

    api
      .get(`/events/${id}`)
      .then((res) => {
        const event = res.data as Event;
        setTitle(event.title);
        setDescription(event.description ?? "");
        setDate(event.date.split("T")[0]); // YYYY-MM-DD
      })
      .catch((err) => {
        if (__DEV__) console.error("GET EVENT FOR EDIT ERROR", err);
      });
  }, [id]);

  const handleUpdate = async () => {
    setError(null);

    if (!title || !description || !date) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setLoading(true);

    try {
      await api.patch(`/events/${id}`, {
        title,
        description,
        date,
      });

      router.replace("/organizer/my-events");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error actualizando evento");
      if (__DEV__) console.error("UPDATE EVENT ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 16 }}>Editar evento</Text>

      <TextInput
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 12,
          minHeight: 80,
        }}
      />

      <TextInput
        placeholder="Fecha (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      {error && <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>}

      <Button title={loading ? "Guardando..." : "Guardar cambios"} onPress={handleUpdate} disabled={loading} />
    </View>
  );
}
