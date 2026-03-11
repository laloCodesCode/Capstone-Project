import { Dimensions, StyleSheet } from "react-native"
import { colors } from "./colors"


const { height } = Dimensions.get("window");


export const loginStyles = StyleSheet.create({


  //Background
  container: {
    flex: 1,
    // justifyContent: "center",
    // padding: 24,
    // gap: 12,
    backgroundColor: colors.background,
  },


  topHalf: {
    height: height * 0.4,
    backgroundColor: colors.primary01,
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 24,
  },


  bottomHalf: {
    flex: 1,
    backgroundColor: colors.primary02
  },


  //Login Card 
  card: {
    position: "absolute",
    top: height * 0.25,
    left: 24,
    right: 24,
    backgroundColor: colors.primary01,
    borderRadius: 24,
    padding: 28,
    gap: 16,
    shadowColor: colors.authCardShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 10,
    // backgroundColor: colors.authCard,
    // borderRadius: 24,
    // padding: 28,
    // gap: 16,
  },

  //Login Title 
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.genralWhite,
    textAlign: "center",
    marginBottom: 4,
  },


  //Smaller text
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },

  //Input boxs
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: colors.textPrimary

  },

  //Button and their text
  primaryButton: {
    backgroundColor: colors.primary01,
    padding: 14,
    borderRadius: 8,
    alignItems: "center" as const,
    fontWeight: "600",
    fontSize: 16,
  },

  primaryButtonText: {
    color: colors.genralWhite,
    fontWeight: "600",
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



  //Good and Bad
  errorText: {
    color: colors.danger,
    fontSize: 14,
  },

  successText: {
    color: colors.sucess,
    fontSize: 14,
  },










});
