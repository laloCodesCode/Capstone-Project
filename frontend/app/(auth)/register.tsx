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
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { UserCreate } from "../../src/types/auth";
import { registerStyles } from "../../src/styles/register.styles";
import { colors } from "../../src/styles/colors";
const { height } = Dimensions.get("window");

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
      style={registerStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <View style={{ flex: 1 }}>
        <View style={registerStyles.topHalf} />
        <View style={registerStyles.bottomHalf} />
      </View>



      <ScrollView
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        contentContainerStyle={{ paddingTop: height * 0.12, paddingHorizontal: 28, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >

        <View style={registerStyles.card}>
          <Text style={registerStyles.title}>Create Account</Text>
          <Text style={registerStyles.subtitle}>Sign up to get started!</Text>

          {fields.map(({ field, placeholder, secure }) => (
            <View key={field}>
              <Text style={registerStyles.inputLabel}>{placeholder}</Text>
              <TextInput
                style={registerStyles.input}
                placeholder={`Enter your ${placeholder.toLocaleLowerCase()}`}
                placeholderTextColor="#a0aec0"
                autoCapitalize="none"
                secureTextEntry={secure}
                value={form[field]}
                onChangeText={(val) => update(field, val)}
              />
            </View>
          ))}

          {error && <Text style={registerStyles.errorText}>{error}</Text>}




          <TouchableOpacity
            style={registerStyles.primaryButton}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.primary01} />
              : <Text style={registerStyles.primaryButtonText}>Register</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={registerStyles.linkButton}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={registerStyles.linkText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
