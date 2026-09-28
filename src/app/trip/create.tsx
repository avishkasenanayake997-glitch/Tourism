// ==============================================================================
// Lankora: Trip Creation Wizard
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTrips } from '@/context/TripsContext';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Header } from '@/components/ui/Header';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

const DESTINATION_OPTIONS = [
  'Ella',
  'Sigiriya',
  'Galle Fort',
  'Mirissa',
  'Yala National Park',
  'Kandy',
  'Nuwara Eliya',
  'Arugam Bay',
  'Jaffna',
  'Trincomalee',
];

const STYLE_OPTIONS = [
  { id: 'Discovery', label: 'Discovery & Heritage', icon: 'compass-outline' },
  { id: 'Adventure', label: 'Active Adventure', icon: 'trail-sign-outline' },
  { id: 'Wildlife', label: 'Wildlife & Safari', icon: 'paw-outline' },
  { id: 'Relaxed', label: 'Coastal & Serene', icon: 'sunny-outline' },
];

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=800&q=80',
];

export default function CreateTripScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { createTrip } = useTrips();

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-10');
  const [description, setDescription] = useState('');
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(['Ella', 'Galle Fort']);
  const [selectedStyle, setSelectedStyle] = useState('Discovery');
  const [selectedCover, setSelectedCover] = useState(COVER_PRESETS[0]);
  const [submitting, setSubmitting] = useState(false);

  const toggleDest = (dest: string) => {
    if (selectedDestinations.includes(dest)) {
      if (selectedDestinations.length > 1) {
        setSelectedDestinations(selectedDestinations.filter((d) => d !== dest));
      }
    } else {
      setSelectedDestinations([...selectedDestinations, dest]);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a name for your journey.');
      return;
    }

    setSubmitting(true);
    try {
      const trip = await createTrip({
        user_id: 'current-user',
        title: title.trim(),
        start_date: startDate,
        end_date: endDate,
        description: description.trim() || 'A soulful journey across Sri Lanka.',
        cover_image: selectedCover,
        destinations: selectedDestinations,
        travel_style: selectedStyle,
        status: 'planning',
      });
      router.replace(`/trip/${trip.id}` as any);
    } catch (e) {
      console.warn('Trip creation failed:', e);
      Alert.alert('Error', 'Failed to create trip. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header title="Plan a New Journey" showBack />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Cover Picker */}
        <Typography variant="caption" color={Colors.sand.warm} weight="700">
          JOURNEY COVER
        </Typography>
        <View style={styles.coverPreview}>
          <Image source={{ uri: selectedCover }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
          <View style={styles.coverOverlay} />
          <Typography variant="h2" color="#FFFFFF" weight="700">
            {title || 'Sri Lankan Escape'}
          </Typography>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.presetRow}>
          {COVER_PRESETS.map((url, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedCover(url)}
              style={[styles.presetThumb, selectedCover === url && styles.presetThumbActive]}
            >
              <Image source={{ uri: url }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Title Input */}
        <View style={styles.formGroup}>
          <Typography variant="body" weight="600" style={styles.label}>
            Trip Title
          </Typography>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Misty Hills & Ocean Swells"
            placeholderTextColor={Colors.dark.textMuted}
            style={styles.textInput}
          />
        </View>

        {/* Dates */}
        <View style={styles.dateRow}>
          <View style={[styles.formGroup, { flex: 1, marginRight: Spacing.sm }]}>
            <Typography variant="body" weight="600" style={styles.label}>
              Start Date
            </Typography>
            <TextInput
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.dark.textMuted}
              style={styles.textInput}
            />
          </View>

          <View style={[styles.formGroup, { flex: 1 }]}>
            <Typography variant="body" weight="600" style={styles.label}>
              End Date
            </Typography>
            <TextInput
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.dark.textMuted}
              style={styles.textInput}
            />
          </View>
        </View>

        {/* Destinations Multi-Picker */}
        <View style={styles.formGroup}>
          <Typography variant="body" weight="600" style={styles.label}>
            Destinations to Visit
          </Typography>
          <View style={styles.chipsWrap}>
            {DESTINATION_OPTIONS.map((dest) => {
              const active = selectedDestinations.includes(dest);
              return (
                <TouchableOpacity
                  key={dest}
                  onPress={() => toggleDest(dest)}
                  style={[styles.destChip, active && styles.destChipActive]}
                >
                  <Ionicons
                    name={active ? 'checkmark-circle' : 'add-outline'}
                    size={14}
                    color={active ? '#FFFFFF' : Colors.emerald.mint}
                  />
                  <Typography
                    variant="caption"
                    weight={active ? '700' : '500'}
                    color={active ? '#FFFFFF' : Colors.dark.textSecondary}
                    style={{ marginLeft: 5 }}
                  >
                    {dest}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Travel Style */}
        <View style={styles.formGroup}>
          <Typography variant="body" weight="600" style={styles.label}>
            Travel Pace & Style
          </Typography>
          <View style={styles.styleGrid}>
            {STYLE_OPTIONS.map((opt) => {
              const active = selectedStyle === opt.id;
              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={() => setSelectedStyle(opt.id)}
                  style={[styles.styleCard, active && styles.styleCardActive]}
                >
                  <Ionicons
                    name={opt.icon as any}
                    size={20}
                    color={active ? Colors.emerald.accent : Colors.dark.textMuted}
                  />
                  <Typography
                    variant="caption"
                    weight="700"
                    color={active ? '#FFFFFF' : Colors.dark.textSecondary}
                    style={{ marginTop: 4 }}
                  >
                    {opt.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View style={styles.formGroup}>
          <Typography variant="body" weight="600" style={styles.label}>
            Notes & Intentions
          </Typography>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What memories do you want to create on this island escape?"
            placeholderTextColor={Colors.dark.textMuted}
            multiline
            numberOfLines={3}
            style={[styles.textInput, { minHeight: 80, textAlignVertical: 'top' }]}
          />
        </View>

        {/* Submit */}
        <Button
          title={submitting ? 'Generating Itinerary...' : 'Create Itinerary →'}
          onPress={handleCreate}
          variant="sunset"
          size="lg"
          loading={submitting}
          style={styles.submitBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  coverPreview: {
    height: 140,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
    justifyContent: 'flex-end',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 17, 15, 0.45)',
  },
  presetRow: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  presetThumb: {
    width: 60,
    height: 44,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  presetThumbActive: {
    borderColor: Colors.terracotta.primary,
  },
  formGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.dark.text,
    fontSize: 14,
  },
  dateRow: {
    flexDirection: 'row',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  destChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  destChipActive: {
    backgroundColor: Colors.emerald.vibrant,
    borderColor: Colors.emerald.mint,
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  styleCard: {
    width: '48%',
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
  },
  styleCardActive: {
    borderColor: Colors.emerald.mint,
    backgroundColor: Colors.dark.surfaceHighlight,
  },
  submitBtn: {
    marginTop: Spacing.md,
  },
});
