import { View } from "react-native";
import PostItemForm from "../../src/components/postItemForm";
import { postStyles } from "../../src/styles/post.styles";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffb71d" }}>
      <View style={postStyles.container}>
        <View style={postStyles.formOverlay}>
          <PostItemForm />
        </View>
      </View>
    </SafeAreaView>
  );
}
