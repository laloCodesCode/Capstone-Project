import { StyleSheet, Dimensions } from "react-native";
import { colors } from "./colors";

const { height } = Dimensions.get("window");

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary02,
  },

  topHalf: {
    height: 0,
    backgroundColor: colors.primary02,
  },

  bottomHalf: {
    flex: 1,
    backgroundColor: colors.primary02,
  },

  scrollView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1,
  },

  scrollContent: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: 0,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 24,
  },

  avatarCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.primary02,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.genralWhite,
  },

  avatarInitials: {
    fontSize: 30,
    fontWeight: "bold",
    color: colors.primary01,
  },

  avatarName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: colors.genralWhite,
  },

  avatarUsername: {
    fontSize: 14,
    color: colors.registerColor,
    marginTop: 4,
  },

  card: {
    backgroundColor: colors.primary01,
    borderRadius: 24,
    padding: 24,
    gap: 16,
    marginHorizontal: 8,
    shadowColor: colors.authCardShadow,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary02,
    marginBottom: 4,
  },

  infoRow: {
    gap: 4,
  },

  infoLabel: {
    fontSize: 11,
    color: colors.registerColor,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  infoValue: {
    fontSize: 16,
    color: colors.genralWhite,
    fontWeight: "500",
  },

  inputLabel: {
    fontSize: 12,
    color: colors.registerColor,
    marginBottom: 4,
  },

  input: {
    backgroundColor: colors.authCard,
    borderWidth: 1,
    borderColor: colors.border01,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: colors.genralWhite,
  },

  primaryButton: {
    backgroundColor: colors.primary02,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },

  primaryButtonText: {
    color: colors.primary01,
    fontWeight: "700",
    fontSize: 15,
  },

  dangerButton: {
    backgroundColor: colors.danger,
    borderWidth: 1,
    borderColor: colors.danger,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },

  dangerButtonText: {
    color: colors.danger,
    fontWeight: "600",
    fontSize: 15,
  },

  errorText: {
    color: colors.danger,
    fontSize: 13,
  },

  successText: {
    color: colors.success,
    fontSize: 13,
  },

  divider: {
    height: 1,
    backgroundColor: "#1a3158",
    marginVertical: 4,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary02,
  },
});