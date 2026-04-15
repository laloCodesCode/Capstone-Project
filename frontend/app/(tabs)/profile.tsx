import { useAuth } from "../../src/context/AuthContext";
import { authService } from "../../src/services/auth";
import { userService } from "../../src/services/user";
import { MeResponse } from "../../src/types/auth";
import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../src/styles/colors";
import { profileStyles } from "../../src/styles/profile.styles";
import ProfileTopTabs from "../../src/components/ProfileTopTabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
export default function ProfileScreen() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const loadProfile = useCallback(async () => {
    try {
      setError(null);
      const me = await authService.getMe();
      console.log("ME AFTER RELOAD:", me);
      console.log("PROFILE IMAGE URL:", me.profile_image_url);
      setProfile(me);
    } catch (e: any) {
      setError(e.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const getInitials = (username: string) => username.slice(0, 2).toUpperCase();

  const handlePickProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert("Permission required", "Please allow photo access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      console.log("picked asset:", asset);

      const formData = new FormData();
      formData.append("file", {
        uri: asset.uri,
        name: asset.fileName || "profile.jpg",
        type: asset.mimeType || "image/jpeg",
      } as any);

      setUploadingImage(true);
      console.log("upload starting...");
      const res = await userService.uploadProfileImage(formData);
      setImageVersion((prev) => prev + 1);
      console.log("upload response:", res);
      await loadProfile();
      console.log("profile reloaded");
    } catch (err) {
      console.log("PROFILE IMAGE UPLOAD ERROR:", err);
      Alert.alert("Upload failed", "Could not upload profile image.");
    } finally {
      setUploadingImage(false);
    }
  };

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
          <TouchableOpacity
            onPress={handlePickProfileImage}
            disabled={uploadingImage}
            activeOpacity={0.85}
            style={{ alignItems: "center" }}
          >
            <View style={{ position: "relative" }}>
              {profile?.profile_image_url ? (
                <Image
                  source={{
                    uri: `${profile.profile_image_url}?v=${imageVersion}`,
                  }}
                  style={profileStyles.avatarCircle}
                  contentFit="cover"
                  cachePolicy="none"
                  transition={200}
                  onLoad={() =>
                    console.log(
                      "PROFILE IMAGE LOADED:",
                      `${profile.profile_image_url}?v=${imageVersion}`
                    )
                  }
                  onError={(e) =>
                    console.log(
                      "PROFILE IMAGE ERROR:",
                      e,
                      `${profile.profile_image_url}?v=${imageVersion}`
                    )
                  }
                />
              ) : (
                <View style={profileStyles.avatarCircle}>
                  <Text style={profileStyles.avatarInitials}>
                    {getInitials(profile?.username ?? "?")}
                  </Text>
                </View>
              )}

              <View
                style={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  backgroundColor: "#0f2044",
                  borderRadius: 12,
                  padding: 4,
                }}
              >
                <Ionicons name="pencil" size={14} color="white" />
              </View>
            </View>
          </TouchableOpacity>

          <Text style={profileStyles.avatarName}>@{profile?.username}</Text>
          <Text style={profileStyles.avatarUsername}>
            {profile?.school_email}
          </Text>

          <Text style={{ color: "#0f2044", marginTop: 8, fontWeight: "600" }}>
            {uploadingImage ? "Uploading..." : "tap avatar"}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <ProfileTopTabs
            profile={profile}
            logout={logout}
            refreshProfile={loadProfile}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
