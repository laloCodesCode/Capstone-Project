import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { itemService } from "../../src/services/item";
import { ItemResponse } from "../../src/types/item";
import { colors } from "../../src/styles/colors";

export default function ItemDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {primaryImage && (
        <Image source={{ uri: primaryImage.file_url }} style={styles.image} />
      )}

      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.text}>{item.description}</Text>

        {item.owner && (
          <>
            <Text style={styles.sectionTitle}>Seller</Text>
            <Text style={styles.text}>Name: {item.owner.first_name}</Text>
            <Text style={styles.text}>Email: {item.owner.email}</Text>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background,
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
    backgroundColor: colors.genralWhite,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 260,
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
});