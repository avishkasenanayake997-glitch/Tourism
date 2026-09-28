// ==============================================================================
// Lankora: Animated Favorite Bookmark Button
// ==============================================================================

import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '@/context/FavoritesContext';
import { TargetType } from '@/types';
import { Colors } from '@/constants/theme';

interface FavoriteButtonProps {
  targetType: TargetType;
  targetId: string;
  itemData?: any;
  size?: number;
  iconSize?: number;
  style?: ViewStyle;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  targetType,
  targetId,
  itemData,
  size = 38,
  iconSize = 20,
  style,
}) => {
  const { isSaved, toggleSaved } = useFavorites();
  const saved = isSaved(targetType, targetId);
  const [animating, setAnimating] = useState(false);

  const handlePress = async () => {
    setAnimating(true);
    await toggleSaved(targetType, targetId, itemData);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        saved ? styles.buttonActive : styles.buttonInactive,
        style,
      ]}
    >
      <Ionicons
        name={saved ? 'heart' : 'heart-outline'}
        size={iconSize}
        color={saved ? Colors.terracotta.primary : '#FFFFFF'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInactive: {
    backgroundColor: 'rgba(11, 17, 15, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  buttonActive: {
    backgroundColor: 'rgba(231, 111, 81, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(231, 111, 81, 0.55)',
  },
});
