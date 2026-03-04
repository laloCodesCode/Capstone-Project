import axios from "axios";
import { ItemListing } from "../types/item_listing";

export const api = axios.create({
    baseURL: "http://127.0.0.1:8000", 
    timeout: 10000,
  });

  export const fetchItemListings = async (): Promise<ItemListing[]> => {
    try {
      const response = await api.get<ItemListing[]>("/items/");
      return response.data;
    } catch (error) {
      console.error("Error fetching item listings:", error);
      throw error;
    }
  };