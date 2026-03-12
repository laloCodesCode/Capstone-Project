import * as SecureStore from "expo-secure-store";
import { PostItem, ItemResponse } from "../types/item";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const itemService = {

    // Create new item listing
    createItem: async (itemData: PostItem): Promise<ItemResponse> => {
        const token = await SecureStore.getItemAsync("token");

        if (!token) {
            throw new Error("No authentication token found");
        }

        const res = await fetch(`${BASE_URL}/item-listings/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(itemData),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to create item");
        }

        return res.json() as Promise<ItemResponse>;
    },

    // Upload image for item listing
    uploadImage: async (itemId: string,
        imageFile: File | any,
        isPrimary: boolean
    ): Promise<any> => {

        const token = await SecureStore.getItemAsync("token");

        if (!token) {
            throw new Error("No authentication token found");
          }

        const formData = new FormData();
        formData.append("item_listing_id", itemId);
        formData.append("file", imageFile);
        formData.append("is_primary", String(isPrimary));

        const res = await fetch(`${BASE_URL}/item-images/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: formData,
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.detail || "Failed to upload image");
        }

        return res.json();
    },
};
