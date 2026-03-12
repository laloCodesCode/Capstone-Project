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
import { loginStyles } from "../../src/styles/login.styles";
import { colors } from "../../src/styles/colors";

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
      style={loginStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={loginStyles.topHalf} />
      <View style={loginStyles.bottomHalf} />

      <View style={loginStyles.card}>
        <Text style={loginStyles.title}>Welcome Back Spartan</Text>
        <Text style={loginStyles.subtitle}>Sign In Spartan!</Text>



        <View>
          <TextInput
            style={loginStyles.input}
            placeholder="Email or Username"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            value={identifier}
            onChangeText={setIdentifier}
          />
        </View>

        <View>
          <TextInput
            style={loginStyles.input}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {error && <Text style={loginStyles.errorText}>{error}</Text>}
        {success && <Text style={loginStyles.successText}>{success}</Text>}

        <TouchableOpacity
          style={loginStyles.primaryButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.genralWhite} />
          ) : (
            <Text style={loginStyles.primaryButtonText}>Log In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={loginStyles.linkButton} onPress={() => router.push("/(auth)/register")}>
          <Text style={loginStyles.linkText}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
