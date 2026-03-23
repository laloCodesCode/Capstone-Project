import { InboxThread } from "../types/message";
import { api } from "./api";

export const messageService = {
    getInbox: async (): Promise<InboxThread[]> => {
        const res = await api.get("/messages/inbox")
        return res.data
    }
}