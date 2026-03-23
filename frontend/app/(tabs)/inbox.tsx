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

  useEffect(() => {
    const loadInbox = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await messageService.getInbox();
        console.log("INBOX DATA", data);
        setConversations(data);
      } catch (err: any) {
        console.log("INBOX ERROR", err?.response?.data || err.message);
        setError(err.message || "Failed to load inbox");
      } finally {
        setLoading(false);
      }
    };

    loadInbox();
  }, []);

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
    <SafeAreaView>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationCard
            name={item.other_user_name}
            lastMessage={item.last_message ?? "No messages yet"}
            time={item.last_message_at ?? ""}
            unread={item.unread_count}
            avatar="https://i.pravatar.cc/150?img=1"
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        ListEmptyComponent={<Text>No conversations yet.</Text>}
      />
    </SafeAreaView>
  );
}