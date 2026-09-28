// ==============================================================================
// Lankora: Luxury Editorial Destination Card
// ==============================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Destination } from '@/types';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
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
  const cardWidth = isFeatured ? SCREEN_WIDTH - 36 : 270;
  const cardHeight = isFeatured ? 380 : 330;

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

      {/* Smooth Editorial Linear Vignette */}
      <LinearGradient
        colors={[
          'rgba(7, 10, 9, 0.2)',
          'rgba(7, 10, 9, 0.45)',
          'rgba(7, 10, 9, 0.82)',
          '#070A09'
        ]}
        locations={[0, 0.45, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top Floating Bar: Badges & Favorite Button */}
      <View style={styles.topRow}>
        <View style={styles.badgeGroup}>
          <Badge
            label={destination.category}
            variant={destination.is_hidden_gem ? 'gold' : 'emerald'}
            size="sm"
          />
          {destination.is_featured && (
            <View style={styles.curatedPill}>
              <Ionicons name="sparkles" size={10} color={Colors.gold.primary} />
              <Typography variant="badge" color={Colors.gold.primary} style={styles.curatedText}>
                Curated
              </Typography>
            </View>
          )}
        </View>

        <FavoriteButton
          targetType="destination"
          targetId={destination.id}
          itemData={destination}
          size={36}
          iconSize={18}
        />
      </View>

      {/* Bottom Content Container */}
      <View style={styles.bottomContent}>
        <View style={styles.metaRow}>
          <View style={styles.locationPill}>
            <Ionicons name="location-sharp" size={12} color={Colors.emerald.vibrant} />
            <Typography variant="caption" color={Colors.emerald.accent} weight="700">
              {destination.province.toUpperCase()}
            </Typography>
          </View>

          <View style={styles.ratingPill}>
            <Ionicons name="star" size={11} color={Colors.gold.primary} />
            <Typography variant="caption" color="#FFFFFF" weight="700" style={styles.ratingNumber}>
              {destination.rating.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
              ({destination.review_count})
            </Typography>
          </View>
        </View>

        <Typography variant={isFeatured ? 'h1' : 'h2'} weight="800" numberOfLines={1} style={styles.title}>
          {destination.name}
        </Typography>

        <Typography
          variant="bodySmall"
          color="rgba(255, 255, 255, 0.78)"
          numberOfLines={2}
          style={styles.description}
        >
          {destination.short_description}
        </Typography>

        <View style={styles.footerRow}>
          <View style={styles.budgetPill}>
            <Ionicons name="wallet-outline" size={12} color={Colors.gold.light} />
            <Typography variant="caption" color="#FCD34D" weight="600">
              {destination.estimated_budget}
            </Typography>
          </View>

          <View style={styles.exploreButton}>
            <Typography variant="caption" color="#FFFFFF" weight="700">
              Explore
            </Typography>
            <Ionicons name="arrow-forward" size={12} color="#FFFFFF" style={{ marginLeft: 3 }} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    backgroundColor: '#0E1512',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    position: 'relative',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    zIndex: 2,
  },
  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  curatedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(12, 18, 15, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(245, 176, 65, 0.3)',
  },
  curatedText: {
    fontSize: 9,
    letterSpacing: 0.6,
  },
  bottomContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.xs,
    zIndex: 2,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.full,
  },
  ratingNumber: {
    fontSize: 11,
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  description: {
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  budgetPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 176, 65, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(245, 176, 65, 0.25)',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
});
