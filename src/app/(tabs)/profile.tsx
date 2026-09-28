// ==============================================================================
// Lankora: Profile & Passport Screen
// ==============================================================================

import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useTrips } from '@/context/TripsContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const PASSPORT_STAMPS = [
  { id: 'stamp-1', name: 'ELLA GAP', province: 'UVA', color: Colors.emerald.mint, icon: 'leaf' },
  { id: 'stamp-2', name: 'LION ROCK', province: 'CENTRAL', color: Colors.terracotta.primary, icon: 'ribbon' },
  { id: 'stamp-3', name: 'GALLE RAMPARTS', province: 'SOUTHERN', color: Colors.sand.warm, icon: 'shield' },
  { id: 'stamp-4', name: 'YALA SAFARI', province: 'WILD', color: Colors.emerald.accent, icon: 'paw' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  const { trips } = useTrips();

  const [activePreferences, setActivePreferences] = useState(
    user?.travel_preferences.travel_style || ['Culture', 'Nature', 'Photography']
  );

  const togglePref = (pref: string) => {
    if (activePreferences.includes(pref)) {
      setActivePreferences(activePreferences.filter((p) => p !== pref));
    } else {
      setActivePreferences([...activePreferences, pref]);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to end this session?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const supabaseLive = isSupabaseConfigured();

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollList}>
        {/* User Card */}
        <View style={[styles.userCard, Shadows.md]}>
          <View style={styles.userTopRow}>
            <Image
              source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Typography variant="h2" weight="700">
                  {user?.name || 'Explorer'}
                </Typography>
                <Ionicons name="checkmark-circle" size={18} color={Colors.emerald.mint} />
              </View>
              <Typography variant="bodySmall" color={Colors.dark.textMuted}>
                {user?.email || 'explorer@lankora.com'}
              </Typography>
              <Typography variant="caption" color={Colors.sand.warm} weight="600" style={styles.countryTag}>
                📍 Based in {user?.home_country || 'Sri Lanka'}
              </Typography>
            </View>
          </View>

          {user?.bio && (
            <Typography variant="bodySmall" color={Colors.dark.textSecondary} style={styles.bio}>
              "{user.bio}"
            </Typography>
          )}

          {/* Quick Stats Grid */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Typography variant="h3" weight="700" color={Colors.emerald.accent}>
                {favorites.length}
              </Typography>
              <Typography variant="caption" color={Colors.dark.textMuted}>
                Saved
              </Typography>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Typography variant="h3" weight="700" color={Colors.sand.warm}>
                {trips.length}
              </Typography>
              <Typography variant="caption" color={Colors.dark.textMuted}>
                Trips
              </Typography>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Typography variant="h3" weight="700" color={Colors.terracotta.light}>
                12
              </Typography>
              <Typography variant="caption" color={Colors.dark.textMuted}>
                Districts
              </Typography>
            </View>
          </View>
        </View>

        {/* Ceylon Passport Stamps Section */}
        <View style={styles.section}>
          <Typography variant="badge" color={Colors.emerald.accent} weight="700">
            PASSPORT STAMPS · මුද්‍රා
          </Typography>
          <Typography variant="h3" weight="700" style={styles.sectionTitle}>
            Wonders Explored
          </Typography>

          <View style={styles.stampsGrid}>
            {PASSPORT_STAMPS.map((stamp) => (
              <View key={stamp.id} style={[styles.stampCard, { borderColor: stamp.color }]}>
                <Ionicons name={stamp.icon as any} size={20} color={stamp.color} />
                <Typography variant="caption" weight="800" color={stamp.color} style={styles.stampName}>
                  {stamp.name}
                </Typography>
                <Typography variant="caption" color={Colors.dark.textMuted} style={styles.stampProv}>
                  {stamp.province}
                </Typography>
              </View>
            ))}
          </View>
        </View>

        {/* Travel Style Preferences */}
        <View style={styles.section}>
          <Typography variant="badge" color={Colors.terracotta.light} weight="700">
            PREFERENCES
          </Typography>
          <Typography variant="h3" weight="700" style={styles.sectionTitle}>
            Your Travel Signature
          </Typography>

          <View style={styles.prefGrid}>
            {['Nature', 'Culture', 'Wildlife', 'Surfing', 'Photography', 'Culinary', 'Eco Luxury'].map(
              (tag) => {
                const active = activePreferences.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => togglePref(tag)}
                    style={[styles.prefChip, active && styles.prefChipActive]}
                  >
                    <Ionicons
                      name={active ? 'checkmark-circle' : 'add-circle-outline'}
                      size={14}
                      color={active ? '#FFFFFF' : Colors.emerald.mint}
                    />
                    <Typography
                      variant="caption"
                      weight={active ? '700' : '500'}
                      color={active ? '#FFFFFF' : Colors.dark.textSecondary}
                      style={styles.prefText}
                    >
                      {tag}
                    </Typography>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </View>

        {/* Supabase Integration Diagnostics Status */}
        <View style={styles.backendCard}>
          <View style={styles.backendHeader}>
            <Ionicons
              name={supabaseLive ? 'cloud-done-outline' : 'shield-checkmark-outline'}
              size={22}
              color={supabaseLive ? Colors.emerald.mint : Colors.sand.warm}
            />
            <Typography variant="body" weight="700" color="#FFFFFF" style={styles.backendTitle}>
              {supabaseLive ? 'Supabase Live Connected' : 'Local Offline Engine Active'}
            </Typography>
          </View>
          <Typography variant="bodySmall" color={Colors.dark.textMuted} style={styles.backendDesc}>
            {supabaseLive
              ? 'Your account, trips, and favorites sync seamlessly with Supabase PostgreSQL and Row Level Security.'
              : 'Operating with full local persistence via AsyncStorage. Add your Supabase project keys in .env whenever you are ready to sync to the cloud.'}
          </Typography>
        </View>

        {/* Sign Out Action */}
        <View style={styles.actionButtons}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="secondary"
            size="md"
          />
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
  scrollList: {
    padding: Spacing.lg,
    paddingBottom: 60,
  },
  userCard: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: Spacing.xl,
  },
  userTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: Colors.emerald.mint,
  },
  userInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countryTag: {
    marginTop: 4,
  },
  bio: {
    lineHeight: 19,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceHighlight,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.dark.border,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  stampCard: {
    width: '48%',
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampName: {
    marginTop: 6,
    letterSpacing: 0.5,
  },
  stampProv: {
    fontSize: 9.5,
  },
  prefGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  prefChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  prefChipActive: {
    backgroundColor: Colors.emerald.vibrant,
    borderColor: Colors.emerald.mint,
  },
  prefText: {
    marginLeft: 5,
  },
  backendCard: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: Spacing.xl,
  },
  backendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  backendTitle: {
    marginLeft: Spacing.sm,
  },
  backendDesc: {
    lineHeight: 18,
  },
  actionButtons: {
    marginTop: Spacing.md,
  },
});
