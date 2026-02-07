import { View, Text, Pressable, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getEventById } from "../../src/api/events";
import { buyTicket } from "../../src/api/tickets";

export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🧮 cantidad de tickets
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    if (!id) return;

    getEventById(id)
      .then(setEvent)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Text>Cargando evento...</Text>;
  if (!event) return <Text>Evento no encontrado</Text>;

  // 🎟️ COMPRAR TICKETS
  const handleBuy = async () => {
    Alert.alert("DEBUG", `Comprando ${quantity} ticket(s) para ${id}`);

    try {
      setBuying(true);

      const tickets = await buyTicket(id!, quantity);

      Alert.alert(
        "Compra exitosa 🎉",
        `Compraste ${tickets.length} ticket(s)`
      );
    } catch (err: any) {
      console.error("BUY TICKET ERROR", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Error desconocido";

      Alert.alert(
        "Error al comprar ticket",
        String(message)
      );
    } finally {
      setBuying(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      {/* 📄 INFO EVENTO */}
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {event.title}
      </Text>

      <Text style={{ marginBottom: 8 }}>
        {new Date(event.date).toLocaleString()}
      </Text>

      <Text style={{ marginVertical: 12 }}>
        {event.description}
      </Text>

      {/* 🧮 SELECTOR DE CANTIDAD */}
      <Text style={{ fontWeight: "600", marginBottom: 6 }}>
        Cantidad de tickets
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Pressable
          onPress={() => setQuantity((q) => Math.max(1, q - 1))}
          style={{
            padding: 10,
            borderRadius: 8,
            backgroundColor: "#e5e7eb",
          }}
        >
          <Text style={{ fontSize: 18 }}>−</Text>
        </Pressable>

        <Text style={{ marginHorizontal: 16, fontSize: 18 }}>
          {quantity}
        </Text>

        <Pressable
          onPress={() => setQuantity((q) => q + 1)}
          style={{
            padding: 10,
            borderRadius: 8,
            backgroundColor: "#e5e7eb",
          }}
        >
          <Text style={{ fontSize: 18 }}>+</Text>
        </Pressable>
      </View>

      {/* 🎟️ BOTÓN DE COMPRA (FIX DEFINITIVO) */}
      <Pressable
        onPress={handleBuy}
        disabled={buying}
        style={{
          backgroundColor: "#2563eb",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
          opacity: buying ? 0.6 : 1,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          {buying ? "Procesando..." : "COMPRAR TICKET"}
        </Text>
      </Pressable>
    </View>
  );
}
