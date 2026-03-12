// interface for posting item
export interface PostItem {
    title: string;
    description: string;
    price: number;
}


export interface ItemResponse {
    item_listing_id: string;
    title: string;
    description: string;
    price: number;
    created_at: string;
    updated_at: string;
    user_id: string;
}