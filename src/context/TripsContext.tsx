// ==============================================================================
// Lankora: Trips Context & Itinerary Management
// ==============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Trip, ItineraryItem } from '@/types';
import { dataService } from '@/services/dataService';

interface TripsContextType {
  trips: Trip[];
  isLoading: boolean;
  activeTrip: Trip | null;
  refreshTrips: () => Promise<void>;
  createTrip: (data: Omit<Trip, 'id' | 'created_at' | 'items'>) => Promise<Trip>;
  updateTrip: (id: string, updates: Partial<Trip>) => Promise<Trip | null>;
  deleteTrip: (id: string) => Promise<boolean>;
  addItemToTrip: (tripId: string, item: Omit<ItineraryItem, 'id' | 'trip_id'>) => Promise<ItineraryItem | null>;
  removeItemFromTrip: (tripId: string, itemId: string) => Promise<boolean>;
  setActiveTrip: (trip: Trip | null) => void;
}

const TripsContext = createContext<TripsContextType>({
  trips: [],
  isLoading: false,
  activeTrip: null,
  refreshTrips: async () => {},
  createTrip: async () => ({} as Trip),
  updateTrip: async () => null,
  deleteTrip: async () => false,
  addItemToTrip: async () => null,
  removeItemFromTrip: async () => false,
  setActiveTrip: () => {},
});

export const TripsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshTrips = useCallback(async () => {
    try {
      const data = await dataService.getTrips();
      setTrips(data);
      if (data.length > 0 && !activeTrip) {
        setActiveTrip(data[0]);
      }
    } catch (e) {
      console.warn('Error fetching trips:', e);
    } finally {
      setIsLoading(false);
    }
  }, [activeTrip]);

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  const createTrip = async (data: Omit<Trip, 'id' | 'created_at' | 'items'>) => {
    const created = await dataService.createTrip(data);
    await refreshTrips();
    setActiveTrip(created);
    return created;
  };

  const updateTrip = async (id: string, updates: Partial<Trip>) => {
    const updated = await dataService.updateTrip(id, updates);
    await refreshTrips();
    if (activeTrip?.id === id && updated) {
      setActiveTrip(updated);
    }
    return updated;
  };

  const deleteTrip = async (id: string) => {
    const ok = await dataService.deleteTrip(id);
    await refreshTrips();
    if (activeTrip?.id === id) {
      setActiveTrip(trips.find((t) => t.id !== id) || null);
    }
    return ok;
  };

  const addItemToTrip = async (tripId: string, item: Omit<ItineraryItem, 'id' | 'trip_id'>) => {
    const res = await dataService.addItineraryItem(tripId, item);
    await refreshTrips();
    return res;
  };

  const removeItemFromTrip = async (tripId: string, itemId: string) => {
    const ok = await dataService.removeItineraryItem(tripId, itemId);
    await refreshTrips();
    return ok;
  };

  return (
    <TripsContext.Provider
      value={{
        trips,
        isLoading,
        activeTrip,
        refreshTrips,
        createTrip,
        updateTrip,
        deleteTrip,
        addItemToTrip,
        removeItemFromTrip,
        setActiveTrip,
      }}
    >
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => useContext(TripsContext);
