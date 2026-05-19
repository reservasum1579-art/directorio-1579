export type MarketplacePostStatus = 'pending' | 'approved' | 'rejected' | 'sold' | 'paused' | 'archived';

export interface MarketplaceImage {
  id: string;
  post_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface MarketplaceReview {
  id: string;
  post_id: string;
  reviewer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface MarketplacePost {
  id: string;
  building_id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number | null;
  category: string | null;
  is_service: boolean;
  status: MarketplacePostStatus;
  moderated_by: string | null;
  moderated_at: string | null;
  created_at: string;
  updated_at: string;

  // Joined properties
  profiles?: {
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  marketplace_images?: MarketplaceImage[];
  marketplace_reviews?: MarketplaceReview[];
}
