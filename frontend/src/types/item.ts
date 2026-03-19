// interface for posting item
export interface PostItem {
    title: string;
    description: string;
    price: number;
    condition: string;
    status?: string;
    location: string;
    category_id: string;
    created_at?: string;

}

export interface ItemOwner {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}


export interface ItemImage {
    id: string;
    listing_id: string;
    image_url: string;
    is_primary: boolean;
    created_at?: string;
  }


export interface ItemResponse {
    id: string;
    title: string;
    description: string;
    price: number;
    condition: string;
    status: string;
    location: string;
    category_id: string | null;
    created_at: string;
    updated_at: string;
    seller_id: string;
    owner?: ItemOwner;
    images?: ItemImage[];
    category?: {
    id: string;
    name: string;
  };
}

