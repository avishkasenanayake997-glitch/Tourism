// ==============================================================================
// Lankora: Core Domain Types
// ==============================================================================

export type TargetType = 'destination' | 'place' | 'experience' | 'restaurant' | 'stay';

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  travel_preferences: {
    travel_style: string[];
    pace: 'Relaxed' | 'Moderate' | 'Intensive';
    dietary: string[];
  };
  home_country?: string;
  created_at?: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  province: string;
  district: string;
  latitude: number;
  longitude: number;
  hero_image: string;
  gallery: string[];
  best_time_to_visit: string;
  estimated_budget: string;
  category: 'Hill Country' | 'Southern Coast' | 'Cultural Triangle' | 'Wildlife Safari' | 'Eastern Coast' | 'Northern Heritage';
  highlights: string[];
  vibe_tags: string[];
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_hidden_gem: boolean;
}

export interface Place {
  id: string;
  destination_id: string;
  name: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  images: string[];
  category: 'Heritage' | 'Viewpoint' | 'Nature' | 'Sacred Site' | 'Beach';
  opening_hours: string;
  entry_fee: string;
  tips?: string;
  rating: number;
  review_count: number;
}

export interface Experience {
  id: string;
  destination_id: string;
  title: string;
  description: string;
  category: 'Adventure' | 'Wildlife' | 'Culture' | 'Culinary' | 'Wellness' | 'Surfing';
  duration: string;
  price: string;
  images: string[];
  location: string;
  host_name?: string;
  inclusions: string[];
  rating: number;
  review_count: number;
}

export interface Restaurant {
  id: string;
  destination_id: string;
  name: string;
  description: string;
  cuisine: string;
  price_range: '$' | '$$' | '$$$';
  location: string;
  latitude?: number;
  longitude?: number;
  must_try: string[];
  images: string[];
  rating: number;
  review_count: number;
}

export interface Stay {
  id: string;
  destination_id: string;
  name: string;
  description: string;
  type: 'Eco-Lodge' | 'Colonial Villa' | 'Boutique Hotel' | 'Beach Resort';
  price_range: string;
  amenities: string[];
  images: string[];
  rating: number;
  review_count: number;
  location: string;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  target_type: TargetType;
  target_id: string;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  target_type: TargetType;
  target_id: string;
  created_at: string;
  item?: Destination | Place | Experience | Restaurant | Stay;
}

export interface ItineraryItem {
  id: string;
  trip_id: string;
  target_type: TargetType | 'custom';
  target_id?: string;
  title: string;
  day_number: number;
  date?: string;
  start_time?: string;
  end_time?: string;
  notes?: string;
  location?: string;
  order_index: number;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  end_date: string;
  description?: string;
  cover_image: string;
  destinations: string[];
  travel_style: string;
  status: 'planning' | 'ongoing' | 'completed';
  items?: ItineraryItem[];
  created_at: string;
  updated_at?: string;
}
