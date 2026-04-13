import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";
type Props = {
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar: string;
  onPress: () => void;
  isLastMessageFromOtherUser: boolean;

};

export default function ConversationCard({
  name,
  lastMessage,
  time,
  unread,
  avatar,
  onPress,
  isLastMessageFromOtherUser

}: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
     <Image
  source={avatar}
  style={styles.avatar}
  contentFit="cover"
  cachePolicy="memory-disk"
  placeholder="https://via.placeholder.com/20"
  transition={200}
/>

<View style={styles.middle}>
        <Text style={styles.name}>{name}</Text>
        <Text
          style={[
            styles.message,
            isLastMessageFromOtherUser && styles.boldMessage,
          ]}
          numberOfLines={1}
        >
          {lastMessage}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.time}>{time}</Text>

        {unread ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unread}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 14,
    borderBottomWidth: 2,
    borderColor: "#ffb71d",
    alignItems: "center",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },

  middle: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  message: {
    color: "#666",
    marginTop: 2,
  },

  boldMessage: {
    fontWeight: "700",
    color: "#111",
  },

  right: {
    alignItems: "flex-end",
  },

  time: {
    fontSize: 12,
    color: "#999",
  },

  badge: {
    backgroundColor: "#0f2044",
    borderRadius: 12,
    paddingHorizontal: 6,
    marginTop: 4,
  },

  badgeText: {
    color: "white",
    fontSize: 12,
  },
});