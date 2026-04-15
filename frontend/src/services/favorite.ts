import { api } from "./api";

export type FavoriteResponse = {
  id: string;
  listing_id: string;
  user_id: string;
  created_at: string;
};

export const favoriteService = {
  addFavorite: async (listingId: string): Promise<FavoriteResponse> => {
    const res = await api.post(`/favorites/${listingId}`);
    return res.data;
  },

  removeFavorite: async (listingId: string): Promise<{ message: string }> => {
    const res = await api.delete(`/favorites/${listingId}`);
    return res.data;
  },

  getFavorites: async () => {
    const res = await api.get("/favorites/");
    return res.data;
  },
};