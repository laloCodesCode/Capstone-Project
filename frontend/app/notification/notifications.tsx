import { useCallback, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { notificationService } from "../../src/services/notification";

type NotificationItem = {
  id: string;
  user_id: string;
  actor_user_id?: string | null;
  thread_id?: string | null;
  listing_id?: string | null;
  type: string;
  content: string;
  is_read: boolean;
  created_at: string;
  actor_username?: string | null;
  listing_title?: string | null;
  listing_image_url?: string | null;
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setError("");
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err: any) {
      console.log("NOTIFICATIONS ERROR:", err?.response?.data || err.message);
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadNotifications();
    }, [])
  );

  const formatTime = (timestamp: string) => {
    const createdDate = new Date(timestamp);
    const now = new Date();

    const diffMs = now.getTime() - createdDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleNotificationPress = (item: NotificationItem) => {
    if (item.thread_id) {
      router.push({
        pathname: "/chat/[id]",
        params: {
          id: item.thread_id,
          listingId: item.listing_id ?? "",
          listingTitle: item.listing_title ?? "",
          listingImageUrl: item.listing_image_url ?? "",
        },
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0f2044" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0f2044" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f2044" }}>
      {/* HEADER */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderColor: "#eee",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ marginRight: 12, flexDirection: "row", alignItems: "center"  }}
        >
          <Ionicons name="chevron-back" size={24} color="white" />
          <Text style={{ fontSize: 16, color: "white" }}>Back</Text>
        </Pressable>

        <Text style={{ fontSize: 20, fontWeight: "700", color: "white"}}>
          Notifications
        </Text>
      </View>

      {/* LIST */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleNotificationPress(item)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderColor: "#eee",
              backgroundColor: item.is_read ? "white" : "#f8fbff",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* LEFT SIDE TEXT */}
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#111",
                }}
              >
                {item.actor_username
                  ? `${item.actor_username} sent you a message`
                  : "New notification"}
              </Text>

              <Text
                style={{
                  marginTop: 4,
                  fontSize: 14,
                  color: "#666",
                }}
              >
                {item.listing_title ?? ""}
              </Text>

              <Text
                style={{
                  marginTop: 2,
                  fontSize: 12,
                  color: "#999",
                }}
              >
                {formatTime(item.created_at)}
              </Text>
            </View>

            {/* RIGHT SIDE IMAGE */}
            {item.listing_image_url && (
              <Image
                source={{ uri: item.listing_image_url }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 8,
                  backgroundColor: "#ddd",
                }}
                resizeMode="cover"
              />
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style= {{color:"white"}}>No notifications yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}