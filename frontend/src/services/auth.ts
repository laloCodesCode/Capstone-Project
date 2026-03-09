import * as SecureStore from "expo-secure-store";
import { UserCreate, UserResponse, TokenResponse } from "../types/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const authService = {
  login: async (identifier: string, password: string): Promise<string> => {
    const formData = new URLSearchParams();
    formData.append("username", identifier);
    formData.append("password", password);

    const res = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Login failed");
    }

    const data: TokenResponse = await res.json();
    await SecureStore.setItemAsync("token", data.access_token);
    return data.access_token;
  },

  register: async (userData: UserCreate): Promise<UserResponse> => {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Registration failed");
    }

    return res.json() as Promise<UserResponse>;
  },

  logout: async (): Promise<void> => {
    await SecureStore.deleteItemAsync("token");
  },

  getToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync("token");
  },
};