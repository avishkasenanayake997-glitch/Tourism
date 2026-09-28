// ==============================================================================
// Lankora: Luxury Sights & Heritage Place Card
// ==============================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Place } from '@/types';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { FavoriteButton } from '../ui/FavoriteButton';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface PlaceCardProps {
  place: Place;
  width?: number;
  onPress?: () => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, width = 210, onPress }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/place/${place.id}` as any);
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
          source={{ uri: place.images[0] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
        <LinearGradient
          colors={['transparent', 'rgba(7, 10, 9, 0.75)']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.badgeWrapper}>
          <Badge label={place.category} variant="glass" size="sm" />
        </View>

        <FavoriteButton
          targetType="place"
          targetId={place.id}
          itemData={place}
          size={30}
          iconSize={15}
          style={styles.fav}
        />

        {place.entry_fee && (
          <View style={styles.feeTag}>
            <Typography variant="caption" color={Colors.gold.light} weight="700" style={{ fontSize: 10 }}>
              {place.entry_fee.includes('Free') ? 'FREE ENTRY' : place.entry_fee.split(' ')[0]}
            </Typography>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color={Colors.gold.primary} />
            <Typography variant="caption" color="#FFFFFF" weight="700">
              {place.rating.toFixed(1)}
            </Typography>
          </View>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.45)">
            {place.review_count} reviews
          </Typography>
        </View>

        <Typography variant="body" weight="700" numberOfLines={1} style={styles.name}>
          {place.name}
        </Typography>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color={Colors.emerald.accent} />
          <Typography variant="caption" color="rgba(255, 255, 255, 0.6)" numberOfLines={1} style={{ flex: 1 }}>
            {place.location}
          </Typography>
        </View>
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
  badgeWrapper: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  fav: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  feeTag: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: 'rgba(12, 18, 15, 0.85)',
    paddingHorizontal: 7,
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
  name: {
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
