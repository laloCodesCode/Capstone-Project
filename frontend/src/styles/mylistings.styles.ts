import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const myListingsStyles = StyleSheet.create({
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
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.genralWhite,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#2d4f8a",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.genralWhite,
  },
  price: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary02,
  },
  detail: {
    fontSize: 13,
    color: "#a0aec0",
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
  editButton: {
    backgroundColor: colors.primary02,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: colors.primary01,
    fontWeight: "700",
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: colors.genralWhite,
    fontWeight: "700",
    fontSize: 12,
  },
  cancelButton: {
    backgroundColor: "#2d4f8a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: {
    color: colors.genralWhite,
    fontWeight: "700",
    fontSize: 12,
  },
  saveButton: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveButtonText: {
    color: colors.genralWhite,
    fontWeight: "700",
    fontSize: 12,
  },
  input: {
    backgroundColor: "#0f2044",
    borderWidth: 1,
    borderColor: "#2d4f8a",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: colors.genralWhite,
  },
  inputLabel: {
    fontSize: 11,
    color: "#a0aec0",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    color: "#a0aec0",
    fontSize: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
