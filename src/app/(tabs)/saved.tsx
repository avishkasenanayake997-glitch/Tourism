// ==============================================================================
// Lankora: Saved (Favorites) Screen
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useFavorites } from '@/context/FavoritesContext';
import { TargetType } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { EmptyState } from '@/components/ui/EmptyState';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { PlaceCard } from '@/components/cards/PlaceCard';
import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { StayCard } from '@/components/cards/StayCard';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

const TABS: { id: 'all' | TargetType; label: string }[] = [
  { id: 'all', label: 'All Saved' },
  { id: 'destination', label: 'Destinations' },
  { id: 'experience', label: 'Experiences' },
  { id: 'place', label: 'Places' },
  { id: 'restaurant', label: 'Dining' },
  { id: 'stay', label: 'Stays' },
];

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { favorites, isLoading } = useFavorites();
  const [activeTab, setActiveTab] = useState<'all' | TargetType>('all');

  const filtered = favorites.filter((f) => {
    if (activeTab === 'all') return true;
    return f.target_type === activeTab;
  });

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <Typography variant="badge" color={Colors.terracotta.light} weight="700">
          SAVED WONDERS
        </Typography>
        <Typography variant="h2" weight="700">
          Your Curated Collection
        </Typography>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {TABS.map((tab) => {
            const count =
              tab.id === 'all'
                ? favorites.length
                : favorites.filter((f) => f.target_type === tab.id).length;
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabButton, active && styles.tabButtonActive]}
              >
                <Typography
                  variant="caption"
                  weight={active ? '700' : '500'}
                  color={active ? '#FFFFFF' : Colors.dark.textSecondary}
                >
                  {tab.label} ({count})
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Bookmarks List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="Your Next Favorite Place Awaits"
          description="Save destinations, train journeys, eco-lodges, and Ceylon curries with the heart icon to access them anytime."
          actionTitle="Explore Ceylon"
          onAction={() => router.push('/(tabs)/explore' as any)}
          style={{ flex: 1 }}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollList}
        >
          {filtered.map((fav) => {
            if (!fav.item) return null;
            return (
              <View key={fav.id} style={styles.itemWrapper}>
                {fav.target_type === 'destination' && (
                  <DestinationCard destination={fav.item} variant="featured" />
                )}
                {fav.target_type === 'experience' && (
                  <ExperienceCard experience={fav.item} width={Dimensions.get('window').width - 40} />
                )}
                {fav.target_type === 'place' && (
                  <PlaceCard place={fav.item} width={Dimensions.get('window').width - 40} />
                )}
                {fav.target_type === 'restaurant' && (
                  <RestaurantCard restaurant={fav.item} width={Dimensions.get('window').width - 40} />
                )}
                {fav.target_type === 'stay' && (
                  <StayCard stay={fav.item} width={Dimensions.get('window').width - 40} />
                )}
              </View>
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  tabsWrapper: {
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  tabsRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  tabButton: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  tabButtonActive: {
    backgroundColor: Colors.emerald.vibrant,
    borderColor: Colors.emerald.mint,
  },
  scrollList: {
    padding: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: 60,
  },
  itemWrapper: {
    width: '100%',
  },
});
