import { View, Text, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { api } from "../../src/api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;

      // 🟢 Guardar JWT para el MVP (web / celular navegador)
      localStorage.setItem("token", token);

      console.log("TOKEN GUARDADO:", token);

      router.replace("/tabs");
    } catch (error) {
      Alert.alert("Error", "Credenciales inválidas");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

