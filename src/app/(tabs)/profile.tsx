// ==============================================================================
// Lankora: Profile & Passport Screen (Luxury Traveler Identity)
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useTrips } from '@/context/TripsContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PASSPORT_STAMPS = [
  { id: 'stamp-1', name: 'SIGIRIYA', title: 'Lion Rock Fortress', color: '#F5B041', icon: 'shield' },
  { id: 'stamp-2', name: 'ELLA GAP', title: 'Highland Cloud Forest', color: '#34D399', icon: 'leaf' },
  { id: 'stamp-3', name: 'YALA BLOCK 1', title: 'Leopard Territory', color: '#FF6B4A', icon: 'paw' },
  { id: 'stamp-4', name: 'GALLE FORT', title: '17th-C. Bastions', color: '#38BDF8', icon: 'water' },
];

const PREFERENCES = [
  'Culture & Temples',
  'Tea Hills & Mist',
  'Wild Safaris',
  'Ocean Surfing',
  'Eco-Villas',
  'Ceylon Curries',
  'Train Journeys',
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  const { trips } = useTrips();

  const [activePreferences, setActivePreferences] = useState<string[]>([
    'Culture & Temples',
    'Tea Hills & Mist',
    'Wild Safaris',
    'Eco-Villas'
  ]);

  const togglePref = (pref: string) => {
    if (activePreferences.includes(pref)) {
      setActivePreferences(activePreferences.filter((p) => p !== pref));
    } else {
      setActivePreferences([...activePreferences, pref]);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to end your session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const supabaseLive = isSupabaseConfigured();

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollList, { paddingBottom: 110 }]}
      >
        {/* Luxury Identity Card */}
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={['#17241E', '#0F1814', '#080C0A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.userCard}
          >
            <View style={styles.cardHeader}>
              <View style={styles.passportLabelRow}>
                <Ionicons name="sparkles" size={13} color={Colors.gold.primary} />
                <Typography variant="badge" color={Colors.gold.primary} weight="800" style={{ letterSpacing: 1.2 }}>
                  CEYLON PASSPORT · 2026
                </Typography>
              </View>

              <View style={styles.statusLivePill}>
                <View style={styles.greenPulseDot} />
                <Typography variant="caption" color={Colors.emerald.accent} weight="700" style={{ fontSize: 10 }}>
                  ACTIVE TRAVELER
                </Typography>
              </View>
            </View>

            <View style={styles.userMainRow}>
              <View style={styles.avatarBorder}>
                <Image
                  source={{
                    uri: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
                  }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </View>

              <View style={styles.userInfo}>
                <View style={styles.nameRow}>
                  <Typography variant="h2" color="#FFFFFF" weight="800">
                    {user?.name || 'Avishka Senanayake'}
                  </Typography>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.gold.primary} />
                </View>

                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)" numberOfLines={1}>
                  {user?.email || 'traveler@lankora.com'}
                </Typography>

                <View style={styles.originPill}>
                  <Ionicons name="earth-outline" size={12} color={Colors.gold.light} />
                  <Typography variant="caption" color="#FCD34D" weight="700">
                    Based in {user?.home_country || 'Sri Lanka'}
                  </Typography>
                </View>
              </View>
            </View>

            {user?.bio && (
              <Typography variant="bodySmall" color="rgba(255, 255, 255, 0.75)" style={styles.bio}>
                "{user.bio}"
              </Typography>
            )}

            {/* Quick Stats Grid */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Typography variant="h2" weight="800" color="#FFFFFF">
                  {favorites.length}
                </Typography>
                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                  Saved Gems
                </Typography>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Typography variant="h2" weight="800" color={Colors.gold.primary}>
                  {trips.length}
                </Typography>
                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                  Itineraries
                </Typography>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statBox}>
                <Typography variant="h2" weight="800" color={Colors.emerald.accent}>
                  9
                </Typography>
                <Typography variant="caption" color="rgba(255, 255, 255, 0.5)">
                  Provinces
                </Typography>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Ceylon Passport Stamps Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="ribbon" size={14} color={Colors.gold.primary} />
            <Typography variant="badge" color={Colors.gold.primary} weight="800">
              PASSPORT STAMPS · මුද්‍රා
            </Typography>
          </View>
          <Typography variant="h2" color="#FFFFFF" weight="800" style={styles.sectionHeaderTitle}>
            Wonders Explored
          </Typography>

          <View style={styles.stampsGrid}>
            {PASSPORT_STAMPS.map((stamp) => (
              <View key={stamp.id} style={styles.stampCard}>
                <View style={[styles.stampSeal, { borderColor: stamp.color }]}>
                  <Ionicons name={stamp.icon as any} size={22} color={stamp.color} />
                  <Typography variant="badge" color={stamp.color} weight="800" style={styles.stampText}>
                    {stamp.name}
                  </Typography>
                </View>
                <Typography variant="caption" color="#FFFFFF" weight="700" style={{ marginTop: 6 }}>
                  {stamp.title}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        {/* Travel Taste & DNA */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="sparkles" size={14} color={Colors.emerald.accent} />
            <Typography variant="badge" color={Colors.emerald.accent} weight="800">
              CURATED TRAVEL DNA
            </Typography>
          </View>
          <Typography variant="h2" color="#FFFFFF" weight="800" style={styles.sectionHeaderTitle}>
            Wanderlust Preferences
          </Typography>

          <View style={styles.prefGrid}>
            {PREFERENCES.map((pref) => {
              const active = activePreferences.includes(pref);
              return (
                <TouchableOpacity
                  key={pref}
                  activeOpacity={0.8}
                  onPress={() => togglePref(pref)}
                  style={[styles.prefChip, active && styles.prefChipActive]}
                >
                  <Typography
                    variant="caption"
                    color={active ? '#000000' : 'rgba(255, 255, 255, 0.8)'}
                    weight={active ? '800' : '600'}
                  >
                    {active ? '✓ ' : '+ '}{pref}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* System Architecture Node Card */}
        <View style={styles.systemCard}>
          <View style={styles.systemHeader}>
            <Ionicons name="cube-outline" size={16} color={Colors.gold.primary} />
            <Typography variant="caption" color={Colors.gold.primary} weight="800">
              MICROSERVICES CLUSTER
            </Typography>
          </View>
          <Typography variant="bodySmall" color="rgba(255, 255, 255, 0.65)" style={{ marginTop: 4, lineHeight: 18 }}>
            Engine connected to 5 domain microservices (Auth, Catalog, Bookings, Reviews, AI Itinerary) via Gateway (Port 8000).
          </Typography>
        </View>

        {/* Sign Out Action */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleSignOut}
          style={styles.signOutBtn}
        >
          <Ionicons name="log-out-outline" size={18} color="#FF6B4A" />
          <Typography variant="body" color="#FF6B4A" weight="700" style={{ marginLeft: 6 }}>
            Sign Out of Lankora
          </Typography>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#070A09',
  },
  scrollList: {
    paddingHorizontal: Spacing.lg,
  },
  cardWrapper: {
    marginBottom: Spacing.xl,
  },
  userCard: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(245, 176, 65, 0.28)',
    ...Shadows.goldGlow,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  passportLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusLivePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(52, 211, 153, 0.14)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.emerald.accent,
  },
  userMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarBorder: {
    padding: 3,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: Colors.gold.primary,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  originPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 176, 65, 0.1)',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  bio: {
    marginVertical: Spacing.md,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  statBox: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  sectionHeaderTitle: {
    letterSpacing: -0.4,
    marginBottom: Spacing.md,
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  stampCard: {
    width: (SCREEN_WIDTH - 44) / 2,
    backgroundColor: '#0E1512',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  stampSeal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  stampText: {
    fontSize: 8,
    letterSpacing: 0.8,
  },
  prefGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  prefChip: {
    backgroundColor: '#0F1714',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  prefChipActive: {
    backgroundColor: Colors.gold.primary,
    borderColor: Colors.gold.primary,
  },
  systemCard: {
    backgroundColor: 'rgba(15, 23, 20, 0.7)',
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  systemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 74, 0.1)',
    borderRadius: BorderRadius.xl,
    paddingVertical: 14,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 74, 0.25)',
  },
});
