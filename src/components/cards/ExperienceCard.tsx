// ==============================================================================
// Lankora: Luxury Experience Card
// ==============================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Experience } from '@/types';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { FavoriteButton } from '../ui/FavoriteButton';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface ExperienceCardProps {
  experience: Experience;
  onPress?: () => void;
  width?: number;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  experience,
  onPress,
  width = 250,
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/experience/${experience.id}` as any);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[styles.container, { width }, Shadows.md]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: experience.images[0] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
        <LinearGradient
          colors={['rgba(7, 10, 9, 0.3)', 'transparent', 'rgba(7, 10, 9, 0.85)']}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.badgeWrapper}>
          <Badge label={experience.category} variant="emerald" size="sm" />
        </View>

        <FavoriteButton
          targetType="experience"
          targetId={experience.id}
          itemData={experience}
          size={32}
          iconSize={16}
          style={styles.favButton}
        />

        <View style={styles.durationTag}>
          <Ionicons name="time-outline" size={11} color={Colors.gold.light} />
          <Typography variant="caption" color="#FFFFFF" weight="700" style={styles.durationText}>
            {experience.duration}
          </Typography>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.ratingRow}>
          <View style={styles.ratingPill}>
            <Ionicons name="star" size={11} color={Colors.gold.primary} />
            <Typography variant="caption" color="#FFFFFF" weight="700" style={{ fontSize: 11 }}>
              {experience.rating.toFixed(1)}
            </Typography>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" style={{ fontSize: 10.5 }}>
              ({experience.review_count})
            </Typography>
          </View>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" numberOfLines={1}>
            {experience.location.split(',')[0]}
          </Typography>
        </View>

        <Typography variant="h4" weight="700" numberOfLines={2} style={styles.title}>
          {experience.title}
        </Typography>

        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" style={{ fontSize: 10 }}>
              FROM
            </Typography>
            <Typography variant="body" color={Colors.emerald.accent} weight="800">
              {experience.price}
            </Typography>
          </View>

          <View style={styles.bookMiniPill}>
            <Typography variant="badge" color={Colors.gold.primary} weight="800">
              RESERVE
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
    backgroundColor: '#0E1512',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  imageContainer: {
    height: 155,
    width: '100%',
    position: 'relative',
    backgroundColor: '#15201C',
  },
  badgeWrapper: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  favButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
  durationTag: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(12, 18, 15, 0.78)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  durationText: {
    fontSize: 10.5,
  },
  body: {
    padding: Spacing.md,
    backgroundColor: '#0E1512',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  title: {
    color: '#FFFFFF',
    minHeight: 40,
    marginBottom: Spacing.sm,
    lineHeight: 20,
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
  priceContainer: {
    flexDirection: 'column',
  },
  bookMiniPill: {
    backgroundColor: 'rgba(245, 176, 65, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(245, 176, 65, 0.3)',
  },
});
