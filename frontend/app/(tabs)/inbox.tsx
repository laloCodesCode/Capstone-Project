import { View, FlatList } from "react-native";
import ConversationCard from "../../src/components/ConversationCard";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const conversations = [
  {
    id: "1",
    name: "Ava Johnson",
    lastMessage: "Is this still available?",
    time: "2:14 PM",
    unread: 2,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Marcus Lee",
    lastMessage: "I can meet tomorrow",
    time: "Yesterday",
    unread: 0,
    avatar: "https://i.pravatar.cc/150?img=2",
  },
];

export default function Inbox() {
  const router = useRouter();

  return (
    <SafeAreaView>
        <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ConversationCard
            {...item}
            onPress={() =>
              router.push({
                pathname: "/chat/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}