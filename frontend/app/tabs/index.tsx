import { View, Text, FlatList, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { getEvents } from "../../src/api/events";

export default function EventsScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Text>Cargando eventos...</Text>;
  }

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
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
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
           <Text>
  {new Date(item.date).toLocaleDateString()}{" "}
  {new Date(item.date).toLocaleTimeString()}
</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
