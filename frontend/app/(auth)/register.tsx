import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { UserCreate } from "../../src/types/auth";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<UserCreate>({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof UserCreate, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleRegister = async () => {
    const { first_name, last_name, email, username, password } = form;
    if (!first_name || !last_name || !email || !username || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      await register(form);
      // AuthContext auto-logs in and _layout.tsx redirects
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fields: {
    field: keyof UserCreate;
    placeholder: string;
    secure?: boolean;
  }[] = [
    { field: "first_name", placeholder: "First Name" },
    { field: "last_name", placeholder: "Last Name" },
    { field: "email", placeholder: "Email" },
    { field: "username", placeholder: "Username" },
    { field: "password", placeholder: "Password", secure: true },
  ];
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 12 }}>
        <Text>Create Account</Text>

        {fields.map(({ field, placeholder, secure }) => (
          <TextInput
            key={field}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              borderRadius: 6,
            }}
            placeholder={placeholder}
            autoCapitalize="none"
            secureTextEntry={secure}
            value={form[field]}
            onChangeText={(val) => update(field, val)}
          />
        ))}

        {error && <Text style={{ color: "red" }}>{error}</Text>}

        <TouchableOpacity
          style={{
            backgroundColor: "#4F46E5",
            padding: 14,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "600" }}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text style={{ textAlign: "center", color: "#4F46E5" }}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
