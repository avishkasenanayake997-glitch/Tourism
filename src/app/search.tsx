// ==============================================================================
// Lankora: Global Live Search Screen
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { dataService } from '@/services/dataService';
import { Destination, Experience, Place, Restaurant, Stay } from '@/types';
import { Typography } from '@/components/ui/Typography';
import { SearchBar } from '@/components/ui/SearchBar';
import { DestinationCard } from '@/components/cards/DestinationCard';
import { ExperienceCard } from '@/components/cards/ExperienceCard';
import { PlaceCard } from '@/components/cards/PlaceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

const POPULAR_SUGGESTIONS = [
  'Ella Nine Arch Bridge',
  'Sigiriya Lion Rock',
  'Yala Leopard Safari',
  'Galle Fort Sunset',
  'Mirissa Blue Whales',
  'Ceylon Blue Train',
  'Tea Estate Eco-Lodge',
];

export default function SearchModalScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    destinations: Destination[];
    places: Place[];
    experiences: Experience[];
    restaurants: Restaurant[];
    stays: Stay[];
  }>({
    destinations: [],
    places: [],
    experiences: [],
    restaurants: [],
    stays: [],
  });
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({
        destinations: [],
        places: [],
        experiences: [],
        restaurants: [],
        stays: [],
      });
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      const res = await dataService.search(query);
      setResults(res);
      setSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const totalHits =
    results.destinations.length +
    results.places.length +
    results.experiences.length +
    results.restaurants.length +
    results.stays.length;

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.dark.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search Sri Lanka destinations, safaris, curries..."
            autoFocus
          />
        </View>
      </View>

      {/* When Empty: Show Popular Suggestions */}
      {!query.trim() ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.suggestionsContainer}>
          <Typography variant="badge" color={Colors.sand.warm} weight="700">
            POPULAR INQUIRIES
          </Typography>
          <Typography variant="h3" weight="700" style={{ marginTop: 2, marginBottom: Spacing.md }}>
            Curated Island Searches
          </Typography>

          <View style={styles.suggestionsList}>
            {POPULAR_SUGGESTIONS.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setQuery(item.split(' ')[0])}
                style={styles.suggestionChip}
              >
                <Ionicons name="trending-up-outline" size={15} color={Colors.emerald.mint} />
                <Typography variant="bodySmall" color={Colors.dark.textSecondary} style={{ marginLeft: 6 }}>
                  {item}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : totalHits === 0 && !searching ? (
        <EmptyState
          icon="search-outline"
          title="No Discoveries Found"
          description={`We couldn’t find matching results for "${query}". Try searching for Ella, Sigiriya, Safari, or Train.`}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.resultsScroll}>
          <Typography variant="caption" color={Colors.dark.textMuted} style={styles.resultCount}>
            Found {totalHits} results across Ceylon
          </Typography>

          {/* Destinations */}
          {results.destinations.length > 0 && (
            <View style={styles.sectionBlock}>
              <Typography variant="h3" weight="700" style={styles.sectionTitle}>
                Destinations ({results.destinations.length})
              </Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
                {results.destinations.map((d) => (
                  <DestinationCard key={d.id} destination={d} variant="standard" />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Experiences */}
          {results.experiences.length > 0 && (
            <View style={styles.sectionBlock}>
              <Typography variant="h3" weight="700" style={styles.sectionTitle}>
                Experiences ({results.experiences.length})
              </Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
                {results.experiences.map((e) => (
                  <ExperienceCard key={e.id} experience={e} width={250} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Places */}
          {results.places.length > 0 && (
            <View style={styles.sectionBlock}>
              <Typography variant="h3" weight="700" style={styles.sectionTitle}>
                Heritage Sights ({results.places.length})
              </Typography>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
                {results.places.map((p) => (
                  <PlaceCard key={p.id} place={p} width={220} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionsContainer: {
    padding: Spacing.lg,
  },
  suggestionsList: {
    gap: Spacing.sm,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceElevated,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  resultsScroll: {
    paddingBottom: 60,
  },
  resultCount: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.sm,
  },
  sectionBlock: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  cardRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
});
