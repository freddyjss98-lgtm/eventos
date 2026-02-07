// frontend/app/organizer/create-event.tsx
import React, { useEffect, useState } from "react";
import { Text, TextInput, Pressable, ScrollView, Image, View } from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { api } from "../../src/api/client";
import MapPicker from "../components/MapPicker";
import { uploadEventImage } from "../../src/lib/uploadEventImage";

export default function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(""); // DD/MM/YYYY

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  // imagen LOCAL (solo preview)
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;

        const pos = await Location.getCurrentPositionAsync({});
        setLatitude(String(pos.coords.latitude));
        setLongitude(String(pos.coords.longitude));
      } catch {
        // silencioso
      }
    })();
  }, []);

  const EVENT_CATEGORIES = [
    "Concierto",
    "Fiesta",
    "Teatro",
    "Festival",
    "Deportivo",
    "Otro",
  ];

  const [category, setCategory] = useState<string>("");

  // Parse fecha DD/MM/YYYY → ISO
  const parseDate = (value: string): string | null => {
    const parts = value.split("/");
    if (parts.length !== 3) return null;

    const [dd, mm, yyyy] = parts.map(Number);
    if (!dd || !mm || !yyyy) return null;

    const iso = new Date(yyyy, mm - 1, dd);
    if (isNaN(iso.getTime())) return null;

    return iso.toISOString();
  };

  // Seleccionar imagen (LOCAL)
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  }

  // Crear evento
  const handleCreate = async () => {
    setError(null);

    if (!title || !description || !date) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (!category) {
      setError("Debes seleccionar una categoría");
      return;
    }

    const isoDate = parseDate(date);
    if (!isoDate) {
      setError("Fecha inválida. Usa DD/MM/YYYY");
      return;
    }

    if (!latitude || !longitude) {
      setError("Debes seleccionar la ubicación del evento");
      return;
    }

    setLoading(true);

    try {
      let imagenUrl: string | null = null;

      // subir imagen solo si existe (usa helper centralizado)
      if (imageUri) {
        // No tenemos eventId aún, subimos con timestamp
        imagenUrl = await uploadEventImage(imageUri);
      }

      if (__DEV__) console.log("📸 Imagen final:", imagenUrl);

      await api.post("/events", {
        title,
        description,
        date: isoDate,
        category,
        latitude: Number(latitude),
        longitude: Number(longitude),
        imagenUrl, // ✅ nombre correcto y consistente (imagenUrl)
      });

      router.replace("/organizer/my-events");
    } catch (err: any) {
      if (__DEV__) console.error("CREATE EVENT ERROR", err);
      setError(err?.message || "Error creando el evento");
    } finally {
      setLoading(false);
    }
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
        <Text style={{ textAlign: "center", fontWeight: "600" }}>
          ⬅ Volver al panel
        </Text>
      </Pressable>

      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
        Crear evento
      </Text>

      {/* Título */}
      <TextInput
        placeholder="Título del evento"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <Text style={{ fontWeight: "600", marginBottom: 6 }}>
        Categoría del evento
      </Text>

      <View style={{ marginBottom: 12 }}>
        {EVENT_CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={{
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: category === cat ? "#2563eb" : "#ddd",
              backgroundColor: category === cat ? "#eff6ff" : "#fff",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                color: category === cat ? "#2563eb" : "#333",
                fontWeight: category === cat ? "600" : "400",
              }}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Descripción */}
      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        multiline
        style={{
          borderWidth: 1,
          padding: 12,
          marginBottom: 12,
          height: 80,
        }}
      />

      {/* Fecha */}
      <TextInput
        placeholder="Fecha (DD/MM/YYYY)"
        value={date}
        onChangeText={setDate}
        style={{ borderWidth: 1, padding: 12, marginBottom: 6 }}
      />
      <Text style={{ color: "#666", marginBottom: 12 }}>Ejemplo: 23/04/2026</Text>

      {/* Imagen */}
      <Pressable
        onPress={pickImage}
        style={{
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          marginBottom: 12,
          backgroundColor: "#f9fafb",
        }}
      >
        <Text style={{ textAlign: "center", fontWeight: "600" }}>
          📷 Seleccionar imagen del evento
        </Text>
      </Pressable>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 8,
            marginBottom: 12,
          }}
        />
      )}

      {/* Ubicación */}
      <Text style={{ marginBottom: 8, fontWeight: "600" }}>
        Selecciona la ubicación del evento
      </Text>

      <MapPicker
        onSelect={(lat, lng) => {
          setLatitude(String(lat));
          setLongitude(String(lng));
        }}
      />

      {latitude && longitude && (
        <Text style={{ color: "green", marginBottom: 12 }}>
          📍 Ubicación seleccionada
        </Text>
      )}

      {/* Error */}
      {error && <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>}

      {/* Publicar */}
      <Pressable
        onPress={handleCreate}
        disabled={loading}
        style={{
          backgroundColor: "#2563eb",
          padding: 16,
          borderRadius: 8,
          opacity: loading ? 0.7 : 1,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>
          {loading ? "Publicando..." : "PUBLICAR EVENTO"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
