// ==============================================================================
// Lankora: Favorites Context
// ==============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Favorite, TargetType } from '@/types';
import { dataService } from '@/services/dataService';

interface FavoritesContextType {
  favorites: Favorite[];
  isSaved: (targetType: TargetType, targetId: string) => boolean;
  toggleSaved: (targetType: TargetType, targetId: string, itemData?: any) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
  isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  isSaved: () => false,
  toggleSaved: async () => false,
  refreshFavorites: async () => {},
  isLoading: false,
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshFavorites = useCallback(async () => {
    try {
      const data = await dataService.getFavorites();
      setFavorites(data);
    } catch (e) {
      console.warn('Error fetching favorites:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const isSaved = useCallback(
    (targetType: TargetType, targetId: string) => {
      return favorites.some((f) => f.target_type === targetType && f.target_id === targetId);
    },
    [favorites]
  );

  const toggleSaved = useCallback(
    async (targetType: TargetType, targetId: string, itemData?: any) => {
      const newState = await dataService.toggleFavorite(targetType, targetId, itemData);
      await refreshFavorites();
      return newState;
    },
    [refreshFavorites]
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isSaved,
        toggleSaved,
        refreshFavorites,
        isLoading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
