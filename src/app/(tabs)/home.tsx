// ==============================================================================
// Lankora: Discover Home Screen
// Editorial, human-centered Sri Lankan tourism experience
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { dataService } from '@/services/dataService';
import { Destination, Experience, Place } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { PlaceCard } from '@/components/cards/PlaceCard';
import { Skeleton } from '@/components/ui/SkeletonLoader';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'All of Ceylon', icon: 'sparkles' },
  { id: 'Hill Country', label: 'Hill Country', icon: 'leaf' },
  { id: 'Southern Coast', label: 'Southern Coast', icon: 'sunny' },
  { id: 'Cultural Triangle', label: 'Ancient Cities', icon: 'ribbon' },
  { id: 'Wildlife Safari', label: 'Wild Safaris', icon: 'paw' },
  { id: 'Eastern Coast', label: 'East & Waves', icon: 'water' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [dests, exps, plc] = await Promise.all([
        dataService.getDestinations(),
        dataService.getExperiences(),
        dataService.getPlaces(),
      ]);
      setDestinations(dests);
      setExperiences(exps);
      setPlaces(plc);
    } catch (e) {
      console.warn('Error loading home data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const featuredDest = destinations.find((d) => d.is_featured) || destinations[0];
  const hiddenGems = destinations.filter((d) => d.is_hidden_gem);
  const filteredDestinations =
    selectedCategory === 'all'
      ? destinations
      : destinations.filter((d) => d.category === selectedCategory);

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.emerald.mint} />
        }
      >
        {/* ==================================================================== */}
        {/* HERO SECTION */}
        {/* ==================================================================== */}
        <View style={[styles.heroContainer, { paddingTop: Math.max(insets.top, 24) }]}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80' }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            priority="high"
          />
          <View style={styles.heroOverlay} />

          {/* Top Brand & Search Trigger Bar */}
          <View style={styles.heroTopRow}>
            <View>
              <Typography variant="badge" color={Colors.sand.warm} weight="700">
                AYUBOWAN · ආයුබෝවන්
              </Typography>
              <Typography variant="display" color="#FFFFFF" weight="800" style={styles.brandTitle}>
                Lankora
              </Typography>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/search' as any)}
              style={styles.searchIconButton}
            >
              <Ionicons name="search" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Emotional Statement */}
          <View style={styles.heroMessageBlock}>
            <Typography variant="h1" color="#FFFFFF" weight="700" style={styles.heroTagline}>
              Discover Sri Lanka{'\n'}differently.
            </Typography>
            <Typography variant="body" color={Colors.sand.soft} style={styles.heroSubtitle}>
              From misty emerald tea ridges to ancient lion fortresses and untold coastal shores.
            </Typography>

            {/* Quick Search Action Bar */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push('/search' as any)}
              style={styles.searchBarTrigger}
            >
              <Ionicons name="compass-outline" size={20} color={Colors.emerald.mint} />
              <Typography variant="body" color={Colors.dark.textMuted} style={styles.searchPlaceholder}>
                Where does your curiosity lead you?
              </Typography>
              <View style={styles.searchArrow}>
                <Ionicons name="arrow-forward" size={16} color={Colors.sand.warm} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ==================================================================== */}
        {/* CATEGORY CHIPS */}
        {/* ==================================================================== */}
        <View style={styles.categorySection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={14}
                    color={active ? '#FFFFFF' : Colors.emerald.mint}
                    style={styles.categoryIcon}
                  />
                  <Typography
                    variant="caption"
                    weight={active ? '700' : '500'}
                    color={active ? '#FFFFFF' : Colors.dark.textSecondary}
                  >
                    {cat.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ==================================================================== */}
        {/* POPULAR DESTINATIONS */}
        {/* ==================================================================== */}
        <View style={styles.sectionHeader}>
          <View>
            <Typography variant="badge" color={Colors.emerald.accent} weight="700">
              WANDERLUST
            </Typography>
            <Typography variant="h2" weight="700">
              Iconic Destinations
            </Typography>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as any)}>
            <Typography variant="caption" color={Colors.terracotta.light} weight="600">
              See All ({destinations.length}) →
            </Typography>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.skeletonContainer}>
            <Skeleton height={280} width={SCREEN_WIDTH - 40} borderRadius={BorderRadius.xl} />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCardRow}
          >
            {filteredDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} variant="standard" />
            ))}
          </ScrollView>
        )}

        {/* ==================================================================== */}
        {/* SIGNATURE EXPERIENCES */}
        {/* ==================================================================== */}
        <View style={[styles.sectionHeader, { marginTop: Spacing['3xl'] }]}>
          <View>
            <Typography variant="badge" color={Colors.terracotta.light} weight="700">
              EXPERIENCES
            </Typography>
            <Typography variant="h2" weight="700">
              Feel the Island Alive
            </Typography>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as any)}>
            <Typography variant="caption" color={Colors.emerald.accent} weight="600">
              View All →
            </Typography>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.skeletonContainer}>
            <Skeleton height={200} width={240} borderRadius={BorderRadius.lg} />
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalCardRow}
          >
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} width={250} />
            ))}
          </ScrollView>
        )}

        {/* ==================================================================== */}
        {/* HIDDEN GEMS */}
        {/* ==================================================================== */}
        {hiddenGems.length > 0 && (
          <View style={[styles.sectionContainer, { marginTop: Spacing['3xl'] }]}>
            <View style={styles.sectionHeaderNoPad}>
              <View>
                <Typography variant="badge" color={Colors.sand.warm} weight="700">
                  OFF THE BEATEN TRACK
                </Typography>
                <Typography variant="h2" weight="700">
                  Hidden Gems of Ceylon
                </Typography>
              </View>
            </View>
            <Typography variant="body" color={Colors.dark.textMuted} style={styles.sectionSubtext}>
              Serene locations cherished by locals, free from heavy tour crowds.
            </Typography>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalCardRow}
            >
              {hiddenGems.map((gem) => (
                <DestinationCard key={gem.id} destination={gem} variant="standard" />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ==================================================================== */}
        {/* SACRED SIGHTS & NATURE VIEWPOINTS */}
        {/* ==================================================================== */}
        <View style={[styles.sectionHeader, { marginTop: Spacing['3xl'] }]}>
          <View>
            <Typography variant="badge" color={Colors.emerald.accent} weight="700">
              HERITAGE
            </Typography>
            <Typography variant="h2" weight="700">
              Sacred & Sublime
            </Typography>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalCardRow}
        >
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} width={210} />
          ))}
        </ScrollView>

        {/* ==================================================================== */}
        {/* LOCAL VOICES / STORYTELLING SECTION */}
        {/* ==================================================================== */}
        <View style={styles.storyCard}>
          <Typography variant="badge" color={Colors.sand.warm} weight="700">
            LOCAL VOICES · කතාන්දර
          </Typography>
          <Typography variant="h2" color="#FFFFFF" weight="700" style={styles.storyHeadline}>
            “The fog in the tea hills does not obscure the mountains — it teaches you to look closer.”
          </Typography>
          <Typography variant="body" color={Colors.sand.soft} style={styles.storyBody}>
            — Somapala, 3rd generation Ceylon tea artisan, Nuwara Eliya
          </Typography>
          <View style={styles.storyPill}>
            <Ionicons name="heart" size={14} color={Colors.terracotta.primary} />
            <Typography variant="caption" color={Colors.sand.warm} weight="600" style={styles.storyPillText}>
              Crafted with authentic Sri Lankan reverence
            </Typography>
          </View>
        </View>

        {/* ==================================================================== */}
        {/* TRIP PLANNER CTA BANNER */}
        {/* ==================================================================== */}
        <View style={styles.tripBanner}>
          <View style={styles.tripBannerContent}>
            <Badge label="PERSONALIZED EXPLORER" variant="terracotta" size="sm" />
            <Typography variant="h2" color="#FFFFFF" weight="700" style={styles.tripBannerTitle}>
              Plan Your Dream Sri Lankan Journey
            </Typography>
            <Typography variant="bodySmall" color={Colors.sand.soft} style={styles.tripBannerDesc}>
              Select your travel style, pace, and destinations. We’ll weave your custom day-by-day itinerary.
            </Typography>
            <Button
              title="Create New Trip →"
              onPress={() => router.push('/trip/create' as any)}
              variant="sunset"
              size="md"
              style={styles.tripBannerBtn}
            />
          </View>
        </View>

        {/* ==================================================================== */}
        {/* CLOSING EMOTIONAL FOOTER */}
        {/* ==================================================================== */}
        <View style={styles.closingSection}>
          <Typography variant="display" align="center" color={Colors.dark.textSecondary} weight="700">
            Sri Lanka is not just somewhere you visit.
          </Typography>
          <Typography
            variant="h2"
            align="center"
            color={Colors.emerald.mint}
            weight="700"
            style={styles.closingHighlight}
          >
            It is somewhere you experience.
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Hero
  heroContainer: {
    minHeight: 440,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    position: 'relative',
    backgroundColor: Colors.dark.surfaceElevated,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 17, 15, 0.62)',
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  brandTitle: {
    letterSpacing: -1,
  },
  searchIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroMessageBlock: {
    zIndex: 2,
    marginTop: Spacing.xl,
  },
  heroTagline: {
    lineHeight: 38,
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    lineHeight: 22,
    marginBottom: Spacing.xl,
    opacity: 0.9,
  },
  searchBarTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 26, 23, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(78, 171, 139, 0.45)',
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Shadows.glowGreen,
  },
  searchPlaceholder: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 14,
  },
  searchArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(231, 111, 81, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Category Chips
  categorySection: {
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  categoryRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
  },
  categoryChipActive: {
    backgroundColor: Colors.emerald.vibrant,
    borderColor: Colors.emerald.mint,
  },
  categoryIcon: {
    marginRight: 6,
  },
  // Sections
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  sectionHeaderNoPad: {
    marginBottom: Spacing.xs,
  },
  sectionContainer: {
    paddingHorizontal: Spacing.lg,
  },
  sectionSubtext: {
    marginBottom: Spacing.md,
  },
  horizontalCardRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  skeletonContainer: {
    paddingHorizontal: Spacing.lg,
  },
  // Story Card
  storyCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing['4xl'],
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(243, 236, 225, 0.15)',
  },
  storyHeadline: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    fontStyle: 'italic',
    lineHeight: 30,
  },
  storyBody: {
    marginBottom: Spacing.md,
  },
  storyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 111, 81, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  storyPillText: {
    marginLeft: 6,
  },
  // Trip Planner Banner
  tripBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing['3xl'],
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.dark.surfaceHighlight,
    borderWidth: 1.5,
    borderColor: 'rgba(231, 111, 81, 0.4)',
    overflow: 'hidden',
  },
  tripBannerContent: {
    padding: Spacing.xl,
  },
  tripBannerTitle: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  tripBannerDesc: {
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  tripBannerBtn: {
    alignSelf: 'flex-start',
  },
  // Closing section
  closingSection: {
    marginTop: Spacing['5xl'],
    marginBottom: Spacing['3xl'],
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  closingHighlight: {
    marginTop: Spacing.xs,
  },
});
