// ==============================================================================
// Lankora: Experience Card
// ==============================================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Experience } from '@/types';
import { Typography } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { RatingStars } from '../ui/RatingStars';
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
  width = 240,
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
      style={[styles.container, { width }, Shadows.sm]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: experience.images[0] }}
          style={StyleSheet.absoluteFillObject}
          contentFit="cover"
          transition={250}
        />
        <View style={styles.imageOverlay} />
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
          <Ionicons name="time-outline" size={12} color="#FFFFFF" />
          <Typography variant="caption" color="#FFFFFF" weight="600" style={styles.durationText}>
            {experience.duration}
          </Typography>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.ratingRow}>
          <RatingStars rating={experience.rating} reviewCount={experience.review_count} size={12} />
        </View>

        <Typography variant="h4" weight="600" numberOfLines={2} style={styles.title}>
          {experience.title}
        </Typography>

        <View style={styles.footerRow}>
          <Typography variant="caption" color={Colors.emerald.accent} weight="700">
            {experience.price}
          </Typography>
          <Typography variant="caption" color={Colors.dark.textMuted} numberOfLines={1}>
            {experience.location.split(',')[0]}
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
  imageContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 17, 15, 0.25)',
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
    backgroundColor: 'rgba(11, 17, 15, 0.65)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  durationText: {
    marginLeft: 3,
    fontSize: 10,
  },
  body: {
    padding: Spacing.md,
  },
  ratingRow: {
    marginBottom: 4,
  },
  title: {
    color: Colors.dark.text,
    minHeight: 40,
    marginBottom: Spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingTop: 6,
  },
});
