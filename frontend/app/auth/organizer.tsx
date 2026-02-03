import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { api } from "../../src/api/client";

export default function OrganizerAuth() {
  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    if (!email || !password || (mode === "REGISTER" && !organization)) {
      setError("Completa todos los campos requeridos");
      return;
    }

    setLoading(true);

    try {
      const res =
        mode === "LOGIN"
          ? await api.post("/auth/login", { email, password })
          : await api.post("/auth/register", {
              email,
              password,
              role: "ORGANIZER",
            });

      const token = res.data?.access_token;

      if (!token) {
        setError("Error de autenticación");
        return;
      }

      localStorage.setItem("token", token);
      router.replace("/organizer");
    } catch (err: any) {
      setError(
        mode === "LOGIN"
          ? "Credenciales inválidas"
          : "Error creando cuenta de organizador"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
      {/* Selector de modo */}
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <Button
          title="Iniciar sesión"
          onPress={() => setMode("LOGIN")}
          color={mode === "LOGIN" ? "#2563eb" : undefined}
        />
        <View style={{ width: 8 }} />
        <Button
          title="Crear cuenta"
          onPress={() => setMode("REGISTER")}
          color={mode === "REGISTER" ? "#2563eb" : undefined}
        />
      </View>

      <Text style={{ fontSize: 24, marginBottom: 12 }}>
        {mode === "LOGIN"
          ? "Ingreso de organizador"
          : "Registro de organizador"}
      </Text>

      <Text style={{ marginBottom: 16, color: "#555" }}>
        {mode === "LOGIN"
          ? "Ingresa con tus credenciales de organizador."
          : "Crea una cuenta para publicar y gestionar eventos."}
      </Text>

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

      {mode === "REGISTER" && (
        <TextInput
          placeholder="Nombre del organizador / empresa"
          value={organization}
          onChangeText={setOrganization}
          style={{ borderWidth: 1, padding: 12, marginBottom: 12 }}
        />
      )}

      {error && (
        <Text style={{ color: "red", marginBottom: 12 }}>{error}</Text>
      )}

      <Button
        title={
          loading
            ? "Procesando..."
            : mode === "LOGIN"
            ? "Entrar como organizador"
            : "Crear cuenta de organizador"
        }
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
}
