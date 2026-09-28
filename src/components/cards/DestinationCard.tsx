// ==============================================================================
// Lankora: Editorial Destination Card
// ==============================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Destination } from '@/types';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
import { FavoriteButton } from '../ui/FavoriteButton';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface DestinationCardProps {
  destination: Destination;
  variant?: 'featured' | 'standard' | 'compact';
  onPress?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  variant = 'standard',
  onPress,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/destination/${destination.slug || destination.id}` as any);
    }
  };

  const isFeatured = variant === 'featured';
  const cardWidth = isFeatured ? SCREEN_WIDTH - 40 : 260;
  const cardHeight = isFeatured ? 360 : 310;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={handlePress}
      style={[
        styles.container,
        { width: isFeatured ? '100%' : cardWidth, height: cardHeight },
        Shadows.md,
      ]}
    >
      <Image
        source={{ uri: destination.hero_image }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={300}
      />

      {/* Dark gradient overlay for editorial readability */}
      <View style={styles.gradientOverlay} />

      {/* Top Bar: Badge & Bookmark */}
      <View style={styles.topRow}>
        <Badge
          label={destination.category}
          variant={destination.is_hidden_gem ? 'terracotta' : 'emerald'}
          size="sm"
        />
        <FavoriteButton
          targetType="destination"
          targetId={destination.id}
          itemData={destination}
          size={36}
          iconSize={18}
        />
      </View>

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        <View style={styles.metaRow}>
          <Typography variant="caption" color={Colors.emerald.accent} weight="600">
            {destination.province.toUpperCase()}
          </Typography>
          <RatingStars rating={destination.rating} reviewCount={destination.review_count} />
        </View>

        <Typography variant={isFeatured ? 'h1' : 'h2'} weight="700" style={styles.title}>
          {destination.name}
        </Typography>

        <Typography
          variant="bodySmall"
          color={Colors.dark.textSecondary}
          numberOfLines={2}
          style={styles.description}
        >
          {destination.short_description}
        </Typography>

        <View style={styles.footerRow}>
          <View style={styles.budgetPill}>
            <Typography variant="caption" color={Colors.dark.textMuted}>
              Est. {destination.estimated_budget}
            </Typography>
          </View>
          <View style={styles.explorePill}>
            <Typography variant="caption" color={Colors.sand.warm} weight="600">
              Discover →
            </Typography>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.dark.surfaceElevated,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
  },
  gradientOverlay: {
    ...(StyleSheet.absoluteFill as object),
    backgroundColor: 'rgba(11, 17, 15, 0.45)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    zIndex: 2,
  },
  bottomContent: {
    padding: Spacing.lg,
    zIndex: 2,
    backgroundColor: 'rgba(11, 17, 15, 0.72)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 4,
  },
  description: {
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
  },
  budgetPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  explorePill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
