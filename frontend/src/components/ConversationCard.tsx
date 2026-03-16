import { View, Text, StyleSheet, Image, Pressable } from "react-native";

type Props = {
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar: string;
  onPress: () => void;
};

export default function ConversationCard({
  name,
  lastMessage,
  time,
  unread,
  avatar,
  onPress,
}: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Image source={{ uri: avatar }} style={styles.avatar} />

      <View style={styles.middle}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.message}>{lastMessage}</Text>
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
    borderBottomWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  middle: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
  },

  message: {
    color: "#666",
    marginTop: 2,
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