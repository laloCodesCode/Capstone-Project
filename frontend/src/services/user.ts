import * as SecureStore from "expo-secure-store";
import { api } from "./api";
import { ItemResponse } from "../types/item";

export type PublicUserProfile = {
  id: string;
  username: string;
  school_email: string;
  profile_image_url?: string | null;
  listings: ItemResponse[];
};

export type ProfileImageUploadResponse = {
  profile_image_url: string;
};

export const userService = {
  getPublicProfile: async (userId: string): Promise<PublicUserProfile> => {
    const res = await api.get(`/users/${userId}/profile`);
    return res.data;
  },

  uploadProfileImage: async (
    formData: FormData
  ): Promise<ProfileImageUploadResponse> => {
    const token = await SecureStore.getItemAsync("token");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const res = await api.post("/users/me/profile-image", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  },
};