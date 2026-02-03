import { View, Text, TextInput, Button, Pressable } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { api } from "../../src/api/client";
import { getUserRole, logout } from "./auth";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async () => {
  setError(null);

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    const token = res.data?.access_token;
    if (!token) {
      setError("Error inesperado de autenticación");
      return;
    }

    localStorage.setItem("token", token);

    const role = getUserRole();

    if (role === "USER") {
      router.replace("/tabs");
    } else {
      // ORGANIZER o ADMIN intentando entrar por login de USER
      logout();
      setError(
        "Este acceso es solo para usuarios. Ingresa como organizador."
      );
    }
  } catch (err: any) {
    setError("Credenciales inválidas");
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
      
<Pressable onPress={() => router.push("/auth/organizer")} style={{ marginTop: 12 }}>
  <Text style={{ color: "blue", textAlign: "center" }}>
    ¿Quieres publicar un evento? Soy organizador
  </Text>
</Pressable>
    </View>
  );
}

