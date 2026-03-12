// interface for uploading item image 
export interface PostItemImage {
    item_listing_id: string;
    file: File;
    is_primary?: boolean;
  }

export interface ItemImageResponse {
    image_id: string;
    item_listing_id: string;
    file_url: string;
    is_primary: boolean;
}