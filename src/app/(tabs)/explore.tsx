// ==============================================================================
// Lankora: Explore & Multi-Filter Discovery Screen
// ==============================================================================

import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FilterType = 'all' | 'destinations' | 'experiences' | 'places' | 'food' | 'stays';

const TABS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'places', label: 'Places' },
  { id: 'food', label: 'Food & Cafes' },
  { id: 'stays', label: 'Stays' },
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

  // Filtered by province and search
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

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Search Header */}
      <View style={styles.headerArea}>
        <Typography variant="h2" weight="700" style={styles.screenTitle}>
          Explore Sri Lanka
        </Typography>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Filter by name, district, or style..."
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
                <Typography
                  variant="caption"
                  weight={active ? '700' : '500'}
                  color={active ? '#FFFFFF' : Colors.dark.textSecondary}
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
                  color={active ? Colors.emerald.accent : Colors.dark.textMuted}
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
        <Typography variant="caption" color={Colors.dark.textMuted}>
          Showing {totalResults} curated discovery results
        </Typography>
        {(searchQuery || selectedProvince !== 'All Provinces' || activeTab !== 'all') && (
          <TouchableOpacity onPress={resetFilters}>
            <Typography variant="caption" color={Colors.terracotta.light} weight="600">
              Reset Filters
            </Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Skeleton height={220} borderRadius={BorderRadius.lg} style={{ marginBottom: Spacing.md }} />
          <Skeleton height={220} borderRadius={BorderRadius.lg} />
        </View>
      ) : totalResults === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No Match Found"
          description="We couldn’t find matching locations or activities. Try another search keyword or clear filters."
          actionTitle="Reset Filters"
          onAction={resetFilters}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
          {/* Destinations */}
          {(activeTab === 'all' || activeTab === 'destinations') && filteredDestinations.length > 0 && (
            <View style={styles.groupSection}>
              <Typography variant="h3" weight="700" style={styles.groupTitle}>
                Destinations ({filteredDestinations.length})
              </Typography>
              <View style={styles.cardStack}>
                {filteredDestinations.map((dest) => (
                  <DestinationCard key={dest.id} destination={dest} variant="featured" />
                ))}
              </View>
            </View>
          )}

          {/* Experiences */}
          {(activeTab === 'all' || activeTab === 'experiences') && filteredExperiences.length > 0 && (
            <View style={styles.groupSection}>
              <Typography variant="h3" weight="700" style={styles.groupTitle}>
                Island Experiences ({filteredExperiences.length})
              </Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardGrid}>
                {filteredExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} experience={exp} width={260} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Places */}
          {(activeTab === 'all' || activeTab === 'places') && filteredPlaces.length > 0 && (
            <View style={styles.groupSection}>
              <Typography variant="h3" weight="700" style={styles.groupTitle}>
                Heritage & Sights ({filteredPlaces.length})
              </Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardGrid}>
                {filteredPlaces.map((plc) => (
                  <PlaceCard key={plc.id} place={plc} width={220} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Restaurants */}
          {(activeTab === 'all' || activeTab === 'food') && filteredRestaurants.length > 0 && (
            <View style={styles.groupSection}>
              <Typography variant="h3" weight="700" style={styles.groupTitle}>
                Authentic Ceylon Flavors ({filteredRestaurants.length})
              </Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardGrid}>
                {filteredRestaurants.map((rst) => (
                  <RestaurantCard key={rst.id} restaurant={rst} width={260} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Stays */}
          {(activeTab === 'all' || activeTab === 'stays') && filteredStays.length > 0 && (
            <View style={styles.groupSection}>
              <Typography variant="h3" weight="700" style={styles.groupTitle}>
                Villas & Eco-Lodges ({filteredStays.length})
              </Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardGrid}>
                {filteredStays.map((sty) => (
                  <StayCard key={sty.id} stay={sty} width={270} />
                ))}
              </ScrollView>
            </View>
          )}
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
  headerArea: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  screenTitle: {
    marginBottom: Spacing.sm,
  },
  tabsWrapper: {
    marginTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  tabsRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  tabButton: {
    paddingHorizontal: 14,
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
  provinceWrapper: {
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  provinceRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  provChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  provChipActive: {
    backgroundColor: 'rgba(78, 171, 139, 0.15)',
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  loadingContainer: {
    padding: Spacing.lg,
  },
  scrollList: {
    paddingBottom: 60,
  },
  groupSection: {
    marginTop: Spacing.lg,
  },
  groupTitle: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  cardStack: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  cardGrid: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
});
