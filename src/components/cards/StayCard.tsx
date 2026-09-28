// ==============================================================================
// Lankora: Luxury Villa & Resort Stay Card
// ==============================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Stay } from '@/types';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { FavoriteButton } from '../ui/FavoriteButton';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface StayCardProps {
  stay: Stay;
  width?: number;
  onPress?: () => void;
}

export const StayCard: React.FC<StayCardProps> = ({ stay, width = 250, onPress }) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/stay/${stay.id}` as any);
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
          source={{ uri: stay.images[0] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
        <LinearGradient
          colors={['transparent', 'rgba(7, 10, 9, 0.82)']}
          style={StyleSheet.absoluteFill}
        />

        <Badge label={stay.type} variant="glass" size="sm" style={styles.badge} />
        
        <FavoriteButton
          targetType="stay"
          targetId={stay.id}
          itemData={stay}
          size={32}
          iconSize={16}
          style={styles.fav}
        />

        <View style={styles.pricePill}>
          <Typography variant="caption" weight="800" color="#FCD34D" style={{ fontSize: 11 }}>
            {stay.price_range}
          </Typography>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.locationPill}>
            <Ionicons name="location-outline" size={12} color={Colors.emerald.accent} />
            <Typography variant="caption" color={Colors.emerald.accent} weight="700" numberOfLines={1}>
              {stay.location}
            </Typography>
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color={Colors.gold.primary} />
            <Typography variant="caption" color="#FFFFFF" weight="700">
              {stay.rating.toFixed(1)}
            </Typography>
          </View>
        </View>

        <Typography variant="h4" weight="700" numberOfLines={1} style={styles.name}>
          {stay.name}
        </Typography>

        <View style={styles.footerRow}>
          {stay.amenities && stay.amenities.length > 0 && (
            <View style={styles.amenityPill}>
              <Ionicons name="sparkles-outline" size={11} color="rgba(255, 255, 255, 0.6)" />
              <Typography variant="caption" color="rgba(255, 255, 255, 0.6)" numberOfLines={1}>
                {stay.amenities[0]}
              </Typography>
            </View>
          )}

          <Typography variant="caption" color={Colors.gold.primary} weight="700">
            View Retreat →
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
    height: 145,
    width: '100%',
    position: 'relative',
    backgroundColor: '#15201C',
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  name: {
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 8,
  },
  amenityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
