// ==============================================================================
// Lankora: Discover Home Screen (Luxury Editorial Travel Experience)
// Inspired by Conde Nast Traveler, Aman Resorts & Apple Design Award aesthetics
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { dataService } from '@/services/dataService';
import { Destination, Experience, Place, Restaurant, Stay } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { PlaceCard } from '@/components/cards/PlaceCard';
import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { StayCard } from '@/components/cards/StayCard';
import { Skeleton } from '@/components/ui/SkeletonLoader';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', label: 'All Ceylon', icon: 'sparkles' },
  { id: 'Hill Country', label: 'Tea Hills', icon: 'leaf' },
  { id: 'Southern Coast', label: 'Ocean Coast', icon: 'sunny' },
  { id: 'Cultural Triangle', label: 'Citadels', icon: 'shield' },
  { id: 'Wildlife Safari', label: 'Wild Safari', icon: 'paw' },
  { id: 'Eastern Coast', label: 'East Waves', icon: 'water' },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const [dests, exps, plc, rests, stys] = await Promise.all([
        dataService.getDestinations(),
        dataService.getExperiences(),
        dataService.getPlaces(),
        dataService.getRestaurants(),
        dataService.getStays(),
      ]);
      setDestinations(dests);
      setExperiences(exps);
      setPlaces(plc);
      setRestaurants(rests);
      setStays(stys);
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
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 110 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.gold.primary} />
        }
      >
        {/* ==================================================================== */}
        {/* TOP EDITORIAL NAV BAR */}
        {/* ==================================================================== */}
        <View style={[styles.topBar, { paddingTop: Math.max(insets.top, 20) }]}>
          <View>
            <View style={styles.brandRow}>
              <Ionicons name="sparkles" size={14} color={Colors.gold.primary} />
              <Typography variant="badge" color={Colors.gold.primary} weight="800" style={styles.brandTag}>
                CEYLON SERENDIPITY
              </Typography>
            </View>
            <Typography variant="display" color="#FFFFFF" weight="800" style={styles.brandName}>
              Lankora
            </Typography>
          </View>

          <View style={styles.topRightActions}>
            <View style={styles.weatherPill}>
              <Ionicons name="partly-sunny" size={13} color={Colors.gold.light} />
              <Typography variant="caption" color="rgba(255, 255, 255, 0.9)" weight="700">
                29°C · Sigiriya
              </Typography>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/search' as any)}
              style={styles.searchIconButton}
            >
              <Ionicons name="search" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ==================================================================== */}
        {/* CINEMATIC HERO SHOWCASE */}
        {/* ==================================================================== */}
        {featuredDest && (
          <View style={styles.heroCardWrapper}>
            <TouchableOpacity
              activeOpacity={0.94}
              onPress={() => router.push(`/destination/${featuredDest.slug || featuredDest.id}` as any)}
              style={styles.heroCard}
            >
              <Image
                source={{ uri: featuredDest.hero_image }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                priority="high"
                transition={300}
              />
              <LinearGradient
                colors={[
                  'rgba(7, 10, 9, 0.1)',
                  'rgba(7, 10, 9, 0.45)',
                  'rgba(7, 10, 9, 0.88)',
                  '#070A09'
                ]}
                locations={[0, 0.4, 0.75, 1]}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.heroCardContent}>
                <View style={styles.heroBadgeRow}>
                  <View style={styles.curatedGoldBadge}>
                    <Ionicons name="star" size={10} color="#000000" />
                    <Typography variant="badge" color="#000000" weight="800" style={{ letterSpacing: 0.8 }}>
                      SPOTLIGHT OF THE MONTH
                    </Typography>
                  </View>

                  <View style={styles.heroRatingPill}>
                    <Ionicons name="star" size={11} color={Colors.gold.primary} />
                    <Typography variant="caption" color="#FFFFFF" weight="700">
                      {featuredDest.rating.toFixed(1)}
                    </Typography>
                  </View>
                </View>

                <Typography variant="display" color="#FFFFFF" weight="800" numberOfLines={2} style={styles.heroHeadline}>
                  {featuredDest.name}
                </Typography>

                <Typography variant="body" color="rgba(255, 255, 255, 0.8)" numberOfLines={2} style={styles.heroSubtext}>
                  {featuredDest.short_description}
                </Typography>

                <View style={styles.heroFooter}>
                  <View style={styles.heroLocationPill}>
                    <Ionicons name="compass-outline" size={13} color={Colors.emerald.accent} />
                    <Typography variant="caption" color={Colors.emerald.accent} weight="700">
                      {featuredDest.category} · {featuredDest.province}
                    </Typography>
                  </View>

                  <View style={styles.heroCtaButton}>
                    <Typography variant="caption" color="#000000" weight="800">
                      Explore Island →
                    </Typography>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* ==================================================================== */}
        {/* QUICK SEARCH TRIGGER */}
        {/* ==================================================================== */}
        <View style={styles.searchBarWrapper}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push('/search' as any)}
            style={styles.searchBarTrigger}
          >
            <View style={styles.searchIconBox}>
              <Ionicons name="compass" size={18} color={Colors.gold.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.45)" weight="600" style={{ fontSize: 10 }}>
                DISCOVER CEYLON
              </Typography>
              <Typography variant="body" color="#FFFFFF" weight="600">
                Where does your heart wander?
              </Typography>
            </View>
            <View style={styles.searchArrowCircle}>
              <Ionicons name="arrow-forward" size={14} color="#000000" />
            </View>
          </TouchableOpacity>
        </View>

        {/* ==================================================================== */}
        {/* LUXURY REGION CATEGORY CHIPS */}
        {/* ==================================================================== */}
        <View style={styles.categorySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
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
                    color={active ? '#000000' : Colors.gold.primary}
                  />
                  <Typography
                    variant="caption"
                    weight={active ? '800' : '600'}
                    color={active ? '#000000' : 'rgba(255, 255, 255, 0.85)'}
                    style={{ marginLeft: 5 }}
                  >
                    {cat.label}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ==================================================================== */}
        {/* ICONIC DESTINATIONS CAROUSEL */}
        {/* ==================================================================== */}
        <View style={styles.sectionHeader}>
          <View>
            <Typography variant="badge" color={Colors.emerald.accent} weight="800">
              IMMERSIVE WONDERS
            </Typography>
            <Typography variant="h1" color="#FFFFFF" weight="800" style={styles.sectionTitle}>
              Iconic Destinations
            </Typography>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as any)}>
            <Typography variant="caption" color={Colors.gold.primary} weight="700">
              View All ({destinations.length}) →
            </Typography>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.skeletonBox}>
            <Skeleton height={320} width={SCREEN_WIDTH - 32} borderRadius={BorderRadius.xxl} />
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
        {/* AI TRAVEL ARCHITECT BANNER (Microservice Powered) */}
        {/* ==================================================================== */}
        <View style={styles.aiBannerWrapper}>
          <LinearGradient
            colors={['#17231E', '#0E1714', '#070A09']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.aiBanner}
          >
            <View style={styles.aiTopRow}>
              <View style={styles.aiBadge}>
                <Ionicons name="hardware-chip-outline" size={12} color={Colors.gold.primary} />
                <Typography variant="badge" color={Colors.gold.primary} weight="800" style={{ letterSpacing: 0.8 }}>
                  AI TRIP ARCHITECT
                </Typography>
              </View>
              <Typography variant="caption" color="rgba(255, 255, 255, 0.45)">
                LANKA ENGINE V1
              </Typography>
            </View>

            <Typography variant="h2" color="#FFFFFF" weight="800" style={styles.aiTitle}>
              Craft Your Bespoke Island Itinerary
            </Typography>

            <Typography variant="body" color="rgba(255, 255, 255, 0.72)" style={styles.aiDesc}>
              Personalized day-by-day journeys tailored to your rhythm—from misty tea mountain treks to private leopard safaris and ocean villas.
            </Typography>

            <View style={styles.aiTagsRow}>
              <View style={styles.aiTagPill}>
                <Typography variant="caption" color={Colors.emerald.accent} weight="700">
                  🌿 Nature & Heritage
                </Typography>
              </View>
              <View style={styles.aiTagPill}>
                <Typography variant="caption" color={Colors.gold.light} weight="700">
                  🐆 Wildlife Safaris
                </Typography>
              </View>
              <View style={styles.aiTagPill}>
                <Typography variant="caption" color="#38BDF8" weight="700">
                  🏄 Coastal Surfing
                </Typography>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => router.push('/trip/create' as any)}
              style={styles.aiActionButton}
            >
              <LinearGradient
                colors={['#F5B041', '#E76F51']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.aiButtonGradient}
              >
                <Typography variant="body" color="#000000" weight="800">
                  Generate My Dream Trip
                </Typography>
                <Ionicons name="sparkles" size={16} color="#000000" style={{ marginLeft: 6 }} />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* ==================================================================== */}
        {/* SIGNATURE EXPERIENCES */}
        {/* ==================================================================== */}
        <View style={styles.sectionHeader}>
          <View>
            <Typography variant="badge" color={Colors.terracotta.primary} weight="800">
              UNFORGETTABLE MOMENTS
            </Typography>
            <Typography variant="h1" color="#FFFFFF" weight="800" style={styles.sectionTitle}>
              Signature Experiences
            </Typography>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as any)}>
            <Typography variant="caption" color={Colors.gold.primary} weight="700">
              Explore All →
            </Typography>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalCardRow}
        >
          {experiences.map((exp) => (
            <ExperienceCard key={exp.id} experience={exp} width={250} />
          ))}
        </ScrollView>

        {/* ==================================================================== */}
        {/* AUTHENTIC LOCAL RETREATS & VILLAS */}
        {/* ==================================================================== */}
        {stays.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Typography variant="badge" color={Colors.gold.primary} weight="800">
                  SANCTUARIES & RETREATS
                </Typography>
                <Typography variant="h1" color="#FFFFFF" weight="800" style={styles.sectionTitle}>
                  Eco-Lodges & Heritage Stays
                </Typography>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalCardRow}
            >
              {stays.map((stay) => (
                <StayCard key={stay.id} stay={stay} width={260} />
              ))}
            </ScrollView>
          </>
        )}

        {/* ==================================================================== */}
        {/* FLAVORS & DINING */}
        {/* ==================================================================== */}
        {restaurants.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Typography variant="badge" color={Colors.terracotta.light} weight="800">
                  CEYLON CULINARY
                </Typography>
                <Typography variant="h1" color="#FFFFFF" weight="800" style={styles.sectionTitle}>
                  Authentic Eateries & Cafes
                </Typography>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalCardRow}
            >
              {restaurants.map((rest) => (
                <RestaurantCard key={rest.id} restaurant={rest} width={240} />
              ))}
            </ScrollView>
          </>
        )}

        {/* ==================================================================== */}
        {/* SACRED SIGHTS & MONUMENTS */}
        {/* ==================================================================== */}
        <View style={styles.sectionHeader}>
          <View>
            <Typography variant="badge" color={Colors.emerald.accent} weight="800">
              SACRED CITADELS
            </Typography>
            <Typography variant="h1" color="#FFFFFF" weight="800" style={styles.sectionTitle}>
              Monuments & Heritage
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
        {/* EDITORIAL CEYLON QUOTE SIGNATURE */}
        {/* ==================================================================== */}
        <View style={styles.quoteCardWrapper}>
          <LinearGradient
            colors={['rgba(21, 32, 28, 0.8)', 'rgba(14, 21, 18, 0.95)']}
            style={styles.quoteCard}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={26} color={Colors.gold.primary} style={{ opacity: 0.85 }} />
            <Typography variant="h2" color="#FFFFFF" weight="800" style={styles.quoteText}>
              “The mountain mist does not obscure the peak — it whispers patience to the traveler.”
            </Typography>
            <Typography variant="caption" color={Colors.gold.light} weight="700" style={styles.quoteAuthor}>
              — Somapala · Ceylon Master Tea Artisan, Nuwara Eliya
            </Typography>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#070A09',
  },
  scrollContent: {
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.sm,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 2,
  },
  brandTag: {
    letterSpacing: 1,
    fontSize: 9.5,
  },
  brandName: {
    letterSpacing: -1,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroCardWrapper: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  heroCard: {
    height: 390,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    ...Shadows.lg,
  },
  heroCardContent: {
    padding: Spacing.xl,
    zIndex: 2,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  curatedGoldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gold.primary,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  heroRatingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(12, 18, 15, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(245, 176, 65, 0.3)',
  },
  heroHeadline: {
    marginBottom: 6,
    letterSpacing: -0.6,
  },
  heroSubtext: {
    lineHeight: 21,
    marginBottom: Spacing.md,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroLocationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroCtaButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  searchBarWrapper: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  searchBarTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1714',
    borderRadius: BorderRadius.xl,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(245, 176, 65, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchArrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.gold.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categorySection: {
    marginTop: Spacing.lg,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1714',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  categoryChipActive: {
    backgroundColor: Colors.gold.primary,
    borderColor: Colors.gold.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing['3xl'],
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    letterSpacing: -0.4,
    marginTop: 2,
  },
  horizontalCardRow: {
    paddingHorizontal: Spacing.lg,
    gap: 16,
  },
  skeletonBox: {
    paddingHorizontal: Spacing.lg,
  },
  aiBannerWrapper: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing['3xl'],
  },
  aiBanner: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(245, 176, 65, 0.35)',
    ...Shadows.goldGlow,
  },
  aiTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(245, 176, 65, 0.14)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(245, 176, 65, 0.3)',
  },
  aiTitle: {
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  aiDesc: {
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  aiTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  aiTagPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  aiActionButton: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  aiButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.xl,
  },
  quoteCardWrapper: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing['3xl'],
    marginBottom: Spacing.lg,
  },
  quoteCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  quoteText: {
    marginVertical: Spacing.md,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  quoteAuthor: {
    letterSpacing: 0.5,
  },
});
