// ==============================================================================
// Lankora: Place Detail Screen (Heritage, Viewpoints & Nature)
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
import { Place } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useTrips } from '@/context/TripsContext';

export default function PlaceDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, addItemToTrip } = useTrips();

  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      dataService.getPlaceById(id).then((p) => {
        setPlace(p);
        setLoading(false);
      });
    }
  }, [id]);

  const handleAddToItinerary = async () => {
    if (!place) return;
    if (trips.length === 0) {
      Alert.alert('No Trips Yet', 'Create a trip first to add this place.', [
        { text: 'Create Trip', onPress: () => router.push('/trip/create' as any) },
        { text: 'Cancel' },
      ]);
      return;
    }
    const trip = trips[0];
    await addItemToTrip(trip.id, {
      target_type: 'place',
      target_id: place.id,
      title: place.name,
      day_number: 1,
      start_time: '02:00 PM',
      location: place.location,
      notes: `Entry Fee: ${place.entry_fee} · ${place.opening_hours}`,
      order_index: 0,
    });
    Alert.alert('Added', `Added "${place.name}" to your "${trip.title}" itinerary.`);
  };

  if (loading || !place) {
    return <View style={styles.screen} />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Photo */}
        <View style={styles.heroBox}>
          <Image
            source={{ uri: place.images[0] }}
            style={(StyleSheet.absoluteFill as any)}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />

          <View style={[styles.floatingNav, { top: Math.max(insets.top, 16) }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.navRight}>
              <FavoriteButton
                targetType="place"
                targetId={place.id}
                itemData={place}
                size={40}
                iconSize={20}
              />
            </View>
          </View>

          <View style={styles.heroBottom}>
            <Badge label={place.category} variant="emerald" size="md" />
            <Typography variant="h1" color="#FFFFFF" weight="700" style={styles.title}>
              {place.name}
            </Typography>
            <View style={styles.locRow}>
              <Ionicons name="location-outline" size={16} color={Colors.sand.warm} />
              <Typography variant="body" color={Colors.sand.soft} style={styles.locText}>
                {place.location}
              </Typography>
            </View>
          </View>
        </View>

        {/* Practical Info Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statBox}>
            <Ionicons name="time-outline" size={18} color={Colors.emerald.mint} />
            <Typography variant="caption" color={Colors.dark.textMuted}>
              Hours
            </Typography>
            <Typography variant="bodySmall" weight="700">
              {place.opening_hours}
            </Typography>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Ionicons name="cash-outline" size={18} color={Colors.terracotta.light} />
            <Typography variant="caption" color={Colors.dark.textMuted}>
              Entry Fee
            </Typography>
            <Typography variant="bodySmall" weight="700">
              {place.entry_fee}
            </Typography>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Ionicons name="star" size={18} color={Colors.dark.star} />
            <Typography variant="caption" color={Colors.dark.textMuted}>
              Rating
            </Typography>
            <Typography variant="bodySmall" weight="700">
              {place.rating} ({place.review_count})
            </Typography>
          </View>
        </View>

        {/* Narrative Description */}
        <View style={styles.contentSection}>
          <Typography variant="badge" color={Colors.emerald.accent} weight="700">
            HERITAGE & SIGNIFICANCE
          </Typography>
          <Typography variant="bodyLarge" style={styles.desc}>
            {place.description}
          </Typography>

          {/* Traveler Tips */}
          {place.tips && (
            <View style={styles.tipsBox}>
              <View style={styles.tipHeader}>
                <Ionicons name="bulb-outline" size={20} color={Colors.sand.warm} />
                <Typography variant="body" weight="700" color={Colors.sand.warm} style={{ marginLeft: 6 }}>
                  Insider Travel Tip
                </Typography>
              </View>
              <Typography variant="bodySmall" color={Colors.dark.textSecondary} style={{ lineHeight: 19 }}>
                {place.tips}
              </Typography>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View>
          <Typography variant="caption" color={Colors.dark.textMuted}>
            ENTRY FEE
          </Typography>
          <Typography variant="h2" color={Colors.emerald.accent} weight="700">
            {place.entry_fee}
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
    marginBottom: Spacing.lg,
  },
  tipsBox: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(244, 162, 97, 0.3)',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
