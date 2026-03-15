import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { colors } from "../styles/colors";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

type ItemListingProps = {
  item: {
    item_listing_id: string;
    title: string;
    description: string;
    price: number | string;
    owner?: {
      first_name: string;
      email: string;
    };
    images?: {
      image_id: string;
      item_listing_id: string;
      file_url: string;
      is_primary: boolean;
    }[];
  };
};

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
      ? `${BASE_URL}/item-images/${primaryImage.image_id}/download?item_listing_id=${primaryImage.item_listing_id}`
      : null;

  console.log("ITEM CARD RENDERING:", item.title);
  console.log("DOWNLOAD URL:", downloadUrl);

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

      {item.owner && (
        <View style={styles.ownerContainer}>
          <Text style={styles.ownerText}>Posted by: {item.owner.first_name}</Text>
          <Text style={styles.ownerText}>{item.owner.email}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.genralWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
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
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  ownerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});