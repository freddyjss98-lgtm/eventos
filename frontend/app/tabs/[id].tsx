import { View, Text, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getEventById } from "../../src/api/events";
import { buyTicket } from "../../src/api/tickets";


export default function EventDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getEventById(id)
      .then(setEvent)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Text>Cargando evento...</Text>;
  if (!event) return <Text>Evento no encontrado</Text>;


  const handleBuy = async () => {
  try {
    const ticket = await buyTicket(id!);
    alert("🎟️ Ticket comprado:\n" + ticket.code);
  } catch (err: any) {
  console.error("BUY TICKET ERROR", err);

  const message =
    err?.response?.data?.message ||
    err?.response?.data ||
    err?.message ||
    "Error desconocido";

  alert("Error al comprar ticket:\n" + JSON.stringify(message));
}
};


  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24 }}>{event.title}</Text>
      <Text>{new Date(event.date).toLocaleString()}</Text>
      <Text style={{ marginVertical: 12 }}>{event.description}</Text>

      <Button title="COMPRAR TICKET" onPress={handleBuy} />

    </View>
  );
}
