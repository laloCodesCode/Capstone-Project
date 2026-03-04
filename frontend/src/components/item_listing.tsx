import React, { useEffect, useState} from "react";
import { View, Text, FlatList, StyleSheet, Image} from "react-native";

import { ItemListing} from "../types/item_listing";
import { fetchItemListings } from "../services/api";

import { api } from "../services/api";

export default function ItemListingScreen() {
    const [itemListings, setItemListings] = useState<ItemListing[]>([]);

    useEffect(() => {
        const loadItemListings = async () => {
            try {
                const listings = await fetchItemListings(); 
                setItemListings(listings);
            } catch (error) {
                console.error("Error fetching item listings:", error);
            }
        };
    
        loadItemListings();
    }, []);

    const renderItem = ({ item }: { item: ItemListing }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.images[0].url }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={itemListings}
                renderItem={renderItem}
                keyExtractor={(item) => item.item_listing_id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    itemContainer: {
        flexDirection: "row",
        marginBottom: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        elevation: 2,
    },
    itemImage: {
        width: 100,
        height: 100,
    },
    itemDetails: {
        flex: 1,
        padding: 8,
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    itemPrice: {
        fontSize: 16,
        color: "#888",
        marginVertical: 4,
    },
    itemDescription: {
        fontSize: 14,
        color: "#555",
    },
});