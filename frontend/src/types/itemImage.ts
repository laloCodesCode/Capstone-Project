// interface for uploading item image 
export interface PostItemImage {
    id: string;
    file: File;
    is_primary?: boolean;
  }

export interface ItemImageResponse {
    id: string;
    listing_id: string;
    image_url: string;
    is_primary: boolean;
    created_at?: string;
}