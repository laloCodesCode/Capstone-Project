import { View } from "react-native";
import PostItemForm from "../../src/components/postItemForm";
import { postStyles } from "../../src/styles/post.styles";
import { SafeAreaView } from "react-native-safe-area-context";


export default function PostScreen() {
  return (
    < SafeAreaView style={{ flex: 1, backgroundColor: "#0f2044", }}>
    <View style={postStyles.container}>
      <View style={postStyles.topHalf} />
      <View style={postStyles.bottomHalf} />

      <View style={postStyles.formOverlay}>
        <PostItemForm />
      </View>
    </View>
    </SafeAreaView>
  );
}