// ==============================================================================
// Lankora: Explore & Multi-Filter Discovery Screen (Luxury Travel Directory)
// ==============================================================================

import React, { useEffect, useState, useMemo } from 'react';
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

import { dataService } from '@/services/dataService';
import { Destination, Experience, Place, Restaurant, Stay } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { SearchBar } from '@/components/ui/SearchBar';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { PlaceCard } from '@/components/cards/PlaceCard';
import { RestaurantCard } from '@/components/cards/RestaurantCard';
import { StayCard } from '@/components/cards/StayCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/SkeletonLoader';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FilterType = 'all' | 'destinations' | 'experiences' | 'places' | 'food' | 'stays';

const TABS: { id: FilterType; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: 'sparkles' },
  { id: 'destinations', label: 'Destinations', icon: 'compass' },
  { id: 'experiences', label: 'Experiences', icon: 'trail-sign' },
  { id: 'places', label: 'Sights', icon: 'business' },
  { id: 'food', label: 'Dining', icon: 'restaurant' },
  { id: 'stays', label: 'Retreats', icon: 'bed' },
];

const PROVINCES = [
  'All Provinces',
  'Central Province',
  'Southern Province',
  'Uva Province',
  'Eastern Province',
  'Northern Province',
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<FilterType>('all');
  const [selectedProvince, setSelectedProvince] = useState('All Provinces');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);

  useEffect(() => {
    loadExploreData();
  }, []);

  const loadExploreData = async () => {
    setLoading(true);
    try {
      const [d, e, p, r, s] = await Promise.all([
        dataService.getDestinations(),
        dataService.getExperiences(),
        dataService.getPlaces(),
        dataService.getRestaurants(),
        dataService.getStays(),
      ]);
      setDestinations(d);
      setExperiences(e);
      setPlaces(p);
      setRestaurants(r);
      setStays(s);
    } catch (err) {
      console.warn('Error loading explore data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations = useMemo(() => {
    return destinations.filter((item) => {
      const matchProv =
        selectedProvince === 'All Provinces' ||
        item.province.toLowerCase().includes(selectedProvince.toLowerCase());
      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.short_description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProv && matchSearch;
    });
  }, [destinations, selectedProvince, searchQuery]);

  const filteredExperiences = useMemo(() => {
    return experiences.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [experiences, searchQuery]);

  const filteredPlaces = useMemo(() => {
    return places.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [places, searchQuery]);

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [restaurants, searchQuery]);

  const filteredStays = useMemo(() => {
    return stays.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [stays, searchQuery]);

  const totalResults =
    (activeTab === 'all' || activeTab === 'destinations' ? filteredDestinations.length : 0) +
    (activeTab === 'all' || activeTab === 'experiences' ? filteredExperiences.length : 0) +
    (activeTab === 'all' || activeTab === 'places' ? filteredPlaces.length : 0) +
    (activeTab === 'all' || activeTab === 'food' ? filteredRestaurants.length : 0) +
    (activeTab === 'all' || activeTab === 'stays' ? filteredStays.length : 0);

  const resetFilters = () => {
    setActiveTab('all');
    setSelectedProvince('All Provinces');
    setSearchQuery('');
  };

  const cardWidth = SCREEN_WIDTH - 32;

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Search Header */}
      <View style={styles.headerArea}>
        <View style={styles.titleRow}>
          <Typography variant="badge" color={Colors.gold.primary} weight="800">
            ISLAND DIRECTORY
          </Typography>
          <Typography variant="display" color="#FFFFFF" weight="800" style={styles.screenTitle}>
            Explore Ceylon
          </Typography>
        </View>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by name, province, or vibe..."
        />
      </View>

      {/* Main Category Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabButton, active && styles.tabButtonActive]}
              >
                <Ionicons
                  name={tab.icon as any}
                  size={13}
                  color={active ? '#000000' : Colors.gold.primary}
                />
                <Typography
                  variant="caption"
                  weight={active ? '800' : '600'}
                  color={active ? '#000000' : 'rgba(255, 255, 255, 0.8)'}
                  style={{ marginLeft: 4 }}
                >
                  {tab.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Province Filters (Horizontal Pills) */}
      <View style={styles.provinceWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.provinceRow}>
          {PROVINCES.map((prov) => {
            const active = selectedProvince === prov;
            return (
              <TouchableOpacity
                key={prov}
                onPress={() => setSelectedProvince(prov)}
                style={[styles.provChip, active && styles.provChipActive]}
              >
                <Typography
                  variant="caption"
                  color={active ? Colors.emerald.accent : 'rgba(255, 255, 255, 0.6)'}
                  weight={active ? '700' : '500'}
                >
                  {prov}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Result Count Status */}
      <View style={styles.resultsBar}>
        <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
          Showing <Typography variant="caption" color="#FFFFFF" weight="700">{totalResults}</Typography> curated places
        </Typography>
        {(searchQuery || selectedProvince !== 'All Provinces' || activeTab !== 'all') && (
          <TouchableOpacity onPress={resetFilters}>
            <Typography variant="caption" color={Colors.gold.primary} weight="700">
              Clear Filters
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Skeleton height={280} borderRadius={BorderRadius.xxl} style={{ marginBottom: Spacing.md }} />
          <Skeleton height={280} borderRadius={BorderRadius.xxl} />
        </View>
      ) : totalResults === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No Match Found"
          description="We couldn't find matching gems. Try another keyword or clear your filters."
          actionTitle="Reset Filters"
          onAction={resetFilters}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollList, { paddingBottom: 110 }]}
        >
          {/* Destinations */}
          {(activeTab === 'all' || activeTab === 'destinations') &&
            filteredDestinations.map((dest) => (
              <View key={`dest-${dest.id}`} style={styles.cardContainer}>
                <DestinationCard destination={dest} variant="featured" />
              </View>
            ))}

          {/* Experiences */}
          {(activeTab === 'all' || activeTab === 'experiences') &&
            filteredExperiences.map((exp) => (
              <View key={`exp-${exp.id}`} style={styles.cardContainer}>
                <ExperienceCard experience={exp} width={cardWidth} />
              </View>
            ))}

          {/* Stays */}
          {(activeTab === 'all' || activeTab === 'stays') &&
            filteredStays.map((stay) => (
              <View key={`stay-${stay.id}`} style={styles.cardContainer}>
                <StayCard stay={stay} width={cardWidth} />
              </View>
            ))}

          {/* Food */}
          {(activeTab === 'all' || activeTab === 'food') &&
            filteredRestaurants.map((rest) => (
              <View key={`rest-${rest.id}`} style={styles.cardContainer}>
                <RestaurantCard restaurant={rest} width={cardWidth} />
              </View>
            ))}

          {/* Places */}
          {(activeTab === 'all' || activeTab === 'places') &&
            filteredPlaces.map((place) => (
              <View key={`place-${place.id}`} style={styles.cardContainer}>
                <PlaceCard place={place} width={cardWidth} />
              </View>
            ))}
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
  headerArea: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  titleRow: {
    marginBottom: Spacing.sm,
  },
  screenTitle: {
    letterSpacing: -0.6,
    marginTop: 2,
  },
  tabsWrapper: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
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
  provinceWrapper: {
    marginBottom: Spacing.sm,
  },
  provinceRow: {
    paddingHorizontal: Spacing.lg,
    gap: 6,
  },
  provChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  provChipActive: {
    borderColor: Colors.emerald.accent,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  loadingContainer: {
    padding: Spacing.lg,
  },
  scrollList: {
    paddingHorizontal: Spacing.lg,
    gap: 16,
  },
  cardContainer: {
    width: '100%',
  },
});
