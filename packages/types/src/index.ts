export interface Restaurant {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  phone?: string;
  cuisine?: string;
  rating?: number; // 0..5
  website?: string;
  created_at?: string; // ISO date string (DB)
  updated_at?: string; // ISO date string (DB)
}

export type RestaurantList = Restaurant[];
