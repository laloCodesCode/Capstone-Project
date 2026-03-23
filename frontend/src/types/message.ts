export type InboxThread = {
    id: string,
    other_user_id: string;
    other_user_name: string;
    listing_id: string;
    last_message: string | null;
    last_message_at: string | null;
    unread_count: number;
}