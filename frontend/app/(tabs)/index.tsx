import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function HomeScreen() {
  // const { logout } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home Screen</Text>
    </View>
  );
}
