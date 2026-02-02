import { Tabs, Redirect } from "expo-router";
import { isAuthenticated } from "../auth/auth";

export default function TabsLayout() {
  const loggedIn = isAuthenticated();

  if (!loggedIn) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Eventos" }} />
      <Tabs.Screen name="profile" options={{ title: "Mi cuenta" }} />
    </Tabs>
  );
}
