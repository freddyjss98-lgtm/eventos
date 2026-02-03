import { View, Text, TextInput, Button } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import * as Location from "expo-location";
import { api } from "../../src/api/client";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateInput, setDateInput] = useState(""); // DD/MM/YYYY

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📍 Ubicación automática (la dejamos, pero no complica)
  useEffect(() => {
    (async () => {
      try {
        if (typeof window === "undefined") return;

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const pos = await Location.getCurrentPositionAsync({});
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
      } catch {}
    })();
  }, []);

  // 🧠 Parsear fecha DD/MM/YYYY → Date
  const parseDate = (value: string): Date | null => {
    const parts = value.split("/");
    if (parts.length !== 3) return null;

    const [day, month, year] = parts.map(Number);

    if (
      !day ||
      !month ||
      !year ||
      day < 1 ||
      day > 31 ||
      month < 1 ||
      month > 12 ||
      year < 2024
    ) {
      return null;
    }

    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  };

  const handleCreateEvent = async () => {
    setError(null);

    if (!title.trim() || !description.trim()) {
      setError("Título y descripción son obligatorios");
      return;
    }

    const parsedDate = parseDate(dateInput);
    if (!parsedDate) {
      setError("Fecha inválida. Usa el formato DD/MM/YYYY");
      return;
    }

    if (latitude == null || longitude == null) {
      setError("No se pudo obtener la ubicación");
      return;
    }

    setLoading(true);

    try {
      await api.post("/events", {
        title,
        description,
        date: parsedDate.toISOString(), // ✅ backend feliz
        latitude,
        longitude,
      });

      router.replace("/organizer");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Error creando el evento"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        Crear evento
      </Text>

      <TextInput
        placeholder="Título del evento"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      {/* 📅 FECHA SIMPLE */}
      <TextInput
        placeholder="Fecha (DD/MM/YYYY)"
        value={dateInput}
        onChangeText={setDateInput}
        style={{ borderWidth: 1, padding: 12, marginBottom: 6 }}
      />

      <Text style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
        Ejemplo: 23/04/2026
      </Text>

      {latitude && longitude && (
        <Text style={{ color: "green", marginBottom: 12 }}>
          📍 Ubicación detectada automáticamente
        </Text>
      )}

      {error && (
        <Text style={{ color: "red", marginBottom: 12 }}>
          {error}
        </Text>
      )}

      <Button
        title={loading ? "Publicando..." : "PUBLICAR EVENTO"}
        onPress={handleCreateEvent}
        disabled={loading}
      />
    </View>
  );
}
