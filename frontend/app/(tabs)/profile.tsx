import { useAuth } from "../../src/context/AuthContext";
import { authService } from "../../src/services/auth";
import { MeResponse, PasswordChange } from "../../src/types/auth";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Dimensions, } from "react-native";
import { colors } from "../../src/styles/colors"
import { profileStyles } from "../../src/styles/profile.styles";



const { height } = Dimensions.get("window");



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
    // if (newPassword.length > 4) {
    //   setPasswordError("New password must be at least 4 characters!")
    //   return;
    // }
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

  const getInitials = (first: string, last: string) =>
    `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();




  if (loading) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.primary01 }}>
      <ActivityIndicator size="large" color={colors.primary02} />
    </View>
  );

  if (error) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16, backgroundColor: colors.primary01 }}>
      <Text style={{ color: colors.danger }}>{error}</Text>
      <TouchableOpacity style={profileStyles.dangerButton} onPress={logout}>
        <Text style={profileStyles.dangerButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );


  // if (loading)
  //   //Error Loading the Profile page
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", padding: 24, gap: 16 }}>
  //       <Text style={{ color: "red" }}>{error}</Text>
  //     </View>
  //   );
  //
  // //Session Expired!
  // if (error)
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16 }}>
  //       <Text style={{ color: "red" }}>{error}</Text>
  //       <TouchableOpacity
  //         style={{ backgroundColor: "#dc2626", padding: 14, borderRadius: 8, alignItems: "center", width: 200 }}
  //         onPress={logout}
  //       >
  //         <Text style={{ color: "#fff", fontWeight: "600" }}>Log Out</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // if (error)
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );


  //Otherwise show Profile page
  return (
    <View style={profileStyles.container}>
      <View style={profileStyles.topHalf} />
      <View style={profileStyles.bottomHalf} />


      <ScrollView
        style={profileStyles.scrollView}
        contentContainerStyle={profileStyles.scrollContent}
        showsVerticalScrollIndicator={false} >



        <View style={profileStyles.avatarContainer}>
          <View style={profileStyles.avatarCircle}>
            <Text style={profileStyles.avatarInitials}>
              {getInitials(profile?.first_name ?? "?", profile?.last_name ?? "?")}
            </Text>
          </View>
          <Text style={profileStyles.avatarName}>
            {profile?.first_name} {profile?.last_name}
          </Text>
          <Text style={profileStyles.avatarUsername}>@{profile?.username}</Text>
        </View>



        {/* Info Card */}
        <View style={profileStyles.card}>
          <Text style={profileStyles.sectionTitle}>Account Info</Text>

          <View style={profileStyles.infoRow}>
            <Text style={profileStyles.infoLabel}>First Name</Text>
            <Text style={profileStyles.infoValue}>{profile?.first_name}</Text>
          </View>

          <View style={profileStyles.divder} />

          <View style={profileStyles.infoRow}>
            <Text style={profileStyles.infoLabel}>Last Name</Text>
            <Text style={profileStyles.infoValue}>{profile?.last_name}</Text>
          </View>

          <View style={profileStyles.divder} />

          <View style={profileStyles.infoRow}>
            <Text style={profileStyles.infoLabel}>Username</Text>
            <Text style={profileStyles.infoValue}>@{profile?.username}</Text>
          </View>

          <View style={profileStyles.divder} />

          <View style={profileStyles.infoRow}>
            <Text style={profileStyles.infoLabel}>Email</Text>
            <Text style={profileStyles.infoValue}>{profile?.email}</Text>
          </View>
        </View>




        {/* Password Card */}
        <View style={[profileStyles.card, { marginTop: 16 }]} >
          <Text style={profileStyles.sectionTitle}>Change Password</Text>

          <View>
            <Text style={profileStyles.inputLabel}>Current Password</Text>
            <TextInput
              style={profileStyles.input}
              placeholder="Enter current password"
              placeholderTextColor="#a0aec0"
              secureTextEntry
              autoCapitalize="none"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
          </View>

          <View>
            <Text style={profileStyles.inputLabel}>New Password</Text>
            <TextInput
              style={profileStyles.input}
              placeholder="Enter new password"
              placeholderTextColor="#a0aec0"
              secureTextEntry
              autoCapitalize="none"
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>
        </View>

        {passwordError && <Text style={profileStyles.errorText}>{passwordError}</Text>}
        {passwordSuccess && <Text style={profileStyles.successText}>{passwordSuccess}</Text>}




        <TouchableOpacity
          style={profileStyles.primaryButton}
          onPress={handlePasswordChange}
          disabled={passwordLoading}
        >
          {passwordLoading
            ? <ActivityIndicator color={colors.primary01} />
            : <Text style={profileStyles.primaryButtonText}>Update Password</Text>
          }
        </TouchableOpacity>


        {/* Logout */}
        <TouchableOpacity
          style={profileStyles.primaryButton}
          onPress={logout}
        >
          <Text style={profileStyles.dangerButton}>Log Out</Text>
        </TouchableOpacity>























      </ScrollView >
    </View >
  );
}

