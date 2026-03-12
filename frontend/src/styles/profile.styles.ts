import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { colors } from "./colors";


const { height } = Dimensions.get("window");





export const profile = StyleSheet.create({
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
    backgroundColor: colors.primary01
  },

  ScrollView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
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

  avatarIntitials: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary02,
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
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

























});

