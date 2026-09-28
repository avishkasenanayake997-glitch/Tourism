// ==============================================================================
// Lankora: Stay Card (Boutique Eco-Lodges, Colonial Villas, Beach Resorts)
// ==============================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Stay } from '@/types';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { FavoriteButton } from '../ui/FavoriteButton';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

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
      style={[styles.container, { width }]}
    >
      <View style={styles.imageBox}>
        <Image
          source={{ uri: stay.images[0] }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={250}
        />
        <Badge label={stay.type} variant="sand" size="sm" style={styles.badge} />
        <FavoriteButton
          targetType="stay"
          targetId={stay.id}
          itemData={stay}
          size={32}
          iconSize={16}
          style={styles.fav}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Typography variant="caption" color={Colors.emerald.accent} numberOfLines={1}>
            {stay.location}
          </Typography>
          <RatingStars rating={stay.rating} reviewCount={stay.review_count} size={11} />
        </View>

        <Typography variant="h4" weight="600" numberOfLines={1} style={styles.name}>
          {stay.name}
        </Typography>

        <View style={styles.footerRow}>
          <Typography variant="bodySmall" weight="700" color={Colors.sand.warm}>
            {stay.price_range}
          </Typography>
          <Typography variant="caption" color={Colors.dark.textMuted}>
            {stay.amenities[0]}
          </Typography>
        </View>
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
    height: 140,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  badge: {
    position: 'absolute',
    top: Spacing.xs,
    left: Spacing.xs,
  },
  fav: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  content: {
    padding: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: Colors.dark.text,
    marginBottom: 6,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingTop: 6,
  },
});
