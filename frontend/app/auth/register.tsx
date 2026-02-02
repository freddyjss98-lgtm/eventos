import { View, Text, TextInput, Button, Pressable } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { api } from "../../src/api/client";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    // limpiar error previo
    setError("");

    // validación básica
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Email y contraseña son requeridos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", {
        email,
        password,
      });

      // intentar obtener token (mismo patrón que login)
      const token = res.data?.access_token;

      if (token) {
        // Guardar JWT para el MVP (web / navegador)
        localStorage.setItem("token", token);
        // navegar a la pantalla principal
        router.replace("/tabs");
      } else {
        // Si no vino token, navegar a login como fallback
        router.replace("/auth/login");
      }
    } catch (err: any) {
      // intentar extraer mensaje del backend
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Error registrando usuario";
      setError(String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Registro</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Confirmar password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
      />

      {error ? (
        <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
      ) : null}

      <Button
        title={loading ? "Registrando..." : "Registrarse"}
        onPress={handleRegister}
        disabled={loading}
      />

      <Pressable onPress={() => router.push("/auth/login")}>
        <Text style={{ color: "blue", marginTop: 12, textAlign: "center" }}>
          ¿Ya tienes cuenta? Entrar
        </Text>
      </Pressable>
    </View>
  );
}