import * as SecureStore from "expo-secure-store";
import { PostItem, ItemResponse } from "../types/item";
import { ListingUpdate } from "../types/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const itemService = {
  // Create new item listing
  createItem: async (itemData: PostItem): Promise<ItemResponse> => {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await fetch(`${BASE_URL}/listing/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
  uploadImage: async (
    itemId: string,
    imageFile: File | any,
    isPrimary: boolean,
  ): Promise<any> => {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    formData.append("listing_id", itemId);
    formData.append("file", imageFile);
    formData.append("is_primary", String(isPrimary));

    const res = await fetch(`${BASE_URL}/listing-image/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to upload image");
    }

    return res.json();
  },

  getAllItems: async (params?: {
    q?: string;
    category_id?: string;
  }): Promise<ItemResponse[]> => {
    const searchParams = new URLSearchParams();

    if (params?.q && params.q.trim()) {
      searchParams.append("q", params.q.trim());
    }

    if (params?.category_id) {
      searchParams.append("category_id", params.category_id);
    }

    const queryString = searchParams.toString();
    const url = queryString
      ? `${BASE_URL}/listing/?${queryString}`
      : `${BASE_URL}/listing/`;

    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Failed to fetch item listings");
    }

    return res.json() as Promise<ItemResponse[]>;
  },

  // Get item listing by ID
  getItemById: async (itemId: string): Promise<ItemResponse> => {
    const res = await fetch(`${BASE_URL}/listing/${itemId}/`, {
      method: "GET",
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to fetch item listing");
    }

    return res.json() as Promise<ItemResponse>;
  },

  // Get item listings for current user
  getMyItems: async (): Promise<ItemResponse[]> => {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await fetch(`${BASE_URL}/listing/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to fetch your item listings");
    }

    return res.json() as Promise<ItemResponse[]>;
  },

  //For updating and already listed item
  updateItem: async (
    itemId: string,
    payload: ListingUpdate,
  ): Promise<ItemResponse> => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      throw new Error("No authentication token found!");
    }
    const res = await fetch(`${BASE_URL}/listing/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to update item!");
    }
    return res.json() as Promise<ItemResponse>;
  },

  //For deleteing an already listed litem
  deleteItem: async (itemId: string): Promise<void> => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      throw new Error("No authentication token found!");
    }
    const res = await fetch(`${BASE_URL}/listing/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer${token}`,
      },
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to delete item!");
    }
  },
};

