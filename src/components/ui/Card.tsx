// ==============================================================================
// Lankora: Card Component
// ==============================================================================

import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'elevated' | 'surface' | 'highlight' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'surface',
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return [styles.elevated, Shadows.sm];
      case 'highlight':
        return styles.highlight;
      case 'outlined':
        return styles.outlined;
      case 'surface':
      default:
        return styles.surface;
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={[styles.base, getVariantStyle(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[styles.base, getVariantStyle(), style]}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  surface: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  elevated: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.borderLight,
  },
  highlight: {
    backgroundColor: Colors.dark.surfaceHighlight,
    borderWidth: 1,
    borderColor: 'rgba(78, 171, 139, 0.3)',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
});
