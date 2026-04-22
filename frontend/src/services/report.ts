import * as SecureStore from "expo-secure-store";
import { ReportCreate, ReportResponse } from "../types/auth";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const getAuthHeaders = async () => {
  const token = await SecureStore.getItemAsync("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const reportService = {
  submitReport: async (payload: ReportCreate): Promise<ReportResponse> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/report/`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to submit report");
    }
    return res.json();
  },

  getReports: async (): Promise<ReportResponse[]> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/report/`, { headers });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to fetch reports");
    }
    return res.json();
  },

  deleteReport: async (reportId: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}/report/${reportId}`, {
      method: "DELETE",
      headers,
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to delete report");
    }
  },
};
