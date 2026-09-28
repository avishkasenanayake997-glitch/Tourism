// ==============================================================================
// Lankora: Badge Component
// ==============================================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export type BadgeVariant = 'emerald' | 'terracotta' | 'ocean' | 'sand' | 'neutral';

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
      case 'terracotta':
        return {
          bg: 'rgba(231, 111, 81, 0.16)',
          border: 'rgba(231, 111, 81, 0.35)',
          text: Colors.terracotta.light,
        };
      case 'ocean':
        return {
          bg: 'rgba(38, 154, 178, 0.16)',
          border: 'rgba(38, 154, 178, 0.35)',
          text: '#4DC8E2',
        };
      case 'sand':
        return {
          bg: 'rgba(243, 236, 225, 0.12)',
          border: 'rgba(243, 236, 225, 0.25)',
          text: Colors.sand.warm,
        };
      case 'neutral':
        return {
          bg: 'rgba(255, 255, 255, 0.08)',
          border: Colors.dark.border,
          text: Colors.dark.textSecondary,
        };
      case 'emerald':
      default:
        return {
          bg: 'rgba(78, 171, 139, 0.15)',
          border: 'rgba(78, 171, 139, 0.35)',
          text: Colors.emerald.accent,
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
        weight="600"
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
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  md: {
    paddingHorizontal: 11,
    paddingVertical: 4.5,
  },
  textSm: {
    fontSize: 9.5,
    letterSpacing: 0.3,
  },
  textMd: {
    fontSize: 11,
    letterSpacing: 0.4,
  },
});
