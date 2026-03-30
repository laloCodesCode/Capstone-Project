export type InboxThread = {
    id: string;
    other_user_id: string;
    other_user_name: string;
    listing_id: string;
    last_message: string | null;
    last_message_at: string | null;
    last_message_user_id?: string;
    unread_count: number;
    listing_image_url: string | null;
    listing_title?: string | null;
  };
  
  export type ChatMessage = {
    id: string;
    thread_id: string;
    message_user: string;
    body: string;
    created_at: string;
  };