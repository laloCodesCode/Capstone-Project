// interface for uploading item image 
export interface PostItemImage {
  listing_id: string;
  file: any;
  is_primary?: boolean;
}

export interface ItemImageResponse {
  id: string;
  listing_id: string;
  image_url: string;
  is_primary: boolean;
  created_at?: string;
}