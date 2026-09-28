// ==============================================================================
// Lankora: Trip Planner Screen (Luxury Journey Architect)
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
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTrips } from '@/context/TripsContext';
import { Trip } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { trips, deleteTrip } = useTrips();

  const handleDelete = (trip: Trip) => {
    Alert.alert(
      'Delete Itinerary',
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
          <View style={styles.badgeRow}>
            <Ionicons name="compass" size={13} color={Colors.gold.primary} />
            <Typography variant="badge" color={Colors.gold.primary} weight="800">
              EXPEDITIONS & JOURNEYS
            </Typography>
          </View>
          <Typography variant="display" color="#FFFFFF" weight="800" style={styles.screenTitle}>
            My Itineraries
          </Typography>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push('/trip/create' as any)}
          style={styles.newTripBtn}
        >
          <LinearGradient
            colors={['#F5B041', '#E76F51']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.newTripGradient}
          >
            <Ionicons name="add" size={16} color="#000000" />
            <Typography variant="caption" color="#000000" weight="800">
              New Trip
            </Typography>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {trips.length === 0 ? (
        <EmptyState
          icon="map-outline"
          title="Your Next Expedition Awaits"
          description="Build a day-by-day itinerary connecting Ella's cloud tea peaks, Yala's leopard trails, and Galle's colonial bastions."
          actionTitle="Plan with AI Architect"
          onAction={() => router.push('/trip/create' as any)}
          style={{ flex: 1 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollList, { paddingBottom: 110 }]}
        >
          {trips.map((trip) => {
            const itemCount = trip.items?.length || 0;
            return (
              <TouchableOpacity
                key={trip.id}
                activeOpacity={0.92}
                onPress={() => router.push(`/trip/${trip.id}` as any)}
                style={[styles.tripCard, Shadows.lg]}
              >
                {/* Cover Photo */}
                <View style={styles.coverBox}>
                  <Image
                    source={{ uri: trip.cover_image }}
                    style={StyleSheet.absoluteFill}
                    contentFit="cover"
                    transition={250}
                  />
                  <LinearGradient
                    colors={['rgba(7, 10, 9, 0.2)', 'rgba(7, 10, 9, 0.85)']}
                    locations={[0, 1]}
                    style={StyleSheet.absoluteFill}
                  />

                  <View style={styles.coverTopRow}>
                    <Badge
                      label={trip.status.toUpperCase()}
                      variant={trip.status === 'planning' ? 'gold' : 'emerald'}
                      size="sm"
                    />
                    <TouchableOpacity
                      onPress={() => handleDelete(trip)}
                      style={styles.deleteBtn}
                    >
                      <Ionicons name="trash-outline" size={15} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.coverBottom}>
                    <View style={styles.datePill}>
                      <Ionicons name="calendar-outline" size={12} color={Colors.gold.light} />
                      <Typography variant="caption" color="#FCD34D" weight="700">
                        {trip.start_date} → {trip.end_date}
                      </Typography>
                    </View>

                    <Typography variant="h2" color="#FFFFFF" weight="800" numberOfLines={1} style={styles.tripTitle}>
                      {trip.title}
                    </Typography>
                  </View>
                </View>

                {/* Card Meta & Itinerary Teaser */}
                <View style={styles.cardContent}>
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="location-outline" size={14} color={Colors.emerald.accent} />
                      <Typography variant="bodySmall" color="#FFFFFF" weight="600" numberOfLines={1} style={{ flex: 1, marginLeft: 4 }}>
                        {trip.destinations.join(' · ')}
                      </Typography>
                    </View>

                    <View style={styles.activityBadge}>
                      <Typography variant="caption" color={Colors.gold.primary} weight="800">
                        {itemCount} {itemCount === 1 ? 'PLAN' : 'PLANS'}
                      </Typography>
                    </View>
                  </View>

                  {trip.description && (
                    <Typography
                      variant="bodySmall"
                      color="rgba(255, 255, 255, 0.65)"
                      numberOfLines={2}
                      style={styles.description}
                    >
                      {trip.description}
                    </Typography>
                  )}

                  <View style={styles.footerRow}>
                    <View style={styles.stylePill}>
                      <Ionicons name="leaf-outline" size={12} color={Colors.emerald.accent} />
                      <Typography variant="caption" color={Colors.emerald.accent} weight="700">
                        {trip.travel_style || 'Discovery'}
                      </Typography>
                    </View>

                    <View style={styles.viewTimelineBtn}>
                      <Typography variant="caption" color="#FFFFFF" weight="800">
                        View Schedule
                      </Typography>
                      <Ionicons name="arrow-forward" size={12} color="#FFFFFF" style={{ marginLeft: 4 }} />
                    </View>
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
    backgroundColor: '#070A09',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  screenTitle: {
    letterSpacing: -0.6,
  },
  newTripBtn: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  newTripGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 8,
    gap: 4,
  },
  scrollList: {
    paddingHorizontal: Spacing.lg,
    gap: 18,
  },
  tripCard: {
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    backgroundColor: '#0E1512',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  coverBox: {
    height: 180,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  coverTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(12, 18, 15, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  coverBottom: {
    gap: 4,
  },
  datePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(12, 18, 15, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(245, 176, 65, 0.3)',
  },
  tripTitle: {
    letterSpacing: -0.4,
  },
  cardContent: {
    padding: Spacing.lg,
    backgroundColor: '#0E1512',
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
    flex: 1,
  },
  activityBadge: {
    backgroundColor: 'rgba(245, 176, 65, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(245, 176, 65, 0.3)',
  },
  description: {
    lineHeight: 19,
    marginBottom: Spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: Spacing.sm,
  },
  stylePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  viewTimelineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
});
