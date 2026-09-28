// ==============================================================================
// Lankora: Luxury Pill Badge Component
// ==============================================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export type BadgeVariant = 'emerald' | 'gold' | 'terracotta' | 'ocean' | 'sand' | 'glass' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'emerald',
  size = 'md',
  style,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'gold':
        return {
          bg: 'rgba(245, 176, 65, 0.16)',
          border: 'rgba(245, 176, 65, 0.38)',
          text: '#FCD34D',
        };
      case 'terracotta':
        return {
          bg: 'rgba(255, 107, 74, 0.16)',
          border: 'rgba(255, 107, 74, 0.35)',
          text: '#FF8A65',
        };
      case 'ocean':
        return {
          bg: 'rgba(56, 189, 248, 0.16)',
          border: 'rgba(56, 189, 248, 0.35)',
          text: '#38BDF8',
        };
      case 'glass':
        return {
          bg: 'rgba(12, 18, 15, 0.72)',
          border: 'rgba(255, 255, 255, 0.18)',
          text: '#FFFFFF',
        };
      case 'sand':
        return {
          bg: 'rgba(244, 236, 225, 0.12)',
          border: 'rgba(244, 236, 225, 0.28)',
          text: '#F4ECE1',
        };
      case 'neutral':
        return {
          bg: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.12)',
          text: '#E2E8E5',
        };
      case 'emerald':
      default:
        return {
          bg: 'rgba(52, 211, 153, 0.15)',
          border: 'rgba(52, 211, 153, 0.38)',
          text: '#34D399',
        };
    }
  };

  const c = getColors();

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: c.bg, borderColor: c.border },
        style,
      ]}
    >
      <Typography
        variant="badge"
        color={c.text}
        weight="700"
        style={size === 'sm' ? styles.textSm : styles.textMd}
      >
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3.5,
  },
  md: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
  },
  textSm: {
    fontSize: 9.5,
    letterSpacing: 0.8,
  },
  textMd: {
    fontSize: 10.5,
    letterSpacing: 0.8,
  },
});
