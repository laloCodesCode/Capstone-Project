import { useEffect } from "react";
import { router, Stack } from "expo-router";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

function RootLayoutNav() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/welcome");
    }
  }, [user, loading]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen
        name="chat/[id]"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />

      <Stack.Screen
        name="item/[id]"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
  name="user/[id]"
  options={{
    headerShown: false,
    animation: "slide_from_right",
  }}
/>

      <Stack.Screen name="(auth)" options={{ headerShown: false }} />

      <Stack.Screen
  name="notification/notifications"
  options={{
    headerShown: false,
    animation: "slide_from_right",
  }}
/>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}