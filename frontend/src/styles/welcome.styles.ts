import { StyleSheet, Dimensions } from "react-native";
import { colors } from "./colors";

const { height } = Dimensions.get("window");

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary01,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary02,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: colors.primary02,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.primary01,
  },
  appName: {
    fontSize: 42,
    fontWeight: "bold",
    color: colors.genralWhite,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: colors.primary02,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  university: {
    fontSize: 14,
    color: colors.registerColor,
    marginTop: 4,
  },
  footer: {
    position: "absolute",
    bottom: 60,
  },
  footerText: {
    color: colors.registerColor,
    fontSize: 13,
  },
});
