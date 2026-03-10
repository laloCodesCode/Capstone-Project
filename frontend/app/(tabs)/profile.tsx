import { useAuth } from "../../src/context/AuthContext";
import { authService } from "../../src/services/auth";
import { MeResponse } from "../../src/types/auth";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authService
      .getME()
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    //Error Loading the Profile page
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 16 }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );

  //Otherwise show Profile page
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profile</Text>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 12, color: "#666" }}>USERNAME</Text>
        <Text style={{ fontSize: 16 }}>{profile?.username}</Text>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 12, color: "#666" }}>EMAIL</Text>
        <Text style={{ fontSize: 16 }}>{profile?.email}</Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#dc2626",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 16,
        }}
        onPress={logout}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
