import * as SecureStore from "expo-secure-store";
import {
  // UserCreate,
  // UserResponse,
  // TokenResponse,
  // MeResponse,
  // PasswordChange,

  UserResponse,
  UserRegister,
  TokenResponse,
  MeResponse,
  MessageResponse,
} from "../types/auth";
import { captureOwnerStack } from "react";

// Untracked env vars this uses my PERSONAL IP
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

////Takes in  email or username and a password to create the bearer token
//export const authService = {
//  // LOGIN LOGIC
//  login: async (identifier: string, password: string): Promise<string> => {
//    console.log("BASE_URL:", BASE_URL); // add this
//    console.log("Attempting login to:", `${BASE_URL}/token`); // add this
//
//    const formData = new URLSearchParams();
//
//    // NOT A JSON obeject, x-www-form-urlencoded
//    formData.append("username", identifier);
//    formData.append("password", password);
//    const res = await fetch(`${BASE_URL}/token`, {
//      method: "POST",
//      headers: { "Content-Type": "application/x-www-form-urlencoded" },
//      body: formData.toString(),
//    });
//
//    if (!res.ok) {
//      const err = await res.json();
//      throw new Error(err.detail || "Login failed");
//    }
//
//    const data: TokenResponse = await res.json();
//    await SecureStore.setItemAsync("token", data.access_token);
//    return data.access_token;
//  },
//
//  // REGISTER LOGIC
//  register: async (userData: UserCreate): Promise<UserResponse> => {
//    // Register USES JSON objects
//    const res = await fetch(`${BASE_URL}/register`, {
//      method: "POST",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify(userData),
//    });
//
//    if (!res.ok) {
//      const err = await res.json();
//      throw new Error(err.detail || "Registration failed");
//    }
//
//    return res.json() as Promise<UserResponse>;
//  },
//
//  // Deletes the cached token
//  logout: async (): Promise<void> => {
//    await SecureStore.deleteItemAsync("token");
//  },
//
//  //Token, hinges on prevoius login to have user logged in on app launch
//  getToken: async (): Promise<string | null> => {
//    return await SecureStore.getItemAsync("token");
//  },
//
//  //Fetch the user profile
//  getME: async (): Promise<MeResponse> => {
//    const token = await SecureStore.getItemAsync("token");
//    console.log("Token for /me request:", token)
//    const res = await fetch(`${BASE_URL}/me`, {
//      method: "GET",
//      headers: {
//        Authorization: `Bearer ${token}`,
//      },
//    });
//    if (res.status == 401) {
//      await SecureStore.deleteItemAsync("token");
//      throw new Error("Session Expired!");
//    }
//    if (!res.ok) {
//      const err = await res.json();
//      throw new Error(err.detail || "Failed to fetch profile");
//    }
//    return res.json() as Promise<MeResponse>;
//  },
//
//
//  //Change the password
//  changePassword: async (payload: PasswordChange): Promise<void> => {
//    const token = await SecureStore.getItemAsync("token");
//
//
//    const res = await fetch(`${BASE_URL}/me/password`, {
//      method: "PUT",
//      headers: {
//        "Content-Type": "application/json",
//        Authorization: `Bearer ${token}`,
//      },
//      body: JSON.stringify(payload),
//    });
//    if (!res.ok) {
//      const err = await res.json();
//      throw new Error(err.detail || "Failed to change password!")
//    }
//  },
//};

//new
export const authService = {
  //Login
  login: async (identifer: string, password: string): Promise<string> => {
    const formData = new URLSearchParams();
    formData.append("username", identifer);
    formData.append("password", password);

    const res = await fetch(`${BASE_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    //User has not clicked the verification link sent to their @uncg.edu inbox
    if (res.status == 403) {
      throw new Error("Please verify your email before logging in!");
    }
    if (res.status === 403) {
      const err = await res.json();
      throw new Error(err.detail || "Your account has been banned");
    }

    //Login may go wrong for whatever reason
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Login Failed!");
    }

    const data: TokenResponse = await res.json();
    await SecureStore.setItem("token", data.access_token);
    return data.access_token;
  },

  //Register a new user to the app
  register: async (userData: UserRegister): Promise<UserResponse> => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    //Registration fails for some reason
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Registration Failed!");
    }

    return res.json() as Promise<UserResponse>;
  },

  //Logout the application
  logout: async (): Promise<void> => {
    await SecureStore.getItemAsync("token");
  },

  //Get the bearer token
  getToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync("token");
  },

  //Get specific user information
  getMe: async (): Promise<MeResponse> => {
    const token = await SecureStore.getItemAsync("token");
    const url = `${BASE_URL}/auth/me`;
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("getMe URL:", url);

    //The session 60 minute was reached
    if (res.status == 401) {
      await SecureStore.deleteItemAsync("token");
      throw new Error("Session Expired!");
    }

    //Failed to laod the user profile -> itermitten error that can occur !!
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to fetch your profile!");
    }

    return res.json() as Promise<MeResponse>;
  },

  //In the case the user needs the verification email resent to their @ucng.edu inbox
  resendVerification: async (): Promise<MessageResponse> => {
    const token = await SecureStore.getItemAsync("token");

    const res = await fetch(`${BASE_URL}/auth/resend-verification`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    //The resend fails
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to resend verification email!");
    }

    return res.json() as Promise<MessageResponse>;
  },
};
