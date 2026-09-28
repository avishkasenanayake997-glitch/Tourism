// ==============================================================================
// Lankora: Unified Data Service (Supabase + Offline Resilience)
// ==============================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  MOCK_DESTINATIONS,
  MOCK_PLACES,
  MOCK_EXPERIENCES,
  MOCK_RESTAURANTS,
  MOCK_STAYS,
  MOCK_REVIEWS,
  MOCK_TRIPS
} from './mockData';
import {
  Destination,
  Experience,
  Place,
  Restaurant,
  Stay,
  Review,
  Trip,
  ItineraryItem,
  TargetType,
  Favorite
} from '@/types';

const FAVORITES_STORAGE_KEY = '@lankora_favorites_v1';
const TRIPS_STORAGE_KEY = '@lankora_trips_v1';

export const dataService = {
  // --------------------------------------------------------------------------
  // DESTINATIONS
  // --------------------------------------------------------------------------
  async getDestinations(): Promise<Destination[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .order('rating', { ascending: false });
        if (!error && data && data.length > 0) {
          return data as Destination[];
        }
      } catch (e) {
        console.warn('Falling back to local destinations:', e);
      }
    }
    return MOCK_DESTINATIONS;
  },

  async getDestinationById(idOrSlug: string): Promise<Destination | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .select('*')
          .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
          .maybeSingle();
        if (!error && data) {
          return data as Destination;
        }
      } catch (e) {
        console.warn('Falling back to local destination:', e);
      }
    }
    return (
      MOCK_DESTINATIONS.find((d) => d.id === idOrSlug || d.slug === idOrSlug) ||
      MOCK_DESTINATIONS[0]
    );
  },

  async getFeaturedDestinations(): Promise<Destination[]> {
    const list = await this.getDestinations();
    return list.filter((d) => d.is_featured);
  },

  async getHiddenGems(): Promise<Destination[]> {
    const list = await this.getDestinations();
    return list.filter((d) => d.is_hidden_gem);
  },

  // --------------------------------------------------------------------------
  // PLACES
  // --------------------------------------------------------------------------
  async getPlaces(destinationId?: string): Promise<Place[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('places').select('*');
        if (destinationId) {
          query = query.eq('destination_id', destinationId);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Place[];
        }
      } catch (e) {
        console.warn('Falling back to local places:', e);
      }
    }
    if (destinationId) {
      return MOCK_PLACES.filter((p) => p.destination_id === destinationId);
    }
    return MOCK_PLACES;
  },

  async getPlaceById(id: string): Promise<Place | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('places')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) {
          return data as Place;
        }
      } catch (e) {
        console.warn('Falling back to local place:', e);
      }
    }
    return MOCK_PLACES.find((p) => p.id === id) || MOCK_PLACES[0];
  },

  // --------------------------------------------------------------------------
  // EXPERIENCES
  // --------------------------------------------------------------------------
  async getExperiences(destinationId?: string, category?: string): Promise<Experience[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('experiences').select('*');
        if (destinationId) query = query.eq('destination_id', destinationId);
        if (category && category !== 'All') query = query.eq('category', category);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Experience[];
        }
      } catch (e) {
        console.warn('Falling back to local experiences:', e);
      }
    }
    let list = MOCK_EXPERIENCES;
    if (destinationId) list = list.filter((e) => e.destination_id === destinationId);
    if (category && category !== 'All') list = list.filter((e) => e.category === category);
    return list;
  },

  async getExperienceById(id: string): Promise<Experience | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) {
          return data as Experience;
        }
      } catch (e) {
        console.warn('Falling back to local experience:', e);
      }
    }
    return MOCK_EXPERIENCES.find((e) => e.id === id) || MOCK_EXPERIENCES[0];
  },

  // --------------------------------------------------------------------------
  // RESTAURANTS
  // --------------------------------------------------------------------------
  async getRestaurants(destinationId?: string): Promise<Restaurant[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('restaurants').select('*');
        if (destinationId) query = query.eq('destination_id', destinationId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Restaurant[];
        }
      } catch (e) {
        console.warn('Falling back to local restaurants:', e);
      }
    }
    if (destinationId) {
      return MOCK_RESTAURANTS.filter((r) => r.destination_id === destinationId);
    }
    return MOCK_RESTAURANTS;
  },

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) {
          return data as Restaurant;
        }
      } catch (e) {
        console.warn('Falling back to local restaurant:', e);
      }
    }
    return MOCK_RESTAURANTS.find((r) => r.id === id) || MOCK_RESTAURANTS[0];
  },

  // --------------------------------------------------------------------------
  // STAYS
  // --------------------------------------------------------------------------
  async getStays(destinationId?: string): Promise<Stay[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('stays').select('*');
        if (destinationId) query = query.eq('destination_id', destinationId);
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data as Stay[];
        }
      } catch (e) {
        console.warn('Falling back to local stays:', e);
      }
    }
    if (destinationId) {
      return MOCK_STAYS.filter((s) => s.destination_id === destinationId);
    }
    return MOCK_STAYS;
  },

  async getStayById(id: string): Promise<Stay | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('stays')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) {
          return data as Stay;
        }
      } catch (e) {
        console.warn('Falling back to local stay:', e);
      }
    }
    return MOCK_STAYS.find((s) => s.id === id) || MOCK_STAYS[0];
  },

  // --------------------------------------------------------------------------
  // REVIEWS
  // --------------------------------------------------------------------------
  async getReviews(targetType: TargetType, targetId: string): Promise<Review[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('target_type', targetType)
          .eq('target_id', targetId)
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data as Review[];
        }
      } catch (e) {
        console.warn('Falling back to local reviews:', e);
      }
    }
    return MOCK_REVIEWS.filter(
      (r) => r.target_type === targetType && (r.target_id === targetId || targetId.includes(r.target_id))
    );
  },

  async addReview(review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('reviews').insert([newReview]);
      } catch (e) {
        console.warn('Failed to insert remote review:', e);
      }
    }
    MOCK_REVIEWS.unshift(newReview);
    return newReview;
  },

  // --------------------------------------------------------------------------
  // FAVORITES (Local storage + Supabase sync)
  // --------------------------------------------------------------------------
  async getFavorites(): Promise<Favorite[]> {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading favorites:', e);
    }
    // Return sample favorites by default
    const initialFavorites: Favorite[] = [
      {
        id: 'fav-1',
        user_id: 'current-user',
        target_type: 'destination',
        target_id: 'dest-ella',
        created_at: new Date().toISOString(),
        item: MOCK_DESTINATIONS[0]
      },
      {
        id: 'fav-2',
        user_id: 'current-user',
        target_type: 'experience',
        target_id: 'exp-blue-train',
        created_at: new Date().toISOString(),
        item: MOCK_EXPERIENCES[0]
      }
    ];
    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(initialFavorites));
    return initialFavorites;
  },

  async toggleFavorite(targetType: TargetType, targetId: string, itemData?: any): Promise<boolean> {
    const current = await this.getFavorites();
    const index = current.findIndex(
      (f) => f.target_type === targetType && f.target_id === targetId
    );
    let updated: Favorite[];
    let isNowFavorite = false;

    if (index >= 0) {
      updated = current.filter((_, i) => i !== index);
      isNowFavorite = false;
    } else {
      const newFav: Favorite = {
        id: `fav-${Date.now()}`,
        user_id: 'current-user',
        target_type: targetType,
        target_id: targetId,
        created_at: new Date().toISOString(),
        item: itemData,
      };
      updated = [newFav, ...current];
      isNowFavorite = true;
    }

    await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          if (isNowFavorite) {
            await supabase.from('favorites').upsert({
              user_id: user.id,
              target_type: targetType,
              target_id: targetId,
            });
          } else {
            await supabase.from('favorites').delete().match({
              user_id: user.id,
              target_type: targetType,
              target_id: targetId,
            });
          }
        }
      } catch (e) {
        console.warn('Error syncing favorite with Supabase:', e);
      }
    }

    return isNowFavorite;
  },

  async isFavorite(targetType: TargetType, targetId: string): Promise<boolean> {
    const current = await this.getFavorites();
    return current.some((f) => f.target_type === targetType && f.target_id === targetId);
  },

  // --------------------------------------------------------------------------
  // TRIPS & ITINERARY
  // --------------------------------------------------------------------------
  async getTrips(): Promise<Trip[]> {
    try {
      const stored = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading trips:', e);
    }
    await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(MOCK_TRIPS));
    return MOCK_TRIPS;
  },

  async getTripById(id: string): Promise<Trip | null> {
    const trips = await this.getTrips();
    return trips.find((t) => t.id === id) || null;
  },

  async createTrip(tripData: Omit<Trip, 'id' | 'created_at' | 'items'>): Promise<Trip> {
    const trips = await this.getTrips();
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
      created_at: new Date().toISOString(),
      items: [],
    };
    const updated = [newTrip, ...trips];
    await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(updated));
    return newTrip;
  },

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip | null> {
    const trips = await this.getTrips();
    const index = trips.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const updatedTrip = { ...trips[index], ...updates, updated_at: new Date().toISOString() };
    trips[index] = updatedTrip;
    await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
    return updatedTrip;
  },

  async deleteTrip(id: string): Promise<boolean> {
    const trips = await this.getTrips();
    const updated = trips.filter((t) => t.id !== id);
    await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(updated));
    return true;
  },

  async addItineraryItem(tripId: string, item: Omit<ItineraryItem, 'id' | 'trip_id'>): Promise<ItineraryItem | null> {
    const trip = await this.getTripById(tripId);
    if (!trip) return null;
    const newItem: ItineraryItem = {
      ...item,
      id: `item-${Date.now()}`,
      trip_id: tripId,
    };
    const currentItems = trip.items || [];
    const updatedItems = [...currentItems, newItem];
    await this.updateTrip(tripId, { items: updatedItems });
    return newItem;
  },

  async removeItineraryItem(tripId: string, itemId: string): Promise<boolean> {
    const trip = await this.getTripById(tripId);
    if (!trip) return false;
    const currentItems = trip.items || [];
    const updatedItems = currentItems.filter((i) => i.id !== itemId);
    await this.updateTrip(tripId, { items: updatedItems });
    return true;
  },

  // --------------------------------------------------------------------------
  // GLOBAL SEARCH
  // --------------------------------------------------------------------------
  async search(query: string): Promise<{
    destinations: Destination[];
    places: Place[];
    experiences: Experience[];
    restaurants: Restaurant[];
    stays: Stay[];
  }> {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return {
        destinations: [],
        places: [],
        experiences: [],
        restaurants: [],
        stays: [],
      };
    }

    const destinations = MOCK_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(clean) ||
        d.province.toLowerCase().includes(clean) ||
        d.category.toLowerCase().includes(clean) ||
        d.highlights.some((h) => h.toLowerCase().includes(clean)) ||
        d.vibe_tags.some((v) => v.toLowerCase().includes(clean))
    );

    const places = MOCK_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(clean) ||
        p.category.toLowerCase().includes(clean) ||
        p.location.toLowerCase().includes(clean)
    );

    const experiences = MOCK_EXPERIENCES.filter(
      (e) =>
        e.title.toLowerCase().includes(clean) ||
        e.category.toLowerCase().includes(clean) ||
        e.location.toLowerCase().includes(clean)
    );

    const restaurants = MOCK_RESTAURANTS.filter(
      (r) =>
        r.name.toLowerCase().includes(clean) ||
        r.cuisine.toLowerCase().includes(clean) ||
        r.location.toLowerCase().includes(clean)
    );

    const stays = MOCK_STAYS.filter(
      (s) =>
        s.name.toLowerCase().includes(clean) ||
        s.type.toLowerCase().includes(clean) ||
        s.location.toLowerCase().includes(clean)
    );

    return { destinations, places, experiences, restaurants, stays };
  }
};
