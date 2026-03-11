import { useAuth } from "../../src/context/AuthContext";
import { authService } from "../../src/services/auth";
import { MeResponse, PasswordChange } from "../../src/types/auth";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput } from "react-native";

export default function ProfileScreen() {
  //Profile State 
  const { logout } = useAuth();
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);


  useEffect(() => {
    authService
      .getME()
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);


  //Handler function for password change 
  const handlePasswordChange = async () => {

    //Fill both feilds
    if (!currentPassword || !newPassword) {
      setPasswordError("Please fill in both fields!");
      return;
    }

    //Password legnth requirnment
    //TODO: change the requirnment to at least 8 characters
    if (newPassword.length > 4) {
      setPasswordError("New password must be at least 4 characters!")
      return;
    }
    try {
      setPasswordError(null);
      setPasswordSuccess(null);
      setPasswordLoading(true);
      const payload: PasswordChange = {
        current_password: currentPassword,
        new_password: newPassword,
      };
      await authService.changePassword(payload);
      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: unknown) {
      setPasswordError(e instanceof Error ? e.message : "Something went wrong!");
    } finally {
      setPasswordLoading(false);
    }
  };





  if (loading)
    //Error Loading the Profile page
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 16 }}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );

  //Session Expired!
  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
        <Text style={{ color: "red" }}>{error}</Text>
        <TouchableOpacity
          style={{ backgroundColor: "#dc2626", padding: 14, borderRadius: 8, alignItems: "center", width: 200 }}
          onPress={logout}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  if (error)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );


  //Otherwise show Profile page
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 16, paddingTop: 60 }}>

      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Profile</Text>

      {/*profile info space*/}
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 12, color: "#666" }}>FIRST NAME</Text>
        <Text style={{ fontSize: 12, color: "#666" }}></Text><Text style={{ fontSize: 16 }}>{profile?.first_name}</Text>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 12, color: "#666" }}>LAST NAME</Text>
        <Text style={{ fontSize: 12, color: "#666" }}></Text><Text style={{ fontSize: 16 }}>{profile?.last_name}</Text>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 12, color: "#666" }}>USERNAME</Text>
        <Text style={{ fontSize: 16 }}>{profile?.username}</Text>
      </View>
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 12, color: "#666" }}>EMAIL</Text>
        <Text style={{ fontSize: 16 }}>{profile?.email}</Text>
      </View>




      <View style={{ height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 }} />





      <Text style={{ fontSize: 18, fontWeight: "600" }}>Change Password</Text>

      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 6 }}
        placeholder="Current Password"
        secureTextEntry
        autoCapitalize="none"
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />

      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 6 }}
        placeholder="New Password"
        secureTextEntry
        autoCapitalize="none"
        value={newPassword}
        onChangeText={setNewPassword}
      />

      {passwordError && <Text style={{ color: "red" }}>{passwordError}</Text>}
      {passwordSuccess && <Text style={{ color: "green" }}>{passwordSuccess}</Text>}

      <TouchableOpacity
        style={{ backgroundColor: "#4F46E5", padding: 14, borderRadius: 8, alignItems: "center" }}
        onPress={handlePasswordChange}
        disabled={passwordLoading}
      >
        {passwordLoading
          ? <ActivityIndicator color="#fff" />
          : <Text style={{ color: "#fff", fontWeight: "600" }}>Update Password</Text>
        }
      </TouchableOpacity>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: "#e5e7eb", marginVertical: 8 }} />

      {/* Logout */}
      <TouchableOpacity
        style={{ backgroundColor: "#dc2626", padding: 14, borderRadius: 8, alignItems: "center" }}
        onPress={logout}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
