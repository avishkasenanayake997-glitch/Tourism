// ==============================================================================
// Lankora: Trip & Itinerary Manager Screen
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTrips } from '@/context/TripsContext';
import { Trip, ItineraryItem } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export default function TripDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, updateTrip, addItemToTrip, removeItemFromTrip } = useTrips();

  const trip = trips.find((t) => t.id === id);
  const [selectedDay, setSelectedDay] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // New activity form
  const [activityTitle, setActivityTitle] = useState('');
  const [activityTime, setActivityTime] = useState('10:00 AM');
  const [activityLocation, setActivityLocation] = useState('');
  const [activityNotes, setActivityNotes] = useState('');

  if (!trip) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top, padding: Spacing.xl, alignItems: 'center' }]}>
        <Typography variant="h2">Trip Not Found</Typography>
        <Button title="Back to Trips" onPress={() => router.back()} style={{ marginTop: Spacing.lg }} />
      </View>
    );
  }

  const items = trip.items || [];
  const dayItems = items
    .filter((item) => item.day_number === selectedDay)
    .sort((a, b) => a.order_index - b.order_index);

  const handleAddActivity = async () => {
    if (!activityTitle.trim()) {
      Alert.alert('Missing Title', 'Please enter an activity title.');
      return;
    }

    await addItemToTrip(trip.id, {
      target_type: 'custom',
      title: activityTitle.trim(),
      day_number: selectedDay,
      start_time: activityTime.trim() || '10:00 AM',
      location: activityLocation.trim() || trip.destinations[0] || 'Sri Lanka',
      notes: activityNotes.trim(),
      order_index: dayItems.length,
    });

    setActivityTitle('');
    setActivityLocation('');
    setActivityNotes('');
    setShowAddModal(false);
  };

  const handleRemoveActivity = (item: ItineraryItem) => {
    Alert.alert('Remove Activity', `Remove "${item.title}" from Day ${selectedDay}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeItemFromTrip(trip.id, item.id) },
    ]);
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Cover Header */}
        <View style={styles.coverBox}>
          <Image source={{ uri: trip.cover_image }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
          <View style={styles.coverOverlay} />

          <View style={[styles.floatingNav, { top: Math.max(insets.top, 16) }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <Badge label={trip.travel_style.toUpperCase()} variant="emerald" size="sm" />
          </View>

          <View style={styles.coverBottom}>
            <Typography variant="caption" color={Colors.sand.warm} weight="700">
              {trip.start_date} → {trip.end_date}
            </Typography>
            <Typography variant="h1" color="#FFFFFF" weight="800" style={styles.tripTitle}>
              {trip.title}
            </Typography>
            <View style={styles.destList}>
              <Ionicons name="location-outline" size={16} color={Colors.emerald.mint} />
              <Typography variant="bodySmall" color={Colors.sand.soft} style={{ marginLeft: 4 }}>
                {trip.destinations.join(' · ')}
              </Typography>
            </View>
          </View>
        </View>

        {/* Day Selector Horizontal Strip */}
        <View style={styles.daysStrip}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
              const active = selectedDay === day;
              const dayCount = items.filter((i) => i.day_number === day).length;
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => setSelectedDay(day)}
                  style={[styles.dayTab, active && styles.dayTabActive]}
                >
                  <Typography
                    variant="caption"
                    weight={active ? '800' : '600'}
                    color={active ? '#FFFFFF' : Colors.dark.textSecondary}
                  >
                    DAY {day}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={active ? Colors.sand.warm : Colors.dark.textMuted}
                    style={{ fontSize: 9.5 }}
                  >
                    {dayCount} {dayCount === 1 ? 'stop' : 'stops'}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Day Schedule Header */}
        <View style={styles.dayHeaderRow}>
          <View>
            <Typography variant="badge" color={Colors.terracotta.light} weight="700">
              DAY {selectedDay} TIMELINE
            </Typography>
            <Typography variant="h2" weight="700">
              Planned Experiences
            </Typography>
          </View>

          <TouchableOpacity
            onPress={() => setShowAddModal(true)}
            style={styles.addStopBtn}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Typography variant="caption" color="#FFFFFF" weight="700" style={{ marginLeft: 4 }}>
              Add Stop
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Timeline Items */}
        {dayItems.length === 0 ? (
          <View style={styles.emptyDayBox}>
            <Ionicons name="compass-outline" size={36} color={Colors.emerald.mint} />
            <Typography variant="body" weight="700" color={Colors.dark.text} style={{ marginTop: 8 }}>
              No activities scheduled for Day {selectedDay}
            </Typography>
            <Typography variant="caption" color={Colors.dark.textMuted} align="center" style={{ marginTop: 4, maxWidth: 260 }}>
              Add a sunset hike, train crossing, or Ceylon curry feast to build out this day.
            </Typography>
            <Button
              title="+ Add Activity"
              onPress={() => setShowAddModal(true)}
              variant="outline"
              size="sm"
              style={{ marginTop: Spacing.md }}
            />
          </View>
        ) : (
          <View style={styles.timelineList}>
            {dayItems.map((item, idx) => (
              <View key={item.id} style={styles.timelineItem}>
                {/* Time Indicator */}
                <View style={styles.timeColumn}>
                  <Typography variant="caption" weight="700" color={Colors.sand.warm}>
                    {item.start_time || 'Morning'}
                  </Typography>
                  <View style={styles.verticalLine} />
                </View>

                {/* Content Box */}
                <View style={[styles.itemCard, Shadows.sm]}>
                  <View style={styles.itemTop}>
                    <Badge label={item.target_type.toUpperCase()} variant="emerald" size="sm" />
                    <TouchableOpacity onPress={() => handleRemoveActivity(item)}>
                      <Ionicons name="trash-outline" size={16} color={Colors.dark.textMuted} />
                    </TouchableOpacity>
                  </View>

                  <Typography variant="bodyLarge" weight="700" style={styles.itemTitle}>
                    {item.title}
                  </Typography>

                  {item.location && (
                    <View style={styles.itemLoc}>
                      <Ionicons name="location-outline" size={14} color={Colors.dark.textMuted} />
                      <Typography variant="caption" color={Colors.dark.textMuted} style={{ marginLeft: 4 }}>
                        {item.location}
                      </Typography>
                    </View>
                  )}

                  {item.notes && (
                    <Typography variant="bodySmall" color={Colors.dark.textSecondary} style={styles.itemNotes}>
                      💡 {item.notes}
                    </Typography>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Activity Modal */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" weight="700">
                Add to Day {selectedDay}
              </Typography>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalField}>
              <Typography variant="caption" color={Colors.dark.textMuted} weight="600">
                ACTIVITY TITLE
              </Typography>
              <TextInput
                value={activityTitle}
                onChangeText={setActivityTitle}
                placeholder="e.g. Dawn climb at Little Adam's Peak"
                placeholderTextColor={Colors.dark.textMuted}
                style={styles.modalInput}
              />
            </View>

            <View style={styles.modalField}>
              <Typography variant="caption" color={Colors.dark.textMuted} weight="600">
                SCHEDULED TIME
              </Typography>
              <TextInput
                value={activityTime}
                onChangeText={setActivityTime}
                placeholder="08:30 AM"
                placeholderTextColor={Colors.dark.textMuted}
                style={styles.modalInput}
              />
            </View>

            <View style={styles.modalField}>
              <Typography variant="caption" color={Colors.dark.textMuted} weight="600">
                LOCATION
              </Typography>
              <TextInput
                value={activityLocation}
                onChangeText={setActivityLocation}
                placeholder="Ella Gap, Badulla"
                placeholderTextColor={Colors.dark.textMuted}
                style={styles.modalInput}
              />
            </View>

            <View style={styles.modalField}>
              <Typography variant="caption" color={Colors.dark.textMuted} weight="600">
                TRAVEL TIPS OR NOTES
              </Typography>
              <TextInput
                value={activityNotes}
                onChangeText={setActivityNotes}
                placeholder="Carry water and headlamp for sunrise"
                placeholderTextColor={Colors.dark.textMuted}
                style={styles.modalInput}
              />
            </View>

            <Button
              title="Add to Schedule"
              onPress={handleAddActivity}
              variant="sunset"
              size="md"
              style={{ marginTop: Spacing.md }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  coverBox: {
    height: 280,
    width: '100%',
    position: 'relative',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 17, 15, 0.52)',
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(11, 17, 15, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverBottom: {
    zIndex: 2,
    marginTop: 'auto',
  },
  tripTitle: {
    marginTop: 4,
    marginBottom: 4,
  },
  destList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  daysStrip: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    paddingVertical: Spacing.xs,
  },
  daysRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  dayTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayTabActive: {
    backgroundColor: Colors.emerald.vibrant,
    borderColor: Colors.emerald.mint,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  addStopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.terracotta.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  emptyDayBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing['3xl'],
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  timelineList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timeColumn: {
    width: 75,
    alignItems: 'center',
    paddingTop: 4,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.dark.border,
    marginTop: 8,
  },
  itemCard: {
    flex: 1,
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTitle: {
    marginBottom: 4,
  },
  itemLoc: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemNotes: {
    marginTop: 4,
    lineHeight: 18,
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalField: {
    marginBottom: Spacing.md,
  },
  modalInput: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.dark.text,
    marginTop: 4,
  },
});
