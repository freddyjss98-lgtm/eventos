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
