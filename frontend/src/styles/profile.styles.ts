import { StyleSheet, Dimensions, ScrollView, ImageBackgroundComponent } from "react-native";
import { colors } from "./colors";
import { Background } from "@react-navigation/elements";


const { height } = Dimensions.get("window");





export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary01
  },


  topHalf: {
    height: height * 0.3,
    backgroundColor: colors.primary01
  },


  bottomHalf: {
    flex: 1,
    backgroundColor: colors.primary02
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
    paddingTop: height * 0.08,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },



  //profile/avatar
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary02,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderBlockColor: colors.genralWhite,
  },

  // avatarIntitials: {
  //   fontSize: 32,
  //   fontWeight: "bold",
  //   color: colors.primary02,
  // },
  avatarInitials: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary01,
  },

  avatarName: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "700",
    color: colors.genralWhite,
  },

  avatarUsername: {
    fontSize: 14,
    color: colors.registerColor,
    marginTop: 4,
  },




  //Other stuff
  card: {
    backgroundColor: colors.primary01,
    borderRadius: 24,
    padding: 24,
    gap: 16,
    marginHorizontal: 8,
    shadowColor: colors.authCardShadow,
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.3,
    // shadowRadius: 12,
    // elevation: 10,
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

  divder: {
    height: 1,
    backgroundColor: colors.authCard,
    marginVertical: 4,
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
    alignItems: "center" as const,
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
    alignItems: "center" as const,
    marginTop: 4,
  },


  dangerButtonText: {
    color: colors.danger,
    fontWeight: "600",
    fontSize: 15,
  },


  errorText: {
    color: colors.danger,
    fontSize: 13
  },

  successText: {
    color: colors.success,
    fontSize: 13,
  },



























});

