import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const adminStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary01,
  },
  header: {
    backgroundColor: colors.primary02,
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary01,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.primary01,
    opacity: 0.7,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#1a3158",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.genralWhite,
  },
  email: {
    fontSize: 13,
    color: "#a0aec0",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeAdmin: {
    backgroundColor: colors.primary02,
  },
  badgeBanned: {
    backgroundColor: colors.danger,
  },
  badgeUnverified: {
    backgroundColor: "#6b7280",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.primary01,
  },
  badgeTextLight: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.genralWhite,
  },
  divider: {
    height: 1,
    backgroundColor: "#2d4f8a",
    marginVertical: 4,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  makeAdminButton: {
    backgroundColor: colors.primary02,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  makeAdminButtonText: {
    color: colors.primary01,
    fontWeight: "700",
    fontSize: 12,
  },
  banButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  banButtonText: {
    color: colors.genralWhite,
    fontWeight: "700",
    fontSize: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary01,
    gap: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
  },
  retryText: {
    color: colors.primary02,
    fontSize: 14,
    fontWeight: "600",
  },
});
