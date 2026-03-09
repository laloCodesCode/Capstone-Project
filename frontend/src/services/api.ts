import axios from "axios";
import * as SecureStore from "expo-secure-store";
// import { ItemListing } from "../types/item_listing";

export const api = axios.create({
  //Use the env specific to your local environment
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000,
});

// export const fetchItemListings = async (): Promise<ItemListing[]> => {
//   try {
//     const response = await api.get<ItemListing[]>("/items/");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching item listings:", error);
//     throw error;
//   }
// };

// attach the bearer token to the every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// handel the token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("token");
    }
    return Promise.reject(error);
  },
);
