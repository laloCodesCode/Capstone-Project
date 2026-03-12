//Whole App entry point
import { useEffect, useState } from "react";
import { router, Slot } from "expo-router";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const [welcomed, setWelcomed] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!welcomed) {
      router.replace("/");
      return;
    }
    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/(auth)/login");
    }
  }, [user, loading, welcomed]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
