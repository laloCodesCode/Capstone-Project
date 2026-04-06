import { View, FlatList, ActivityIndicator, Text, Pressable } from "react-native";
import ConversationCard from "../../src/components/ConversationCard";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { messageService } from "../../src/services/message";
import type { InboxThread } from "../../src/types/message";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { notificationService } from "../../src/services/notification";
import { authService } from "../../src/services/auth";

export default function Inbox() {
  const router = useRouter();
  const [conversations, setConversations] = useState<InboxThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const loadInbox = async () => {
    try {
      setError("");
      const data = await messageService.getInbox();
      console.log("INBOX DATA:", data);
      setConversations(data);
    } catch (err: any) {
      console.log("INBOX ERROR:", err?.response?.data || err.message);
      setError(err.message || "Failed to load inbox");
    }
  };
  const loadUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (err) {
      console.log("NOTIF COUNT ERROR:", err);
    }
  };

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const me = await authService.getMe();
        setCurrentUserId(me.user_id);
      } catch (err: any) {
        console.log("GET ME ERROR:", err?.message || err);
      }
    };
  
    loadCurrentUser();
  }, []);
  useFocusEffect(
    useCallback(() => {
      loadInbox();
      loadUnreadCount();
    }, [])
  );
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadInbox();
      setLoading(false);
    };

    init();
  }, []);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await loadInbox();
    } finally {
      setRefreshing(false);
    }
  };

  const formatMessageTime = (timestamp: string | null) => {
    if (!timestamp) return "";

    const messageDate = new Date(timestamp);
    const now = new Date();

    const diffMs = now.getTime() - messageDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f2044" }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderColor: "#0f2044",
          backgroundColor: "#0f2044",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "white"
          }}
        >
          Inbox
        </Text>
  
        <Pressable
         onPress={async () => {
          try {
            await notificationService.markAllAsRead();
            setUnreadCount(0);
            router.push("/notification/notifications");
          } catch (err) {
            console.log("MARK ALL READ ERROR:", err);
          }
        }}
        >
          <Ionicons name="notifications-outline" size={24} color="white" />
  
          {unreadCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                minWidth: 18,
                height: 18,
                borderRadius: 9,
                backgroundColor: "#e53935",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 4,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 11,
                  fontWeight: "700",
                }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>
  
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <ConversationCard
            name={item.other_user_name}
            lastMessage={item.last_message ?? "No messages yet"}
            time={formatMessageTime(item.last_message_at)}
            unread={item.unread_count}
            avatar={item.listing_image_url ?? "https://via.placeholder.com/150"}
            isLastMessageFromOtherUser={
              item.unread_count > 0 &&
              item.last_message_user_id !== currentUserId
            }
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: {
                  id: item.id,
                  name: item.other_user_name,
                  listingId: item.listing_id,
                  listingTitle: item.listing_title ?? "View Listing",
                  listingImageUrl: item.listing_image_url ?? "",
                },
              })
            }
          />
        )}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style= {{color: "white"}}>No conversations yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}