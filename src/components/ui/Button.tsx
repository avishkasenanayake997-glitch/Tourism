// ==============================================================================
// Lankora: Premium Button Component
// ==============================================================================

import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Typography } from './Typography';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'sunset' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'sunset':
        return styles.sunset;
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      case 'ghost':
        return styles.ghost;
      case 'primary':
      default:
        return styles.primary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.sizeSm;
      case 'lg':
        return styles.sizeLg;
      case 'md':
      default:
        return styles.sizeMd;
    }
  };

  const getTextColor = () => {
    if (disabled) return Colors.dark.textMuted;
    switch (variant) {
      case 'sunset':
        return '#FFFFFF';
      case 'outline':
        return Colors.emerald.mint;
      case 'ghost':
        return Colors.dark.textSecondary;
      case 'secondary':
        return Colors.dark.text;
      case 'primary':
      default:
        return '#FFFFFF';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconWrapper}>{leftIcon}</View>}
          <Typography
            variant={size === 'sm' ? 'caption' : size === 'lg' ? 'h4' : 'body'}
            weight="600"
            color={getTextColor()}
            style={textStyle}
          >
            {title}
          </Typography>
          {rightIcon && <View style={styles.rightIconWrapper}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconWrapper: {
    marginRight: Spacing.sm,
  },
  rightIconWrapper: {
    marginLeft: Spacing.sm,
  },
  // Variants
  primary: {
    backgroundColor: Colors.emerald.vibrant,
  },
  sunset: {
    backgroundColor: Colors.terracotta.primary,
  },
  secondary: {
    backgroundColor: Colors.dark.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.emerald.mint,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  sizeSm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.sm,
  },
  sizeMd: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.md,
  },
  sizeLg: {
    paddingVertical: 16,
    paddingHorizontal: 26,
    borderRadius: BorderRadius.lg,
  },
  disabled: {
    opacity: 0.5,
  },
});
