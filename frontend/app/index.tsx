import { Redirect } from "expo-router";
import { isAuthenticated, getUserRole } from "./auth/auth";

export default function Index() {
  const loggedIn = isAuthenticated();

  if (!loggedIn) {
    return <Redirect href="/auth/login" />;
  }

  const role = getUserRole();

  if (role === "ORGANIZER") {
    return <Redirect href="/organizer" />;
  }

  return <Redirect href="/tabs" />;
}
