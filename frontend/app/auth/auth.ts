export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

/**
 * Obtiene el role del usuario a partir del payload del JWT almacenado en localStorage.
 * - No valida la firma.
 * - Usa atob para decodificar base64 (convierte base64url a base64 primero).
 * - Devuelve el valor de `role` del payload o null si no existe / no se puede decodificar.
 */
export function getUserRole(): string | null {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  const payloadB64Url = parts[1];

  try {
    // Convertir base64url a base64
    let base64 = payloadB64Url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad === 2) base64 += "==";
    else if (pad === 3) base64 += "=";
    else if (pad === 1) {
      // padding inválido
      return null;
    }

    const json = atob(base64);
    const obj = JSON.parse(json);

    if (obj && typeof obj === "object" && "role" in obj) {
      const role = (obj as any).role;
      return role == null ? null : String(role);
    }

    return null;
  } catch (err) {
    return null;
  }
}