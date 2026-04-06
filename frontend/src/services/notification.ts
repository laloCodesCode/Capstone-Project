import { api } from "./api";

export const notificationService = {
  getUnreadCount: async (): Promise<number> => {
    const res = await api.get("/notification/unread-count");
    return res.data.unread_count;
  },

  getNotifications: async () => {
    const res = await api.get("/notification/");
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await api.patch("/notification/read-all");
    return res.data;
  },
};