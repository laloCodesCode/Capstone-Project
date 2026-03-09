import * as SecureStore from "expo-secure-store";
import { UserCreate, UserResponse, TokenResponse } from "../types/auth";

// Untracked env vars this uses my PERSONAL IP
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

//Takes in  email or username and a password to create the bearer token
export const authService = {
  // LOGIN LOGIC
  login: async (identifier: string, password: string): Promise<string> => {
    const formData = new URLSearchParams();

    // NOT A JSON obeject, x-www-form-urlencoded
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

  // REGISTER LOGIC
  register: async (userData: UserCreate): Promise<UserResponse> => {
    // Register USES JSON objects
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

  // Deletes the cached token
  logout: async (): Promise<void> => {
    await SecureStore.deleteItemAsync("token");
  },

  //Token, hinges on prevoius login to have user logged in on app launch
  getToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync("token");
  },
};
