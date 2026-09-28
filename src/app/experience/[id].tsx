// ==============================================================================
// Lankora: Experience Detail Screen
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { dataService } from '@/services/dataService';
import { Experience } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useTrips } from '@/context/TripsContext';

export default function ExperienceDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, addItemToTrip } = useTrips();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      dataService.getExperienceById(id).then((res) => {
        setExperience(res);
        setLoading(false);
      });
    }
  }, [id]);

  const handleShare = async () => {
    if (!experience) return;
    Share.share({
      message: `Check out ${experience.title} in Sri Lanka on Lankora: ${experience.price}`,
    });
  };

  const handleAddToItinerary = async () => {
    if (!experience) return;
    if (trips.length === 0) {
      Alert.alert('No Trips Yet', 'Create a trip first to add this experience.', [
        { text: 'Create Trip', onPress: () => router.push('/trip/create' as any) },
        { text: 'Cancel' },
      ]);
      return;
    }
    const trip = trips[0];
    await addItemToTrip(trip.id, {
      target_type: 'experience',
      target_id: experience.id,
      title: experience.title,
      day_number: 1,
      start_time: '10:00 AM',
      location: experience.location,
      notes: `${experience.duration} · ${experience.price}`,
      order_index: 0,
    });
    Alert.alert('Added', `Added to your "${trip.title}" itinerary.`);
  };

  if (loading || !experience) {
    return <View style={styles.screen} />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Photo */}
        <View style={styles.heroBox}>
          <Image
            source={{ uri: experience.images[0] }}
            style={(StyleSheet.absoluteFill as any)}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />

          {/* Floating Nav */}
          <View style={[styles.floatingNav, { top: Math.max(insets.top, 16) }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.navRight}>
              <TouchableOpacity onPress={handleShare} style={styles.iconCircle}>
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <FavoriteButton
                targetType="experience"
                targetId={experience.id}
                itemData={experience}
                size={40}
                iconSize={20}
              />
            </View>
          </View>

          <View style={styles.heroBottom}>
            <Badge label={experience.category} variant="emerald" size="md" />
            <Typography variant="h1" color="#FFFFFF" weight="700" style={styles.title}>
              {experience.title}
            </Typography>
            <View style={styles.locRow}>
              <Ionicons name="location-outline" size={16} color={Colors.sand.warm} />
              <Typography variant="body" color={Colors.sand.soft} style={styles.locText}>
                {experience.location}
              </Typography>
            </View>
          </View>
        </View>

        {/* Quick Highlights Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statBox}>
            <Ionicons name="time-outline" size={18} color={Colors.emerald.mint} />
            <Typography variant="caption" color={Colors.dark.textMuted}>
              Duration
            </Typography>
            <Typography variant="bodySmall" weight="700">
              {experience.duration}
            </Typography>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Ionicons name="pricetag-outline" size={18} color={Colors.terracotta.light} />
            <Typography variant="caption" color={Colors.dark.textMuted}>
              Pricing
            </Typography>
            <Typography variant="bodySmall" weight="700">
              {experience.price}
            </Typography>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Ionicons name="star" size={18} color={Colors.dark.star} />
            <Typography variant="caption" color={Colors.dark.textMuted}>
              Rating
            </Typography>
            <Typography variant="bodySmall" weight="700">
              {experience.rating} ({experience.review_count})
            </Typography>
          </View>
        </View>

        {/* Story */}
        <View style={styles.contentSection}>
          <Typography variant="badge" color={Colors.emerald.accent} weight="700">
            THE EXPERIENCE
          </Typography>
          <Typography variant="bodyLarge" style={styles.desc}>
            {experience.description}
          </Typography>

          {/* Host info */}
          {experience.host_name && (
            <View style={styles.hostCard}>
              <Ionicons name="person-circle-outline" size={32} color={Colors.sand.warm} />
              <View style={styles.hostMeta}>
                <Typography variant="caption" color={Colors.dark.textMuted}>
                  HOSTED BY
                </Typography>
                <Typography variant="body" weight="700">
                  {experience.host_name}
                </Typography>
              </View>
            </View>
          )}

          {/* Inclusions */}
          <Typography variant="h3" weight="700" style={{ marginTop: Spacing.xl, marginBottom: Spacing.sm }}>
            What’s Included
          </Typography>
          <View style={styles.inclusionsList}>
            {experience.inclusions.map((item, i) => (
              <View key={i} style={styles.inclusionRow}>
                <Ionicons name="checkmark-done" size={18} color={Colors.emerald.mint} />
                <Typography variant="body" color={Colors.dark.textSecondary} style={{ marginLeft: Spacing.sm }}>
                  {item}
                </Typography>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View>
          <Typography variant="caption" color={Colors.dark.textMuted}>
            PRICE PER PERSON
          </Typography>
          <Typography variant="h2" color={Colors.sand.warm} weight="700">
            {experience.price}
          </Typography>
        </View>

        <Button
          title="Add to Itinerary +"
          onPress={handleAddToItinerary}
          variant="sunset"
          size="md"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  heroBox: {
    height: 320,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  heroOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(11, 17, 15, 0.45)',
  },
  floatingNav: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 5,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(11, 17, 15, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  heroBottom: {
    zIndex: 2,
    marginTop: 'auto',
  },
  title: {
    color: '#FFFFFF',
    marginTop: 6,
    marginBottom: 4,
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locText: {
    marginLeft: 4,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceElevated,
    marginHorizontal: Spacing.lg,
    marginTop: -24,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    zIndex: 3,
    ...Shadows.md,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: Colors.dark.border,
  },
  contentSection: {
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  desc: {
    lineHeight: 24,
    marginTop: Spacing.xs,
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  hostMeta: {
    marginLeft: Spacing.sm,
  },
  inclusionsList: {
    gap: Spacing.sm,
  },
  inclusionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.dark.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Shadows.lg,
  },
});
