import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { messageService } from "../../src/services/message";
import type { ChatMessage } from "../../src/types/message";
import MessageBubble from "../../src/components/MessageBubble";
import { authService } from "../../src/services/auth";

export default function ChatScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await messageService.getThreadMessages(id);
        console.log("THREAD MESSAGES:", data);
        setMessages(data);
      } catch (err: any) {
        console.log("THREAD ERROR:", err?.response?.data || err.message);
        setError(err.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [id]);

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

  const handleSend = async () => {
    if (!id || !newMessage.trim()) return;

    try {
      const sentMessage = await messageService.sendMessage(id, newMessage.trim());
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (err: any) {
      console.log("SEND ERROR:", err?.response?.data || err.message);
    }
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
          flexDirection: "row",
          alignItems: "center",
          padding: 12,
          borderBottomWidth: 1,
          borderColor: "#eee",
          backgroundColor: "white",
        }}
      >
        <Pressable onPress={() => router.replace("/(tabs)/inbox")}>
          <Text style={{ fontSize: 16, color: "#0f2044" }}>← Back</Text>
        </Pressable>

        <Text
          style={{
            marginLeft: 16,
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          {name || "Chat"}
        </Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            sender={item.message_user === currentUserId ? "me" : "other"}
            text={item.body}
          />
        )}
        ListEmptyComponent={<Text>No messages yet.</Text>}
        contentContainerStyle={{ padding: 12 }}
      />

      <View style={{ flexDirection: "row", padding: 12, gap: 8 }}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        />
        <Pressable
          onPress={handleSend}
          style={{
            backgroundColor: "#0f2044",
            borderRadius: 8,
            paddingHorizontal: 16,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white" }}>Send</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}