// ==============================================================================
// Lankora: Restaurant & Food Card
// ==============================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Restaurant } from '@/types';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { FavoriteButton } from '../ui/FavoriteButton';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

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
      style={[styles.container, { width }]}
    >
      <View style={styles.imageBox}>
        <Image
          source={{ uri: restaurant.images[0] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
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
          <Typography variant="caption" weight="700" color="#FFFFFF">
            {restaurant.price_range}
          </Typography>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Typography variant="caption" color={Colors.terracotta.light} weight="600">
            {restaurant.cuisine.toUpperCase()}
          </Typography>
          <RatingStars rating={restaurant.rating} reviewCount={restaurant.review_count} size={11} />
        </View>

        <Typography variant="h4" weight="600" numberOfLines={1} style={styles.title}>
          {restaurant.name}
        </Typography>

        {restaurant.must_try && restaurant.must_try.length > 0 && (
          <Typography variant="caption" color={Colors.dark.textMuted} numberOfLines={1}>
            Must Try: {restaurant.must_try[0]}
          </Typography>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  imageBox: {
    height: 130,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  fav: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  pricePill: {
    position: 'absolute',
    bottom: Spacing.xs,
    left: Spacing.xs,
    backgroundColor: 'rgba(11, 17, 15, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  content: {
    padding: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    color: Colors.dark.text,
    marginBottom: 4,
  },
});
