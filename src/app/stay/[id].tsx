// ==============================================================================
// Lankora: Stay & Eco-Lodge Detail Screen
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { dataService } from '@/services/dataService';
import { Stay } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useTrips } from '@/context/TripsContext';

export default function StayDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, addItemToTrip } = useTrips();

  const [stay, setStay] = useState<Stay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      dataService.getStayById(id).then((s) => {
        setStay(s);
        setLoading(false);
      });
    }
  }, [id]);

  const handleAddToItinerary = async () => {
    if (!stay) return;
    if (trips.length === 0) {
      Alert.alert('No Trips Yet', 'Create a trip first to add this stay.', [
        { text: 'Create Trip', onPress: () => router.push('/trip/create' as any) },
        { text: 'Cancel' },
      ]);
      return;
    }
    const trip = trips[0];
    await addItemToTrip(trip.id, {
      target_type: 'stay',
      target_id: stay.id,
      title: `Check-in: ${stay.name}`,
      day_number: 1,
      start_time: '03:00 PM',
      location: stay.location,
      notes: `Type: ${stay.type} · ${stay.price_range}`,
      order_index: 1,
    });
    Alert.alert('Added', `Added "${stay.name}" to your "${trip.title}" itinerary.`);
  };

  if (loading || !stay) {
    return <View style={styles.screen} />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Hero Photo */}
        <View style={styles.heroBox}>
          <Image
            source={{ uri: stay.images[0] }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />

          <View style={[styles.floatingNav, { top: Math.max(insets.top, 16) }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <FavoriteButton
              targetType="stay"
              targetId={stay.id}
              itemData={stay}
              size={40}
              iconSize={20}
            />
          </View>

          <View style={styles.heroBottom}>
            <Badge label={stay.type} variant="sand" size="md" />
            <Typography variant="h1" color="#FFFFFF" weight="700" style={styles.title}>
              {stay.name}
            </Typography>
            <View style={styles.locRow}>
              <Ionicons name="location-outline" size={16} color={Colors.sand.warm} />
              <Typography variant="body" color={Colors.sand.soft} style={styles.locText}>
                {stay.location}
              </Typography>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsBar}>
          <View style={styles.statBox}>
            <Ionicons name="bed-outline" size={18} color={Colors.sand.warm} />
            <Typography variant="caption" color={Colors.dark.textMuted}>
              Category
            </Typography>
            <Typography variant="bodySmall" weight="700">
              {stay.type}
            </Typography>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Ionicons name="pricetag-outline" size={18} color={Colors.emerald.mint} />
            <Typography variant="caption" color={Colors.dark.textMuted}>
              Per Night
            </Typography>
            <Typography variant="bodySmall" weight="700">
              {stay.price_range}
            </Typography>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Ionicons name="star" size={18} color={Colors.dark.star} />
            <Typography variant="caption" color={Colors.dark.textMuted}>
              Rating
            </Typography>
            <Typography variant="bodySmall" weight="700">
              {stay.rating} ({stay.review_count})
            </Typography>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          <Typography variant="badge" color={Colors.sand.warm} weight="700">
            THE RETREAT
          </Typography>
          <Typography variant="bodyLarge" style={styles.desc}>
            {stay.description}
          </Typography>

          {/* Amenities */}
          <Typography variant="h3" weight="700" style={{ marginTop: Spacing.xl, marginBottom: Spacing.sm }}>
            Boutique Amenities
          </Typography>
          <View style={styles.amenitiesGrid}>
            {stay.amenities.map((amenity, i) => (
              <View key={i} style={styles.amenityChip}>
                <Ionicons name="sparkles" size={14} color={Colors.emerald.mint} />
                <Typography variant="bodySmall" color={Colors.dark.textSecondary} style={{ marginLeft: 6 }}>
                  {amenity}
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
            STARTING FROM
          </Typography>
          <Typography variant="h2" color={Colors.sand.warm} weight="700">
            {stay.price_range.split('-')[0]}
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
    ...StyleSheet.absoluteFillObject,
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
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceElevated,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.dark.border,
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
