import { CategoryResponse } from "../types/category";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const categoryService = {
  getAllCategories: async (): Promise<CategoryResponse[]> => {
    const res = await fetch(`${BASE_URL}/categories/`, {
      method: "GET",
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || "Failed to fetch categories");
    }

    return res.json() as Promise<CategoryResponse[]>;
  },
};