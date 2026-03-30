import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { itemService } from "../../src/services/item";
import { ItemResponse } from "../../src/types/item";
import { colors } from "../../src/styles/colors";
import { router } from "expo-router";


const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [item, setItem] = useState<ItemResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [threadLoading, setThreadLoading] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await SecureStore.getItemAsync("token");
      setToken(savedToken);
    };

    loadToken();
  }, []);


  const createThread = async () => {
    try {
      if (!item) return;

      setThreadLoading(true);
      setError("");

      const savedToken = await SecureStore.getItemAsync("token");
      if (!savedToken) {
        throw new Error("You must be logged in to contact the seller.");
      }

      const response = await fetch(`${BASE_URL}/messages/threads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${savedToken}`,
        },
        body: JSON.stringify({
          listing_id: item.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create thread");
      }

      router.push({
        pathname: "/chat/[id]",
        params: {
          id: data.id,
          name: item.seller?.username ?? "Chat",
          listingId: item.id,
          listingTitle: item.title,
          listingImageUrl: downloadUrl ?? "",
        },
      });
    } catch (err: any) {
      console.error("Error creating thread:", err);
      setError(err.message || "Could not start conversation");
    } finally {
      setThreadLoading(false);
    }
  };



  useEffect(() => {
    const loadItem = async () => {
      try {
        setLoading(true);
        setError("");

        if (!id) {
          throw new Error("Missing item ID");
        }

        const data = await itemService.getItemById(id);
        setItem(data);
      } catch (err: any) {
        console.error("Error loading item details:", err);
        setError(err.message || "Failed to load item details");
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary01} />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "Item not found"}</Text>
      </View>
    );
  }

  const primaryImage =
    item.images?.find((img) => img.is_primary) || item.images?.[0];

  const downloadUrl =
    primaryImage
      ? `${BASE_URL}/listing-image/${primaryImage.id}/download?id=${primaryImage.id}`
      : null;

  console.log("TOKEN:", token);
  console.log("DOWNLOAD URL:", downloadUrl);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {downloadUrl && token ? (
        <Image
          source={{
            uri: downloadUrl,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <Text style={styles.text}>No image available</Text>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>

        <Text style={styles.sectionTitle}>Item Information:</Text>
        <Text style={styles.text}>Description: {item.description}</Text>
        <Text style={styles.text}>Condition: {item.condition}</Text>
        <Text style={styles.text}>Located at: {item.location}</Text>



        {item.seller && (
          <>
            <Text style={styles.sectionTitle}>Seller</Text>
            <Text style={styles.text}>Name: {item.seller.username}</Text>
            <Text style={styles.text}>Email: {item.seller.school_email}</Text>
          </>
        )}

        <TouchableOpacity
          style={styles.contactButton}
          onPress={createThread}
          disabled={threadLoading}
        >
          {threadLoading ? (
            <ActivityIndicator color={colors.genralWhite} />
          ) : (
            <Text style={styles.contactButtonText}>Contact Seller</Text>
          )}
        </TouchableOpacity>

      </View>

      <Pressable
        style={styles.itemPageButton}
        onPress={() => router.back()}
      >
        <Text style={styles.itemPageButtonText}>Go Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#0f2044",
    flexGrow: 1,
    marginTop: 70,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 20,
  },
  card: {
    backgroundColor: "#ffb71d",
    borderRadius: 12,
    padding: 16,
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary01,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 12,
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  errorText: {
    color: colors.danger,
    textAlign: "center",
    fontSize: 16,
  },
  itemPageButton: {
    marginTop: 30,
    backgroundColor: colors.primary01,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  itemPageButtonText: {
    color: colors.genralWhite,
    fontSize: 16,
    fontWeight: "600",
  },

  contactButton: {
    marginTop: 20,
    backgroundColor: colors.primary01,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },

  contactButtonText: {
    color: colors.primary02,
    fontSize: 16,
    fontWeight: "600",
  },
});