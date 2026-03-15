// interface for posting item
export interface PostItem {
    title: string;
    description: string;
    price: number;
}

export interface ItemImage {
    image_id: string;
    item_listing_id: string;
    file_url: string;
    is_primary: boolean;
    created_at?: string;
  }


export interface ItemResponse {
    item_listing_id: string;
    title: string;
    description: string;
    price: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    user_id: string;
    owner?: ItemOwner;
    images?: ItemImage[];
}

export interface ItemOwner {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}