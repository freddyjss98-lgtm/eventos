import { Stack, Redirect } from "expo-router";
import { isAuthenticated } from "../auth/auth";

export default function TabsLayout() {
  const loggedIn = isAuthenticated();

  if (!loggedIn) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
