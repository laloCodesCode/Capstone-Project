import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { UserCreate } from "../../src/types/auth";

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setError(null);
      setSuccess(null);
      setLoading(true);
      await login(identifier, password);
      setSuccess("Login successful! Redirecting...");
      // AuthContext triggers redirect automatically via _layout.tsx
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text>Welcome Back</Text>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 6,
        }}
        placeholder="Email or Username"
        autoCapitalize="none"
        autoCorrect={false}
        value={identifier}
        onChangeText={setIdentifier}
      />

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 6,
        }}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={{ color: "red" }}>{error}</Text>}
      {success && <Text style={{ color: "green" }}>{success}</Text>}

      <TouchableOpacity
        style={{
          backgroundColor: "#4F46E5",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
        <Text style={{ textAlign: "center", color: "#4F46E5" }}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
