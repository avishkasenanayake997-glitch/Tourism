// ==============================================================================
// Lankora: Place Card (Heritage, Viewpoints, Nature)
// ==============================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Place } from '@/types';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { FavoriteButton } from '../ui/FavoriteButton';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface PlaceCardProps {
  place: Place;
  width?: number;
  onPress?: () => void;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, width = 200, onPress }) => {
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
      style={[styles.container, { width }, Shadows.sm]}
    >
      <View style={styles.imageBox}>
        <Image
          source={{ uri: place.images[0] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
        <FavoriteButton
          targetType="place"
          targetId={place.id}
          itemData={place}
          size={30}
          iconSize={15}
          style={styles.fav}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Badge label={place.category} variant="neutral" size="sm" />
          <RatingStars rating={place.rating} showText={false} size={11} />
        </View>

        <Typography variant="body" weight="600" numberOfLines={1} style={styles.name}>
          {place.name}
        </Typography>

        <Typography variant="caption" color={Colors.dark.textMuted} numberOfLines={1}>
          {place.location}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  imageBox: {
    height: 120,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  fav: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  content: {
    padding: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    color: Colors.dark.text,
    marginBottom: 2,
  },
});
