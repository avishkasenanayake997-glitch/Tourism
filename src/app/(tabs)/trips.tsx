// ==============================================================================
// Lankora: Trip Planner Screen
// ==============================================================================

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTrips } from '@/context/TripsContext';
import { Trip } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { trips, deleteTrip, isLoading } = useTrips();

  const handleDelete = (trip: Trip) => {
    Alert.alert(
      'Delete Trip',
      `Are you sure you want to remove "${trip.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTrip(trip.id) },
      ]
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Typography variant="badge" color={Colors.emerald.accent} weight="700">
            MY ITINERARIES
          </Typography>
          <Typography variant="h2" weight="700">
            Sri Lankan Journeys
          </Typography>
        </View>

        <Button
          title="+ New Trip"
          onPress={() => router.push('/trip/create' as any)}
          variant="sunset"
          size="sm"
        />
      </View>

      {trips.length === 0 ? (
        <EmptyState
          icon="map-outline"
          title="Your Next Adventure Starts Here"
          description="Build a day-by-day itinerary connecting Ella’s tea valleys, Yala’s leopard trails, and Galle Fort’s ocean bastions."
          actionTitle="Plan a New Trip"
          onAction={() => router.push('/trip/create' as any)}
          style={{ flex: 1 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollList}
        >
          {trips.map((trip) => {
            const itemCount = trip.items?.length || 0;
            return (
              <TouchableOpacity
                key={trip.id}
                activeOpacity={0.9}
                onPress={() => router.push(`/trip/${trip.id}` as any)}
                style={[styles.tripCard, Shadows.md]}
              >
                {/* Cover Photo */}
                <View style={styles.coverBox}>
                  <Image
                    source={{ uri: trip.cover_image }}
                    style={(StyleSheet.absoluteFill as any)}
                    contentFit="cover"
                    transition={250}
                  />
                  <View style={styles.coverOverlay} />

                  <View style={styles.coverTopRow}>
                    <Badge
                      label={trip.status.toUpperCase()}
                      variant={trip.status === 'planning' ? 'terracotta' : 'emerald'}
                      size="sm"
                    />
                    <TouchableOpacity
                      onPress={() => handleDelete(trip)}
                      style={styles.deleteBtn}
                    >
                      <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.coverBottom}>
                    <Typography variant="caption" color={Colors.sand.warm} weight="600">
                      {trip.start_date} → {trip.end_date}
                    </Typography>
                    <Typography variant="h2" color="#FFFFFF" weight="700" style={styles.tripTitle}>
                      {trip.title}
                    </Typography>
                  </View>
                </View>

                {/* Card Meta & Itinerary Teaser */}
                <View style={styles.cardContent}>
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="location-outline" size={15} color={Colors.emerald.mint} />
                      <Typography variant="bodySmall" color={Colors.dark.textSecondary} style={styles.metaText}>
                        {trip.destinations.join(' · ')}
                      </Typography>
                    </View>

                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={15} color={Colors.sand.warm} />
                      <Typography variant="bodySmall" color={Colors.dark.textSecondary} style={styles.metaText}>
                        {itemCount} {itemCount === 1 ? 'Activity' : 'Activities'}
                      </Typography>
                    </View>
                  </View>

                  {trip.description && (
                    <Typography
                      variant="bodySmall"
                      color={Colors.dark.textMuted}
                      numberOfLines={2}
                      style={styles.desc}
                    >
                      {trip.description}
                    </Typography>
                  )}

                  <View style={styles.viewPlanRow}>
                    <Typography variant="caption" color={Colors.emerald.accent} weight="700">
                      View Full Day-by-Day Timeline
                    </Typography>
                    <Ionicons name="arrow-forward" size={14} color={Colors.emerald.accent} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  scrollList: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    paddingBottom: 60,
  },
  tripCard: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  coverBox: {
    height: 180,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  coverOverlay: {
    ...(StyleSheet.absoluteFill as any),
    backgroundColor: 'rgba(11, 17, 15, 0.45)',
  },
  coverTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(11, 17, 15, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverBottom: {
    zIndex: 2,
  },
  tripTitle: {
    marginTop: 2,
  },
  cardContent: {
    padding: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 5,
  },
  desc: {
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  viewPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
});
