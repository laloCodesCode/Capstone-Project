import { View, Text, StyleSheet } from "react-native";

type Props = {
  text: string;
  sender: "me" | "other";
};

export default function MessageBubble({ text, sender }: Props) {
  const isMe = sender === "me";

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={[styles.text, isMe ? styles.myText : styles.otherText]}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 14,
    marginVertical: 4,
    maxWidth: "70%",
  },

  myMessage: {
    backgroundColor: "#0f2044",
    alignSelf: "flex-end",
  },

  otherMessage: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },

  text: {
    fontSize: 16,
  },

  myText: {
    color: "#fff",
  },

  otherText: {
    color: "#000",
  },
});