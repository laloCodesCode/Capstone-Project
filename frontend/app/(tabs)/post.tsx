import { View } from "react-native";
import PostItemForm from "../../src/components/postItemForm";
import { postStyles } from "../../src/styles/post.styles";

export default function PostScreen() {
  return (
    <View style={postStyles.container}>
      <View style={postStyles.topHalf} />
      <View style={postStyles.bottomHalf} />

      <View style={postStyles.formOverlay}>
        <PostItemForm />
      </View>
    </View>
  );
}