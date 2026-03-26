import type { InboxThread, ChatMessage } from "../types/message";
import { api } from "./api";

export const messageService = {
  getInbox: async (): Promise<InboxThread[]> => {
    const res = await api.get("/messages/inbox");
    return res.data;
  },

  getThreadMessages: async (threadId: string): Promise<ChatMessage[]> => {
    const res = await api.get(`/messages/threads/${threadId}/messages`);
    return res.data;
  },

  sendMessage: async (threadId: string, body: string): Promise<ChatMessage> => {
    const res = await api.post(`/messages/threads/${threadId}/messages`, {
      body,
    });
    return res.data;
  },
};