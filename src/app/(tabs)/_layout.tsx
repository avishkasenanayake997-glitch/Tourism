// ==============================================================================
// Lankora: Luxury Floating Glass Dock Navigation
// ==============================================================================

import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFavorites } from '@/context/FavoritesContext';
import { Colors } from '@/constants/theme';
import { Typography } from '@/components/ui/Typography';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { favorites } = useFavorites();

  const bottomMargin = Platform.OS === 'ios' ? Math.max(insets.bottom - 4, 12) : 16;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: bottomMargin,
          left: 16,
          right: 16,
          elevation: 12,
          backgroundColor: 'rgba(12, 18, 15, 0.94)',
          borderRadius: 28,
          height: 64,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.55,
          shadowRadius: 20,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.gold.primary,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.42)',
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '700',
          letterSpacing: 0.2,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItemWrapper, focused && styles.activePill]}>
              <Ionicons
                name={focused ? 'compass' : 'compass-outline'}
                size={22}
                color={focused ? Colors.gold.primary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItemWrapper, focused && styles.activePill]}>
              <Ionicons
                name={focused ? 'map' : 'map-outline'}
                size={21}
                color={focused ? Colors.gold.primary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItemWrapper, focused && styles.activePill]}>
              <Ionicons
                name={focused ? 'calendar' : 'calendar-outline'}
                size={21}
                color={focused ? Colors.gold.primary : color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItemWrapper, focused && styles.activePill]}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={focused ? 'heart' : 'heart-outline'}
                  size={21}
                  color={focused ? Colors.terracotta.primary : color}
                />
                {favorites.length > 0 && (
                  <View style={styles.badge}>
                    <Typography variant="caption" style={styles.badgeText}>
                      {favorites.length}
                    </Typography>
                  </View>
                )}
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.tabItemWrapper, focused && styles.activePill]}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={21}
                color={focused ? Colors.gold.primary : color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItemWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 32,
    borderRadius: 16,
  },
  activePill: {
    backgroundColor: 'rgba(245, 176, 65, 0.12)',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: Colors.terracotta.primary,
    borderRadius: 8,
    minWidth: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#0C120F',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 11,
  },
});
