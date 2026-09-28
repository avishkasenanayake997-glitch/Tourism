// ==============================================================================
// Lankora: Saved (Favorites) Screen (Luxury Bookmarks & Moodboard)
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
import { TargetType, Destination, Experience, Place, Restaurant, Stay } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { EmptyState } from '@/components/ui/EmptyState';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { PlaceCard } from '@/components/cards/PlaceCard';
import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { StayCard } from '@/components/cards/StayCard';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TABS: { id: 'all' | TargetType; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: 'heart' },
  { id: 'destination', label: 'Destinations', icon: 'compass' },
  { id: 'experience', label: 'Experiences', icon: 'trail-sign' },
  { id: 'place', label: 'Sights', icon: 'business' },
  { id: 'restaurant', label: 'Dining', icon: 'restaurant' },
  { id: 'stay', label: 'Retreats', icon: 'bed' },
];

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<'all' | TargetType>('all');

  const filtered = favorites.filter((f) => {
    if (activeTab === 'all') return true;
    return f.target_type === activeTab;
  });

  const cardWidth = SCREEN_WIDTH - 32;

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top Luxury Header */}
      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <View style={styles.badgeRow}>
            <Ionicons name="bookmark" size={13} color={Colors.terracotta.primary} />
            <Typography variant="badge" color={Colors.terracotta.primary} weight="800">
              SAVED WONDERS
            </Typography>
          </View>
          <Typography variant="display" color="#FFFFFF" weight="800" style={styles.screenTitle}>
            Your Collection
          </Typography>
        </View>

        <View style={styles.countPill}>
          <Typography variant="caption" color={Colors.gold.primary} weight="800">
            {favorites.length} SAVED
          </Typography>
        </View>
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
                <Ionicons
                  name={tab.icon as any}
                  size={12}
                  color={active ? '#000000' : Colors.terracotta.primary}
                />
                <Typography
                  variant="caption"
                  weight={active ? '800' : '600'}
                  color={active ? '#000000' : 'rgba(255, 255, 255, 0.8)'}
                  style={{ marginLeft: 4 }}
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
          contentContainerStyle={[styles.scrollList, { paddingBottom: 110 }]}
        >
          {filtered.map((fav) => {
            if (!fav.item) return null;
            return (
              <View key={fav.id} style={styles.itemWrapper}>
                {fav.target_type === 'destination' && (
                  <DestinationCard destination={fav.item as Destination} variant="featured" />
                )}
                {fav.target_type === 'experience' && (
                  <ExperienceCard experience={fav.item as Experience} width={cardWidth} />
                )}
                {fav.target_type === 'place' && (
                  <PlaceCard place={fav.item as Place} width={cardWidth} />
                )}
                {fav.target_type === 'restaurant' && (
                  <RestaurantCard restaurant={fav.item as Restaurant} width={cardWidth} />
                )}
                {fav.target_type === 'stay' && (
                  <StayCard stay={fav.item as Stay} width={cardWidth} />
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
    backgroundColor: '#070A09',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  titleGroup: {
    flex: 1,
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
  countPill: {
    backgroundColor: 'rgba(245, 176, 65, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(245, 176, 65, 0.3)',
  },
  tabsWrapper: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  tabsRow: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1714',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabButtonActive: {
    backgroundColor: Colors.gold.primary,
    borderColor: Colors.gold.primary,
  },
  scrollList: {
    paddingHorizontal: Spacing.lg,
    gap: 16,
  },
  itemWrapper: {
    width: '100%',
  },
});
