import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";

import { userService, PublicUserProfile } from "../../src/services/user";
import { colors } from "../../src/styles/colors";

type ListingImage = {
  id: string;
  image_url: string;
  is_primary: boolean;
};

type ListingItem = {
  id: string;
  title: string;
  price: number;
  location: string;
  status: string;
  images?: ListingImage[];
};

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [profile, setProfile] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!id) return;
        const data = await userService.getPublicProfile(id);
        setProfile(data);
      } catch (err) {
        console.log("PROFILE LOAD ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary01 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={colors.primary02} />
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary01 }}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "white" }}>User not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary01 }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            marginRight: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
          <Text style={{ color: "white", fontSize: 16 }}>Back</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
        {profile.profile_image_url ? (
          <Image
            source={{ uri: `${profile.profile_image_url}?t=${Date.now()}` }}
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              marginBottom: 12,
            }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}
            onError={(e) => console.log("PUBLIC PROFILE IMAGE ERROR:", e)}
          />
        ) : (
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 42,
              backgroundColor: colors.primary02,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "white", fontSize: 28, fontWeight: "700" }}>
              {profile.username?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <Text style={{ color: "white", fontSize: 24, fontWeight: "700" }}>
          {profile.username}
        </Text>
        <Text style={{ color: "#ccc", marginTop: 4 }}>
          {profile.school_email}
        </Text>

        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "600",
            marginTop: 20,
          }}
        >
          Listings
        </Text>
      </View>

      <FlatList
        data={profile.listings as ListingItem[]}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 20 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        renderItem={({ item }) => {
          const primaryImage =
            item.images?.find((img) => img.is_primary) || item.images?.[0];

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push(`/item/${item.id}`)}
              style={{
                width: "48%",
                backgroundColor: colors.primary02,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <Image
                source={
                  primaryImage
                    ? `${process.env.EXPO_PUBLIC_API_URL}/listing-image/${primaryImage.id}/download`
                    : "https://via.placeholder.com/300x200.png?text=No+Image"
                }
                style={{ width: "100%", height: 120 }}
                contentFit="cover"
                cachePolicy="memory-disk"
                transition={200}
              />

              <View style={{ padding: 10 }}>
                <Text
                  style={{ color: "white", fontWeight: "600", fontSize: 15 }}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>

                <Text style={{ color: "#ddd", marginTop: 4 }}>
                  ${item.price}
                </Text>

                <Text style={{ color: "#bbb", marginTop: 2 }} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: "#ccc", textAlign: "center", marginTop: 30 }}>
            No listings yet.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
