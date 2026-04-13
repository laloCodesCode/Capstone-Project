import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";

import { itemService } from "../../src/services/item";
import { favoriteService } from "../../src/services/favorite";
import { ItemResponse } from "../../src/types/item";
import { colors } from "../../src/styles/colors";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const { width } = Dimensions.get("window");

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [item, setItem] = useState<ItemResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [threadLoading, setThreadLoading] = useState(false);

  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await SecureStore.getItemAsync("token");
      setToken(savedToken);
    };

    loadToken();
  }, []);

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

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (!id) return;

      try {
        const favorites = await favoriteService.getFavorites();
        const favorited = favorites.some(
          (favorite: any) => favorite.listing_id === id
        );
        setIsFavorited(favorited);
      } catch (err: any) {
        console.log("FAVORITE STATUS ERROR:", err?.message || err);
      }
    };

    loadFavoriteStatus();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!id || favoriteLoading) return;

    try {
      setFavoriteLoading(true);

      if (isFavorited) {
        await favoriteService.removeFavorite(id);
        setIsFavorited(false);
      } else {
        await favoriteService.addFavorite(id);
        setIsFavorited(true);
      }
    } catch (err: any) {
      console.log("FAVORITE TOGGLE ERROR:", err?.message || err);
      setError(err.message || "Failed to update favorite");
    } finally {
      setFavoriteLoading(false);
    }
  };

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

  const imageUrls =
  item.images?.map(
    (img) => `${BASE_URL}/listing-image/${img.id}/download?id=${img.id}`
  ) || [];

const downloadUrl = imageUrls[0] ?? null;

  return (
    <SafeAreaView style = {{flex: 1, backgroundColor: "#0f2044"}}>
      <ScrollView contentContainerStyle={styles.container}>
      {imageUrls.length > 0 && token ? (
  <View>
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={(e) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setActiveIndex(index);
      }}
      scrollEventThrottle={16}
    >
      {imageUrls.map((url, index) => (
        <Image
          key={index}
          source={{
            uri: url,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }}
          style={styles.image}
          resizeMode="cover"
        />
      ))}
    </ScrollView>

    <View style={styles.dotsContainer}>
      {imageUrls.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, activeIndex === index && styles.activeDot]}
        />
      ))}
    </View>
  </View>
) : (
  <Text style={styles.text}>No image available</Text>
)}

      <View style={styles.card}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </View>

          <Pressable
            onPress={handleFavoriteToggle}
            disabled={favoriteLoading}
            style={styles.favoriteButton}
          >
            {favoriteLoading ? (
              <ActivityIndicator size="small" color="#e53935" />
            ) : (
              <Ionicons
                name={isFavorited ? "heart" : "heart-outline"}
                size={30}
                color={isFavorited ? "#e53935" : "#0f2044"}
              />
            )}
          </Pressable>
        </View>

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

      <Pressable style={styles.itemPageButton} onPress={() => router.back()}>
        <Text style={styles.itemPageButtonText}>Go Back</Text>
      </Pressable>
    </ScrollView>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#0f2044",
    flexGrow: 1,
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
    width: width - 40,
    height: 300,
    borderRadius: 12,
    marginRight: 0,
  },
  
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  favoriteButton: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
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
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7a7a7a",
    marginHorizontal: 4,
  },
  
  activeDot: {
    backgroundColor: "#ffffff",
  },
});