import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function HomeScreen() {
  const { logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>
      <TouchableOpacity
        onPress={logout}
        style={{
          marginTop: 20,
          backgroundColor: "#dc2626",
          padding: 14,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
