import * as SecureStore from "expo-secure-store";
import {
  AdminUser,
  AdminMessageResponse,
  ListingResponse,
  ReviewResponse,
} from "../types/auth";

// const BASE_URL = process.env.EXPO_BASE_URL;
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

//fetch the auth header
const getAuthHeaders = async () => {
  const token = await SecureStore.getItemAsync("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

//admin user service begins
export const adminService = {
  //admin fetches all users
  getUsers: async (): Promise<AdminUser[]> => {
    const headers = await getAuthHeaders();
    const url = `${BASE_URL}/admin/users`;
    console.log("getUsers URL:", url);
    const res = await fetch(`${BASE_URL}/admin/users`, { headers });
    console.log("getUsers status:", res.status);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to fetch users!");
    }
    return res.json();
  },

  //admin fetches ONE speciofic user
  getUser: async (userId: string): Promise<AdminUser> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/admin/users/${userId}`, { headers });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to fetch user");
    }
    return res.json();
  },

  //Make an admin
  makeAdmin: async (userId: string): Promise<AdminMessageResponse> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/admin/users/${userId}/make-admin`, {
      method: "PATCH",
      headers,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to make user admin");
    }
    return res.json();
  },

  //Ban a user
  banUser: async (userId: string): Promise<AdminMessageResponse> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/admin/users/${userId}/ban`, {
      method: "PATCH",
      headers,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to ban user");
    }
    return res.json();
  },

  //Unban a user
  unbanUser: async (userId: string): Promise<AdminMessageResponse> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/admin/users/${userId}/unban`, {
      method: "PATCH",
      headers,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to unban user");
    }
    return res.json();
  },

  //admin fetches lsitings and deletes
  deleteListing: async (listingId: string): Promise<AdminMessageResponse> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/admin/listings/${listingId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to delete listing");
    }
    return res.json();
  },

  //admin deletes a review
  deleteReview: async (reviewId: string): Promise<AdminMessageResponse> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/admin/reviews/${reviewId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to delete review");
    }
    return res.json();
  },

  //admin deletes a listing image
  deleteListingImage: async (
    imageId: string,
  ): Promise<AdminMessageResponse> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/admin/listing-images/${imageId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to delete listing image");
    }
    return res.json();
  },

  //listings
  getListings: async (): Promise<ListingResponse[]> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/listing/`, { headers });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to fetch listings");
    }
    return res.json();
  },

  // Reviews for a specific user
  getReviewsForUser: async (userId: string): Promise<ReviewResponse[]> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/review/user/${userId}`, { headers });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to fetch reviews");
    }
    return res.json();
  },
};
