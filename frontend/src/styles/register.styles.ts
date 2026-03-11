import { StyleSheet, Dimensions } from "react-native";
import { colors } from "./colors";

const { height } = Dimensions.get("window");


export const registerStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.primary01,
  },



  topHalf: {
    height: height * 0.3,
    backgroundColor: colors.primary01,
  },

  bottomHalf: {
    flex: 1,
    backgroundColor: colors.primary02,
  },


  card: {
    // position: "absolute",
    //top: height * 0.15,
    // left: 24,
    // right: 24,
    marginHorizontal: 4,
    backgroundColor: colors.primary01,
    borderRadius: 24,
    padding: 20,
    gap: 14,
    shadowColor: colors.authCardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.genralWhite,
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: colors.registerColor,
    marginBottom: 8,
  },

  inputLabel: {
    fontSize: 12,
    color: colors.registerColor,
    marginBottom: 4,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border01,
    backgroundColor: colors.authCard,
    padding: 14,
    borderRadius: 10,
    fontSize: 15,
    color: colors.genralWhite,

  },


  primaryButton: {
    backgroundColor: colors.primary02,
    padding: 16,
    borderRadius: 10,
    alignItems: "center" as const,
    marginTop: 8,
  },
  primaryButtonText: {
    color: colors.primary01,
    fontWeight: "700",
    fontSize: 16,
  },
  linkButton: {
    alignItems: "center" as const,
    marginTop: 4,
  },

  linkText: {
    color: colors.primary02,
    fontSize: 14,
    fontWeight: "500",
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
  },

  successText: {
    color: colors.sucess,
    fontSize: 14,
  },













});
