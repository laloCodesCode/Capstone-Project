import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import ItemListingCard from "../../src/components/itemListingCard";
import { itemService } from "../../src/services/item";
import { ItemResponse } from "../../src/types/item";
import { postStyles } from "../../src/styles/post.styles";


export default function HomeScreen() {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await itemService.getAllItems();
        setItems(data);
      } catch (err: any) {
        setError(err.message || "Failed to load items");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.item_listing_id}
      renderItem={({ item }) => <ItemListingCard item={item} />}
      ListEmptyComponent={<Text>No items listed yet.</Text>}
    />
  );
}