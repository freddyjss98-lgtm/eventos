import { View, Text, TextInput, Button, Pressable } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { api } from "../../src/api/client";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.access_token;

      // 🟢 Guardar JWT para el MVP (web)
      localStorage.setItem("token", token);

      router.replace("/tabs");
    } catch (err) {
      setError("Credenciales inválidas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>Bienvenido</Text>
      <Text style={{ marginBottom: 16 }}>
        Inicia sesión para comprar y gestionar tus tickets
      </Text>

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

      {error ? (
        <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
      ) : null}

      <Button
        title={loading ? "Entrando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
      />

      <Pressable onPress={() => router.push("/auth/register")}>
        <Text style={{ color: "blue", marginTop: 16, textAlign: "center" }}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </Pressable>
    </View>
  );
}

