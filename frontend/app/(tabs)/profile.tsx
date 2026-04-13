import { useAuth } from "../../src/context/AuthContext";
import { authService } from "../../src/services/auth";
import { MeResponse } from "../../src/types/auth";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { colors } from "../../src/styles/colors";
import { profileStyles } from "../../src/styles/profile.styles";
import ProfileTopTabs from "../../src/components/ProfileTopTabs";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authService
      .getMe()
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const getInitials = (username: string) => username.slice(0, 2).toUpperCase();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primary02,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary01} />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primary01,
          padding: 20,
        }}
      >
        <Text style={{ color: colors.danger }}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top"]} style={profileStyles.safeArea}>
      <View style={profileStyles.container}>
        <View style={profileStyles.avatarContainer}>
          <View style={profileStyles.avatarCircle}>
            <Text style={profileStyles.avatarInitials}>
              {getInitials(profile?.username ?? "?")}
            </Text>
          </View>
          <Text style={profileStyles.avatarName}>@{profile?.username}</Text>
          <Text style={profileStyles.avatarUsername}>
            {profile?.school_email}
          </Text>
        </View>

        {/* TABS */}
        <View style={{ flex: 1 }}>
          <ProfileTopTabs profile={profile} logout={logout} />
        </View>
      </View>
    </SafeAreaView>
  );
}
