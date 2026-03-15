import { useEffect, useRef } from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { colors } from "../../src/styles/colors";
import { welcomeStyles } from "../../src/styles/welcome.styles";

export default function WelcomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => {
    router.replace("/(auth)/login");
  };

  return (
    <TouchableOpacity
      style={welcomeStyles.container}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          welcomeStyles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={welcomeStyles.logoCircle}>
          <Text style={welcomeStyles.logoText}>GM</Text>
        </View>

        <Text style={welcomeStyles.appName}>GenieMart</Text>
        <Text style={welcomeStyles.tagline}>Shop local. Shop Spartan.</Text>
        {/* <Text style={welcomeStyles.university}>UNCG Spartans 🏆</Text> */}
      </Animated.View>

      <Animated.View style={[welcomeStyles.footer, { opacity: fadeAnim }]}>
        <Text style={welcomeStyles.footerText}>Tap anywhere to continue</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
