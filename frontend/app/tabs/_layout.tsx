import { Tabs, Redirect } from "expo-router";
import { getUserRole, isAuthenticated } from "../auth/auth";

export default function TabsLayout() {
  const loggedIn = isAuthenticated();

  if (!loggedIn) {
    return <Redirect href="/auth/login" />;
  }

  const role = getUserRole();

if (role === "ORGANIZER") {
  return <Redirect href="/organizer" />;
}


  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Eventos" }} />
      <Tabs.Screen name="profile" options={{ title: "Mi cuenta" }} />
    </Tabs>
  );
}
