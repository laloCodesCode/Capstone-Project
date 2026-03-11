import { StyleSheet } from "react-native"
import { colors } from "./colors"



export const loginStyles = StyleSheet.create({


  //Background
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    gap: 12,
    backgroundColor: colors.background,
  },

  //Login Title 
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary01,
    marginBottom: 8,
  },


  //Smaller text
  subtitle: {
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
