// ==============================================================================
// Lankora: Empty State Component
// Emotional and human, encouraging discovery across Sri Lanka
// ==============================================================================

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from './Typography';
import { Button } from './Button';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionTitle?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'compass-outline',
  title,
  description,
  actionTitle,
  onAction,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={36} color={Colors.emerald.mint} />
      </View>
      <Typography variant="h3" align="center" style={styles.title}>
        {title}
      </Typography>
      <Typography variant="body" color={Colors.dark.textMuted} align="center" style={styles.desc}>
        {description}
      </Typography>
      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="sunset"
          size="md"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['3xl'],
    paddingVertical: Spacing['4xl'],
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(78, 171, 139, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(78, 171, 139, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  desc: {
    marginBottom: Spacing.xl,
    maxWidth: 290,
  },
  actionButton: {
    minWidth: 180,
  },
});
