import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { colors } from "../styles/colors";
import { itemStyles } from "../styles/item.styles";
import { router } from "expo-router";
import { ItemResponse } from "../types/item";



const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type ItemListingProps = {
  item: ItemResponse
}

export default function ItemListingCard({ item }: ItemListingProps) {
  const [token, setToken] = useState<string | null>(null);

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




  console.log("ITEM CARD RENDERING:", item.title);
  console.log("DOWNLOAD URL:", downloadUrl);
  console.log("item.images:", item.images);
  console.log("primaryImage:", primaryImage);
  console.log("primaryImage object:", primaryImage);
  return (
    <View style={styles.card}>
      {downloadUrl && (
        <Image
          source={{
            uri: downloadUrl,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }}
          style={styles.image}
        />
      )}

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${item.price}</Text>

      {item.seller && (
        <View style={styles.ownerContainer}>
          <Text style={styles.ownerText}>Posted by: {item.seller.username}</Text>
          <Text style={styles.ownerText}>{item.seller.school_email}</Text>
        </View>
      )}

      <Pressable
        style={styles.detailsButton}
        onPress={() => router.push(`/item/${item.id}`)}
      >
        <Text style={styles.detailsButtonText}>View Details</Text>
      </Pressable>




    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffb71d',
    borderRadius: 24,
    padding: 15,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
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
});