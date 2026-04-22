// import React, { useEffect, useState } from "react";
// import { Image, StyleSheet, Text, View, Pressable } from "react-native";
// import * as SecureStore from "expo-secure-store";
// import { colors } from "../styles/colors";
// import { itemStyles } from "../styles/item.styles";
// import { router } from "expo-router";
// import { ItemResponse } from "../types/item";

// const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// type ItemListingProps = {
//   item: ItemResponse
// }

// export default function ItemListingCard({ item }: ItemListingProps) {
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const loadToken = async () => {
//       const savedToken = await SecureStore.getItemAsync("token");
//       setToken(savedToken);
//     };

//     loadToken();
//   }, []);

//   const primaryImage =
//     item.images?.find((img) => img.is_primary) || item.images?.[0];

//   const downloadUrl =
//     primaryImage && token
//       ? `${BASE_URL}/listing-image/${primaryImage.id}/download`
//       : null;

//   console.log("ITEM CARD RENDERING:", item.title);
//   console.log("DOWNLOAD URL:", downloadUrl);
//   console.log("item.images:", item.images);
//   console.log("primaryImage:", primaryImage);
//   console.log("primaryImage object:", primaryImage);
//   return (
//     <View style={styles.card}>
//       {downloadUrl && (
//         <Image
//           source={{
//             uri: downloadUrl,
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }}
//           style={styles.image}
//         />
//       )}

//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.description}>{item.description}</Text>
//       <Text style={styles.price}>${item.price}</Text>

//       {item.seller && (
//         <View style={styles.ownerContainer}>
//           <Text style={styles.ownerText}>Posted by: {item.seller.username}</Text>
//           <Text style={styles.ownerText}>{item.seller.school_email}</Text>
//         </View>
//       )}

//       <Pressable
//         style={styles.detailsButton}
//         onPress={() => router.push(`/item/${item.id}`)}
//       >
//         <Text style={styles.detailsButtonText}>View Details</Text>
//       </Pressable>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     width: "48%",
//     marginBottom: 12,
//     backgroundColor: "#ffb71d",
//     borderRadius: 12,
//     padding: 12,
//   },
//   image: {
//     width: "100%",
//     height: 300,
//     borderRadius: 10,
//     marginBottom: 12,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: colors.textPrimary,
//     marginBottom: 6,
//   },
//   description: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginBottom: 8,
//   },
//   price: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: colors.primary01,
//     marginBottom: 10,
//   },
//   ownerContainer: {
//     borderTopWidth: 1,
//     borderTopColor: "#0f2044",
//     paddingTop: 8,
//   },
//   ownerText: {
//     fontSize: 13,
//     color: colors.textSecondary,
//   },

//   detailsButton: {
//     marginTop: 12,
//     backgroundColor: colors.primary01,
//     paddingVertical: 10,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   detailsButtonText: {
//     color: "#fff",
//     fontWeight: "600",
//   },
// });
//
//
//
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { colors } from "../styles/colors";
import { router } from "expo-router";
import { ItemResponse } from "../types/item";
import { reportService } from "../services/report";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type ItemListingProps = {
  item: ItemResponse;
};

export default function ItemListingCard({ item }: ItemListingProps) {
  const [token, setToken] = useState<string | null>(null);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await SecureStore.getItemAsync("token");
      setToken(savedToken);
    };
    loadToken();
  }, []);

  const primaryImage =
    item.images?.find((img) => img.is_primary) || item.images?.[0];

  const downloadUrl =
    primaryImage && token
      ? `${BASE_URL}/listing-image/${primaryImage.id}/download`
      : null;

  const handleLongPress = () => {
    setReportModalVisible(true);
  };

  const handleSubmitReport = async () => {
    if (!reportReason.trim()) {
      Alert.alert("Error", "Please provide a reason for the report");
      return;
    }
    try {
      setReportLoading(true);
      await reportService.submitReport({
        listing_id: item.id,
        reason: reportReason.trim(),
      });
      setReportModalVisible(false);
      setReportReason("");
      Alert.alert(
        "Report Submitted",
        "Thank you for your report. We will review it shortly.",
      );
    } catch (e: unknown) {
      Alert.alert(
        "Error",
        e instanceof Error ? e.message : "Failed to submit report",
      );
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <>
      <Pressable
        style={styles.card}
        onLongPress={handleLongPress}
        delayLongPress={500}
      >
        {downloadUrl && (
          <Image
            source={{
              uri: downloadUrl,
              headers: { Authorization: `Bearer ${token}` },
            }}
            style={styles.image}
          />
        )}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>${item.price}</Text>
        {item.seller && (
          <View style={styles.ownerContainer}>
            <Text style={styles.ownerText}>
              Posted by: {item.seller.username}
            </Text>
            <Text style={styles.ownerText}>{item.seller.school_email}</Text>
          </View>
        )}
        <Pressable
          style={styles.detailsButton}
          onPress={() => router.push(`/item/${item.id}`)}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
        </Pressable>
      </Pressable>

      {/* Report Modal */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Report Listing</Text>
            <Text style={styles.modalSubtitle}>Reporting: {item.title}</Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Describe the issue..."
              placeholderTextColor="#a0aec0"
              multiline
              numberOfLines={4}
              value={reportReason}
              onChangeText={setReportReason}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setReportModalVisible(false);
                  setReportReason("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmitReport}
                disabled={reportLoading}
              >
                {reportLoading ? (
                  <ActivityIndicator color={colors.primary01} size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Submit Report</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    marginBottom: 12,
    backgroundColor: "#ffb71d",
    borderRadius: 12,
    padding: 12,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary01,
    marginBottom: 10,
  },
  ownerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#0f2044",
    paddingTop: 8,
  },
  ownerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailsButton: {
    marginTop: 12,
    backgroundColor: colors.primary01,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: colors.primary01,
    borderRadius: 16,
    padding: 24,
    width: "100%",
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary02,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#a0aec0",
  },
  modalInput: {
    backgroundColor: "#1a3158",
    borderWidth: 1,
    borderColor: "#2d4f8a",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#ffffff",
    height: 100,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#2d4f8a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary02,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: colors.primary01,
    fontWeight: "700",
  },
});
