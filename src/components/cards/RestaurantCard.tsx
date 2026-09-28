// ==============================================================================
// Lankora: Luxury Authentic Dining Card
// ==============================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Restaurant } from '@/types';
import { Typography } from '../ui/Typography';
import { FavoriteButton } from '../ui/FavoriteButton';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface RestaurantCardProps {
  restaurant: Restaurant;
  width?: number;
  onPress?: () => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  width = 240,
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/restaurant/${restaurant.id}` as any);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.container, { width }, Shadows.md]}
    >
      <View style={styles.imageBox}>
        <Image
          source={{ uri: restaurant.images[0] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
        <LinearGradient
          colors={['transparent', 'rgba(7, 10, 9, 0.8)']}
          style={StyleSheet.absoluteFill}
        />

        <FavoriteButton
          targetType="restaurant"
          targetId={restaurant.id}
          itemData={restaurant}
          size={32}
          iconSize={16}
          style={styles.fav}
        />

        <View style={styles.pricePill}>
          <Typography variant="caption" weight="800" color={Colors.gold.primary}>
            {restaurant.price_range}
          </Typography>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Typography variant="caption" color={Colors.terracotta.primary} weight="700" style={{ letterSpacing: 0.5 }}>
            {restaurant.cuisine.toUpperCase()}
          </Typography>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color={Colors.gold.primary} />
            <Typography variant="caption" color="#FFFFFF" weight="700">
              {restaurant.rating.toFixed(1)}
            </Typography>
          </View>
        </View>

        <Typography variant="h4" weight="700" numberOfLines={1} style={styles.title}>
          {restaurant.name}
        </Typography>

        {restaurant.must_try && restaurant.must_try.length > 0 && (
          <View style={styles.mustTryRow}>
            <Ionicons name="restaurant-outline" size={11} color={Colors.gold.light} />
            <Typography variant="caption" color="rgba(255, 255, 255, 0.65)" numberOfLines={1} style={{ flex: 1 }}>
              {restaurant.must_try[0]}
            </Typography>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: '#0E1512',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageBox: {
    height: 135,
    width: '100%',
    position: 'relative',
    backgroundColor: '#15201C',
  },
  fav: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  pricePill: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(12, 18, 15, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(245, 176, 65, 0.3)',
  },
  content: {
    padding: Spacing.md,
    backgroundColor: '#0E1512',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  mustTryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
});
