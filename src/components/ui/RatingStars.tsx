// ==============================================================================
// Lankora: Rating Stars Component
// ==============================================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from './Typography';
import { Colors, Spacing } from '@/constants/theme';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showText?: boolean;
  style?: ViewStyle;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  reviewCount,
  size = 14,
  showText = true,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="star" size={size} color={Colors.dark.star} />
      {showText && (
        <View style={styles.textRow}>
          <Typography variant="bodySmall" weight="700" color={Colors.dark.text} style={styles.ratingText}>
            {rating.toFixed(1)}
          </Typography>
          {reviewCount !== undefined && (
            <Typography variant="caption" color={Colors.dark.textMuted}>
              ({reviewCount})
            </Typography>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  ratingText: {
    marginRight: 3,
  },
});
