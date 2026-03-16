import {
  View,
  FlatList,
  TextInput,
  Pressable,
  Text,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MessageBubble from "../../src/components/MessageBubble";
import { router, useLocalSearchParams } from "expo-router";

const messages: { id: string; text: string; sender: "me" | "other" }[] = [
  { id: "1", text: "Hey is this available?", sender: "other" },
  { id: "2", text: "Yes it is!", sender: "me" },
  { id: "3", text: "Could you do $40?", sender: "other" },
];

export default function Chat() {
  const { id } = useLocalSearchParams();
  const user = {
    name: "Ava Johnson",
    image: "https://i.pravatar.cc/100?img=1",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderColor: "#eee",
          }}
        >
          <Pressable onPress={() => router.push("/(tabs)/inbox")}>
            <Text style={{ fontSize: 18, color: "#0f2044" }}>← Back</Text>
          </Pressable>
          <Image
            source={{ uri: user.image }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 10,
              marginLeft:15
            }}
          />
          <Text
            style={{
              fontSize: 17,
              fontWeight: "600",
              color: "#111",
            }}
          >
            {user.name}
          </Text>
        </View>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble text={item.text} sender={item.sender} />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        />

        <View
          style={{
            flexDirection: "row",
            padding: 30,
            borderTopWidth: 1,
            borderColor: "#eee",
          }}
        >
          <TextInput
            placeholder="Message..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 20,
              paddingHorizontal: 12,
            }}
          />

          <Pressable
            style={{
              marginLeft: 8,
              backgroundColor: "#0f2044",
              paddingHorizontal: 26,
              paddingVertical: 13,
              justifyContent: "center",
              borderRadius: 20,
            }}
          >
            <Text style={{ color: "white" }}>Send</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
