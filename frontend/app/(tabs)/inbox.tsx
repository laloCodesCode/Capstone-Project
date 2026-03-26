import { View, FlatList, ActivityIndicator, Text } from "react-native";
import ConversationCard from "../../src/components/ConversationCard";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { messageService } from "../../src/services/message";
import type { InboxThread } from "../../src/types/message";

export default function Inbox() {
  const router = useRouter();
  const [conversations, setConversations] = useState<InboxThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadInbox = async () => {
    try {
      setError("");

      const data = await messageService.getInbox();
      console.log("INBOX DATA", data);
      setConversations(data);
    } catch (err: any) {
      console.log("INBOX ERROR", err?.response?.data || err.message);
      setError(err.message || "Failed to load inbox");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadInbox();
      setLoading(false);
    };

    init();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInbox();
    setRefreshing(false);
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
      <SafeAreaView>
        <View>
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView>
        <View>
          <Text>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderColor: "#eee",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
          }}
        >
          Inbox
        </Text>
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
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: {
                  id: item.id,
                  name: item.other_user_name,
                  listingId: item.listing_id,
                  listingTitle: item.listing_title ?? "View Listing",
                },
              })
            }
          />
        )}
        ListEmptyComponent={<Text>No conversations yet.</Text>}
      />
    </SafeAreaView>
  );
}