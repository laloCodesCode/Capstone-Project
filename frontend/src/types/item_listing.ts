import axios from "axios"
import { api } from "../services/api";

export interface ItemListing {
    item_listing_id: string,
    user_id: string,
    title: string,
    description: string,
    price: number,
    created_at: string,
    is_active: boolean
    images: ItemImage[];
};

export interface ItemImage {
    image_id: string;
    url: string;
    is_primary: boolean;
  }