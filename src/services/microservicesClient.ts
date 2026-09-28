// ==============================================================================
// Lankora: Microservices Client Adapter
// Connects to the central API Gateway (Port 8000) or direct microservices
// ==============================================================================

import {
  Destination,
  Place,
  Experience,
  Restaurant,
  Stay,
  Review,
  Trip,
  ItineraryItem,
  Booking,
  Profile,
  TargetType
} from '@/types';

const GATEWAY_URL =
  process.env.EXPO_PUBLIC_API_GATEWAY_URL || 'http://localhost:8000';

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = `${GATEWAY_URL}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {})
      }
    });

    if (!res.ok) {
      console.warn(`[microservicesClient] ${res.status} on ${endpoint}`);
      return null;
    }

    const json = await res.json();
    return (json.data !== undefined ? json.data : json) as T;
  } catch (error) {
    console.warn(`[microservicesClient] Network error on ${endpoint}:`, error);
    return null;
  }
}

export const microservicesClient = {
  baseUrl: GATEWAY_URL,

  // --------------------------------------------------------------------------
  // CLUSTER HEALTH
  // --------------------------------------------------------------------------
  async getClusterHealth() {
    return fetchJson('/api/health');
  },

  // --------------------------------------------------------------------------
  // 1. AUTH SERVICE
  // --------------------------------------------------------------------------
  auth: {
    async register(email: string, password: string, name?: string) {
      return fetchJson<{ user: any; profile: Profile; token: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name })
      });
    },

    async login(email: string, password: string) {
      return fetchJson<{ user: any; profile: Profile; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },

    async getProfile(userId: string) {
      return fetchJson<Profile>(`/api/auth/profile/${userId}`);
    },

    async updateProfile(userId: string, updates: Partial<Profile>) {
      return fetchJson<Profile>(`/api/auth/profile/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    },

    async updatePreferences(userId: string, preferences: Profile['travel_preferences']) {
      return fetchJson<Profile>(`/api/auth/profile/${userId}/preferences`, {
        method: 'PUT',
        body: JSON.stringify({ travel_preferences: preferences })
      });
    }
  },

  // --------------------------------------------------------------------------
  // 2. PLACES & CATALOG SERVICE
  // --------------------------------------------------------------------------
  places: {
    async getDestinations(params?: { category?: string; featured?: boolean; search?: string }) {
      const q = new URLSearchParams();
      if (params?.category) q.append('category', params.category);
      if (params?.featured) q.append('featured', 'true');
      if (params?.search) q.append('search', params.search);
      const query = q.toString() ? `?${q.toString()}` : '';
      return fetchJson<Destination[]>(`/api/destinations${query}`);
    },

    async getDestinationById(idOrSlug: string) {
      return fetchJson<Destination>(`/api/destinations/${idOrSlug}`);
    },

    async getPlaces(destinationId?: string, category?: string) {
      const q = new URLSearchParams();
      if (destinationId) q.append('destination_id', destinationId);
      if (category) q.append('category', category);
      const query = q.toString() ? `?${q.toString()}` : '';
      return fetchJson<Place[]>(`/api/places${query}`);
    },

    async getExperiences(destinationId?: string, category?: string) {
      const q = new URLSearchParams();
      if (destinationId) q.append('destination_id', destinationId);
      if (category) q.append('category', category);
      const query = q.toString() ? `?${q.toString()}` : '';
      return fetchJson<Experience[]>(`/api/experiences${query}`);
    },

    async getRestaurants(destinationId?: string) {
      const query = destinationId ? `?destination_id=${destinationId}` : '';
      return fetchJson<Restaurant[]>(`/api/restaurants${query}`);
    },

    async getStays(destinationId?: string) {
      const query = destinationId ? `?destination_id=${destinationId}` : '';
      return fetchJson<Stay[]>(`/api/stays${query}`);
    }
  },

  // --------------------------------------------------------------------------
  // 3. BOOKING SERVICE
  // --------------------------------------------------------------------------
  bookings: {
    async getUserBookings(userId: string) {
      return fetchJson<Booking[]>(`/api/bookings?user_id=${userId}`);
    },

    async getBookingById(id: string) {
      return fetchJson<Booking>(`/api/bookings/${id}`);
    },

    async createBooking(bookingData: {
      user_id: string;
      target_type: 'stay' | 'experience' | 'restaurant' | 'tour';
      target_id: string;
      title: string;
      booking_date: string;
      end_date?: string;
      time_slot?: string;
      guests?: number;
      total_price?: number;
      currency?: string;
      contact_phone?: string;
      contact_email?: string;
      special_requests?: string;
    }) {
      return fetchJson<Booking>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });
    },

    async updateBooking(id: string, updates: Partial<Booking>) {
      return fetchJson<Booking>(`/api/bookings/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
    },

    async cancelBooking(id: string) {
      return fetchJson<{ success: boolean; message: string }>(`/api/bookings/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // --------------------------------------------------------------------------
  // 4. REVIEW SERVICE
  // --------------------------------------------------------------------------
  reviews: {
    async getReviews(targetType: TargetType, targetId: string) {
      return fetchJson<Review[]>(`/api/reviews?target_type=${targetType}&target_id=${targetId}`);
    },

    async addReview(reviewData: {
      user_id: string;
      user_name?: string;
      user_avatar?: string;
      target_type: TargetType;
      target_id: string;
      rating: number;
      comment: string;
      images?: string[];
    }) {
      return fetchJson<Review>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });
    },

    async getFavorites(userId: string) {
      return fetchJson<any[]>(`/api/favorites?user_id=${userId}`);
    },

    async addFavorite(userId: string, targetType: TargetType, targetId: string) {
      return fetchJson<any>('/api/favorites', {
        method: 'POST',
        body: JSON.stringify({ user_id: userId, target_type: targetType, target_id: targetId })
      });
    },

    async removeFavorite(userId: string, targetType: TargetType, targetId: string) {
      return fetchJson<{ success: boolean }>('/api/favorites', {
        method: 'DELETE',
        body: JSON.stringify({ user_id: userId, target_type: targetType, target_id: targetId })
      });
    }
  },

  // --------------------------------------------------------------------------
  // 5. ITINERARY & AI PLANNER SERVICE
  // --------------------------------------------------------------------------
  itineraries: {
    async getUserTrips(userId: string) {
      return fetchJson<Trip[]>(`/api/trips?user_id=${userId}`);
    },

    async getTripById(id: string) {
      return fetchJson<Trip>(`/api/trips/${id}`);
    },

    async createTrip(tripData: {
      user_id: string;
      title: string;
      start_date: string;
      end_date: string;
      description?: string;
      cover_image?: string;
      destinations?: string[];
      travel_style?: string;
    }) {
      return fetchJson<Trip>('/api/trips', {
        method: 'POST',
        body: JSON.stringify(tripData)
      });
    },

    async addTripItem(tripId: string, itemData: Partial<ItineraryItem>) {
      return fetchJson<ItineraryItem>(`/api/trips/${tripId}/items`, {
        method: 'POST',
        body: JSON.stringify(itemData)
      });
    },

    async generateAIItinerary(params: {
      destination?: string;
      days?: number;
      travel_style?: string;
      pace?: string;
      dietary?: string[];
    }) {
      return fetchJson<{
        destination: string;
        travel_style: string;
        pace: string;
        total_days: number;
        title: string;
        summary: string;
        days: Array<{
          day_number: number;
          title: string;
          region: string;
          activities: Array<{ time: string; title: string; type: string; duration: string }>;
          evening_tip: string;
          dietary_recommendation: string;
        }>;
      }>('/api/ai/generate-itinerary', {
        method: 'POST',
        body: JSON.stringify(params)
      });
    }
  }
};
