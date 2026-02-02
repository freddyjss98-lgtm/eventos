import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function Profile() {
  const handleLogout = () => {
    // 🗑️ eliminar token (MVP web)
    localStorage.removeItem("token");

    // 🔄 redirigir al login
    router.replace("/auth/login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Mi cuenta</Text>

      <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}
