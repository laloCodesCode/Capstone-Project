type NotificationItem = {
    id: string;
    user_id: string;
    actor_user_id?: string | null;
    thread_id?: string | null;
    listing_id?: string | null;
    type: string;
    content: string;
    is_read: boolean;
    created_at: string;
    actor_username?: string | null;
    listing_title?: string | null;
    listing_image_url?: string | null;
  };