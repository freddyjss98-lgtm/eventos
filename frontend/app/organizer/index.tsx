import { View, Text, Button } from "react-native";
import { router } from "expo-router";
import { logout } from "../auth/auth";

export default function OrganizerDashboard() {
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 24 }}>
        Panel del organizador
      </Text>

      <Button
        title="➕ Crear evento"
        onPress={() => router.push("/organizer/create-event")}
      />

      <View style={{ height: 12 }} />

      <Button
        title="📋 Ver mis eventos"
        onPress={() => router.push("/organizer/my-events")}
      />

      <View style={{ height: 12 }} />

      <Button
        title="Cerrar sesión"
        onPress={() => {
          logout();
          router.replace("/auth/login");
        }}
      />
    </View>
  );
}
