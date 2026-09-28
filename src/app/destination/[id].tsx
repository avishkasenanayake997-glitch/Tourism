// ==============================================================================
// Lankora: Premium Destination Detail Screen
// ==============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { dataService } from '@/services/dataService';
import { Destination, Place, Experience, Restaurant, Stay, Review } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RatingStars } from '@/components/ui/RatingStars';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { PlaceCard } from '@/components/cards/PlaceCard';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { StayCard } from '@/components/cards/StayCard';
import { Skeleton } from '@/components/ui/SkeletonLoader';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useTrips } from '@/context/TripsContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DestinationDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips, addItemToTrip } = useTrips();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Add to trip modal state
  const [showTripModal, setShowTripModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadDestinationData();
    }
  }, [id]);

  const loadDestinationData = async () => {
    setLoading(true);
    try {
      const dest = await dataService.getDestinationById(id);
      if (dest) {
        setDestination(dest);
        const [p, e, r, s, rev] = await Promise.all([
          dataService.getPlaces(dest.id),
          dataService.getExperiences(dest.id),
          dataService.getRestaurants(dest.id),
          dataService.getStays(dest.id),
          dataService.getReviews('destination', dest.id),
        ]);
        setPlaces(p);
        setExperiences(e);
        setRestaurants(r);
        setStays(s);
        setReviews(rev);
      }
    } catch (e) {
      console.warn('Error fetching destination details:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!destination) return;
    try {
      await Share.share({
        message: `Discover ${destination.name}, Sri Lanka on Lankora: ${destination.short_description}`,
        title: destination.name,
      });
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePostReview = async () => {
    if (!destination || !newComment.trim()) return;
    await dataService.addReview({
      user_id: 'current-user',
      user_name: 'Avishka Sahan',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      target_type: 'destination',
      target_id: destination.id,
      rating: newRating,
      comment: newComment,
    });
    setNewComment('');
    setShowReviewModal(false);
    // Reload reviews
    const updated = await dataService.getReviews('destination', destination.id);
    setReviews(updated);
    Alert.alert('Thank You', 'Your review has been published.');
  };

  const handleAddToTrip = async (tripId: string) => {
    if (!destination) return;
    await addItemToTrip(tripId, {
      target_type: 'destination',
      target_id: destination.id,
      title: `Explore ${destination.name}`,
      day_number: 1,
      start_time: '09:00 AM',
      location: `${destination.name}, ${destination.province}`,
      order_index: 0,
      notes: destination.short_description,
    });
    setShowTripModal(false);
    Alert.alert('Added to Itinerary', `${destination.name} has been added to your trip.`);
  };

  if (loading || !destination) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Skeleton height={320} width="100%" borderRadius={0} />
        <View style={{ padding: Spacing.lg }}>
          <Skeleton height={30} width="60%" style={{ marginBottom: Spacing.sm }} />
          <Skeleton height={18} width="40%" style={{ marginBottom: Spacing.lg }} />
          <Skeleton height={100} width="100%" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* ==================================================================== */}
        {/* HERO IMAGE & FLOATING HEADER */}
        {/* ==================================================================== */}
        <View style={styles.heroBox}>
          <Image
            source={{ uri: destination.hero_image }}
            style={(StyleSheet.absoluteFill as any)}
            contentFit="cover"
            priority="high"
          />
          <View style={styles.heroOverlay} />

          {/* Nav Actions */}
          <View style={[styles.floatingNav, { top: Math.max(insets.top, 16) }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.navRight}>
              <TouchableOpacity onPress={handleShare} style={styles.iconCircle}>
                <Ionicons name="share-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <FavoriteButton
                targetType="destination"
                targetId={destination.id}
                itemData={destination}
                size={40}
                iconSize={20}
              />
            </View>
          </View>

          {/* Hero Meta */}
          <View style={styles.heroBottom}>
            <Badge label={destination.category} variant="emerald" size="md" />
            <Typography variant="display" color="#FFFFFF" weight="800" style={styles.destTitle}>
              {destination.name}
            </Typography>
            <View style={styles.locRow}>
              <Ionicons name="location-outline" size={16} color={Colors.sand.warm} />
              <Typography variant="body" color={Colors.sand.soft} style={styles.locText}>
                {destination.district}, {destination.province}
              </Typography>
            </View>
          </View>
        </View>

        {/* ==================================================================== */}
        {/* KEY STATS & HIGHLIGHT BAR */}
        {/* ==================================================================== */}
        <View style={styles.statGrid}>
          <View style={styles.statItem}>
            <Ionicons name="sunny-outline" size={18} color={Colors.terracotta.light} />
            <Typography variant="caption" color={Colors.dark.textMuted} style={styles.statLabel}>
              Best Season
            </Typography>
            <Typography variant="bodySmall" weight="700" color={Colors.dark.text}>
              {destination.best_time_to_visit}
            </Typography>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons name="wallet-outline" size={18} color={Colors.emerald.mint} />
            <Typography variant="caption" color={Colors.dark.textMuted} style={styles.statLabel}>
              Daily Budget
            </Typography>
            <Typography variant="bodySmall" weight="700" color={Colors.dark.text}>
              {destination.estimated_budget}
            </Typography>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Ionicons name="star" size={18} color={Colors.dark.star} />
            <Typography variant="caption" color={Colors.dark.textMuted} style={styles.statLabel}>
              Rating
            </Typography>
            <Typography variant="bodySmall" weight="700" color={Colors.dark.text}>
              {destination.rating} ({destination.review_count})
            </Typography>
          </View>
        </View>

        {/* ==================================================================== */}
        {/* DESTINATION STORY / ESSENCE */}
        {/* ==================================================================== */}
        <View style={styles.storySection}>
          <Typography variant="badge" color={Colors.emerald.accent} weight="700">
            THE ESSENCE OF {destination.name.toUpperCase()}
          </Typography>
          <Typography variant="bodyLarge" color={Colors.dark.text} style={styles.longDesc}>
            {destination.description}
          </Typography>

          {/* Vibe Tags */}
          <View style={styles.vibeRow}>
            {destination.vibe_tags.map((tag) => (
              <View key={tag} style={styles.vibeChip}>
                <Typography variant="caption" color={Colors.sand.warm} weight="600">
                  #{tag}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        {/* ==================================================================== */}
        {/* MUST-SEE HIGHLIGHTS */}
        {/* ==================================================================== */}
        <View style={styles.highlightsBox}>
          <Typography variant="h3" weight="700" style={styles.sectionHeaderTitle}>
            Unmissable Highlights
          </Typography>
          <View style={styles.highlightsList}>
            {destination.highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.emerald.mint} />
                <Typography variant="body" color={Colors.dark.textSecondary} style={styles.highlightText}>
                  {h}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        {/* ==================================================================== */}
        {/* KEY SIGHTS & PLACES */}
        {/* ==================================================================== */}
        {places.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.secRow}>
              <Typography variant="h3" weight="700">
                Key Sights & Heritage
              </Typography>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
              {places.map((p) => (
                <PlaceCard key={p.id} place={p} width={220} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ==================================================================== */}
        {/* EXPERIENCES */}
        {/* ==================================================================== */}
        {experiences.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.secRow}>
              <Typography variant="h3" weight="700">
                Top Experiences in {destination.name}
              </Typography>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
              {experiences.map((e) => (
                <ExperienceCard key={e.id} experience={e} width={250} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ==================================================================== */}
        {/* WHERE TO STAY */}
        {/* ==================================================================== */}
        {stays.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.secRow}>
              <Typography variant="h3" weight="700">
                Curated Stays & Lodges
              </Typography>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
              {stays.map((s) => (
                <StayCard key={s.id} stay={s} width={260} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ==================================================================== */}
        {/* LOCAL FOOD & RESTAURANTS */}
        {/* ==================================================================== */}
        {restaurants.length > 0 && (
          <View style={styles.sectionBlock}>
            <View style={styles.secRow}>
              <Typography variant="h3" weight="700">
                Authentic Bites & Dining
              </Typography>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
              {restaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} width={250} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ==================================================================== */}
        {/* SUGGESTED 3-DAY ITINERARY */}
        {/* ==================================================================== */}
        <View style={styles.itineraryCard}>
          <Badge label="SUGGESTED ITINERARY" variant="terracotta" size="sm" />
          <Typography variant="h3" weight="700" style={styles.itineraryTitle}>
            How to Spend 3 Days in {destination.name}
          </Typography>

          <View style={styles.dayTimeline}>
            <View style={styles.dayItem}>
              <View style={styles.dayBadge}>
                <Typography variant="caption" weight="800" color="#FFFFFF">
                  DAY 1
                </Typography>
              </View>
              <View style={styles.dayContent}>
                <Typography variant="body" weight="700" color={Colors.dark.text}>
                  Arrival & Sunset Viewpoint
                </Typography>
                <Typography variant="bodySmall" color={Colors.dark.textMuted}>
                  Settle into your hillside bungalow, take an afternoon orientation walk, and catch the sunset panorama.
                </Typography>
              </View>
            </View>

            <View style={styles.dayItem}>
              <View style={styles.dayBadge}>
                <Typography variant="caption" weight="800" color="#FFFFFF">
                  DAY 2
                </Typography>
              </View>
              <View style={styles.dayContent}>
                <Typography variant="body" weight="700" color={Colors.dark.text}>
                  Heritage & Tea Plantation Trails
                </Typography>
                <Typography variant="bodySmall" color={Colors.dark.textMuted}>
                  Early morning trek to watch the blue train cross, followed by a guided tea factory tasting and clay-pot curry.
                </Typography>
              </View>
            </View>

            <View style={styles.dayItem}>
              <View style={styles.dayBadge}>
                <Typography variant="caption" weight="800" color="#FFFFFF">
                  DAY 3
                </Typography>
              </View>
              <View style={styles.dayContent}>
                <Typography variant="body" weight="700" color={Colors.dark.text}>
                  Waterfalls & Departure
                </Typography>
                <Typography variant="bodySmall" color={Colors.dark.textMuted}>
                  Morning swim in the natural rock pools, artisan souvenir shopping, and onwards travel.
                </Typography>
              </View>
            </View>
          </View>
        </View>

        {/* ==================================================================== */}
        {/* TRAVELER REVIEWS */}
        {/* ==================================================================== */}
        <View style={styles.sectionBlock}>
          <View style={styles.secRowBetween}>
            <Typography variant="h3" weight="700">
              Traveler Reviews ({reviews.length})
            </Typography>
            <TouchableOpacity onPress={() => setShowReviewModal(true)}>
              <Typography variant="caption" color={Colors.terracotta.light} weight="700">
                + Write Review
              </Typography>
            </TouchableOpacity>
          </View>

          {reviews.length === 0 ? (
            <Typography variant="bodySmall" color={Colors.dark.textMuted} style={{ paddingHorizontal: Spacing.lg }}>
              Be the first to share your experience of {destination.name}.
            </Typography>
          ) : (
            <View style={styles.reviewsList}>
              {reviews.map((rev) => (
                <View key={rev.id} style={styles.reviewCard}>
                  <View style={styles.revHeader}>
                    <Image
                      source={{ uri: rev.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }}
                      style={styles.revAvatar}
                    />
                    <View style={styles.revMeta}>
                      <Typography variant="body" weight="700">
                        {rev.user_name}
                      </Typography>
                      <RatingStars rating={rev.rating} size={11} showText={false} />
                    </View>
                  </View>
                  <Typography variant="bodySmall" color={Colors.dark.textSecondary} style={styles.revComment}>
                    {rev.comment}
                  </Typography>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ==================================================================== */}
      {/* STICKY BOTTOM ACTION BAR */}
      {/* ==================================================================== */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View>
          <Typography variant="caption" color={Colors.dark.textMuted}>
            EXPLORE {destination.name.toUpperCase()}
          </Typography>
          <Typography variant="h3" color={Colors.emerald.accent} weight="700">
            {destination.rating} ★ Rated
          </Typography>
        </View>

        <Button
          title="Add to Itinerary +"
          onPress={() => setShowTripModal(true)}
          variant="sunset"
          size="md"
        />
      </View>

      {/* ==================================================================== */}
      {/* WRITE REVIEW MODAL */}
      {/* ==================================================================== */}
      <Modal visible={showReviewModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" weight="700">
                Review {destination.name}
              </Typography>
              <TouchableOpacity onPress={() => setShowReviewModal(false)}>
                <Ionicons name="close" size={24} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>

            {/* Star Selector */}
            <View style={styles.starsSelector}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setNewRating(s)}>
                  <Ionicons
                    name={s <= newRating ? 'star' : 'star-outline'}
                    size={28}
                    color={Colors.dark.star}
                    style={{ marginHorizontal: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Share travel tips, sunset spots, or memorable moments..."
              placeholderTextColor={Colors.dark.textMuted}
              multiline
              numberOfLines={4}
              style={styles.reviewInput}
            />

            <Button
              title="Publish Review"
              onPress={handlePostReview}
              variant="primary"
              size="md"
              disabled={!newComment.trim()}
              style={{ marginTop: Spacing.md }}
            />
          </View>
        </View>
      </Modal>

      {/* ==================================================================== */}
      {/* ADD TO TRIP MODAL */}
      {/* ==================================================================== */}
      <Modal visible={showTripModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Typography variant="h3" weight="700">
                Choose a Trip
              </Typography>
              <TouchableOpacity onPress={() => setShowTripModal(false)}>
                <Ionicons name="close" size={24} color={Colors.dark.text} />
              </TouchableOpacity>
            </View>

            <Typography variant="bodySmall" color={Colors.dark.textMuted} style={{ marginBottom: Spacing.md }}>
              Select which of your Sri Lankan itineraries to add {destination.name} to:
            </Typography>

            {trips.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: Spacing.lg }}>
                <Typography variant="body" color={Colors.dark.textSecondary} style={{ marginBottom: Spacing.md }}>
                  You don’t have an active trip yet.
                </Typography>
                <Button
                  title="Create Trip First"
                  onPress={() => {
                    setShowTripModal(false);
                    router.push('/trip/create' as any);
                  }}
                  variant="sunset"
                  size="sm"
                />
              </View>
            ) : (
              trips.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => handleAddToTrip(t.id)}
                  style={styles.tripPickItem}
                >
                  <Ionicons name="map-outline" size={20} color={Colors.emerald.mint} />
                  <View style={{ marginLeft: Spacing.sm, flex: 1 }}>
                    <Typography variant="body" weight="700">
                      {t.title}
                    </Typography>
                    <Typography variant="caption" color={Colors.dark.textMuted}>
                      {t.start_date} → {t.end_date}
                    </Typography>
                  </View>
                  <Ionicons name="add-circle" size={22} color={Colors.terracotta.primary} />
                </TouchableOpacity>
              ))
            )}
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
  heroBox: {
    height: 380,
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
    gap: Spacing.sm,
  },
  heroBottom: {
    zIndex: 2,
    marginTop: 'auto',
  },
  destTitle: {
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
  // Stat Grid
  statGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceElevated,
    marginHorizontal: Spacing.lg,
    marginTop: -28,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    zIndex: 3,
    ...Shadows.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    marginTop: 3,
    marginBottom: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.dark.border,
  },
  // Story
  storySection: {
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  longDesc: {
    lineHeight: 25,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  vibeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  vibeChip: {
    backgroundColor: Colors.dark.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  // Highlights
  highlightsBox: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  sectionHeaderTitle: {
    marginBottom: Spacing.md,
  },
  highlightsList: {
    gap: Spacing.sm,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightText: {
    marginLeft: Spacing.sm,
  },
  // Section Blocks
  sectionBlock: {
    marginBottom: Spacing.xl,
  },
  secRow: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  secRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  cardRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  // Suggested Itinerary
  itineraryCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.dark.surfaceHighlight,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1.5,
    borderColor: 'rgba(231, 111, 81, 0.35)',
  },
  itineraryTitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  dayTimeline: {
    gap: Spacing.md,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dayBadge: {
    backgroundColor: Colors.terracotta.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
    marginRight: Spacing.md,
    marginTop: 2,
  },
  dayContent: {
    flex: 1,
  },
  // Reviews
  reviewsList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  reviewCard: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  revHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  revAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Spacing.sm,
  },
  revMeta: {
    flex: 1,
  },
  revComment: {
    lineHeight: 18,
  },
  // Bottom Bar
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
  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
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
  starsSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: Spacing.md,
  },
  reviewInput: {
    backgroundColor: Colors.dark.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    color: Colors.dark.text,
    padding: Spacing.md,
    textAlignVertical: 'top',
    fontSize: 14,
    minHeight: 100,
  },
  tripPickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: Spacing.sm,
  },
});
