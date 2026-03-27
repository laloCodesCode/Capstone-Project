import { StyleSheet, Dimensions } from "react-native";
import { colors } from "./colors";

const { height } = Dimensions.get("window");

export const postStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  topHalf: {
    height: height * 0.3,
    backgroundColor: colors.primary01,
  },

  bottomHalf: {
    flex: 1,
    backgroundColor: colors.primary02,
  },

  formOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: height * 0.18,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: colors.primary01,
    borderRadius: 24,
    padding: 28,
    gap: 16,
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
    marginBottom: 4,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.authCard,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: colors.genralWhite,
  },

  descriptionInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },

  imagePreview: {
    width: 200,
    height: 200,
    alignSelf: "center",
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 8,
  },

  primaryButton: {
    backgroundColor: colors.primary02,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  primaryButtonText: {
    color: colors.primary01,
    fontWeight: "600",
    fontSize: 16,
  },

  secondaryButton: {
    backgroundColor: colors.border01,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  secondaryButtonText: {
    color: colors.genralWhite,
    fontWeight: "600",
    fontSize: 16,
  },

  errorText: {
    color: colors.danger,
    fontSize: 14,
  },

  successText: {
    color: colors.success,
    fontSize: 14,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.authCard,
    borderRadius: 8,
    //overflow: "hidden",
    marginBottom: 12,
  },
  
  picker: {
    color: colors.genralWhite,
    width: "100%",
  },


  label: {
    fontSize: 17,
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
});