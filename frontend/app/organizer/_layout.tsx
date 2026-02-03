import { Redirect, Slot } from "expo-router";
import { isAuthenticated, getUserRole } from "../auth/auth";

export default function OrganizerLayout() {
  const loggedIn = isAuthenticated();
  const role = getUserRole();

  if (!loggedIn) {
    return <Redirect href="/auth/login" />;
  }

  if (role !== "ORGANIZER" && role !== "ADMIN") {
    return <Redirect href="/tabs" />;
  }

  return <Slot />;
}
