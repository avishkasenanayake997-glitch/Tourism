// ==============================================================================
// Lankora: Typography Component
// ==============================================================================

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { Colors, Typography as TypeTokens } from '@/constants/theme';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'bodyLarge'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'badge';

export interface TypographyProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  weight?: '400' | '500' | '600' | '700' | '800';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color,
  weight,
  align,
  style,
  children,
  ...props
}) => {
  const token = TypeTokens[variant] || TypeTokens.body;
  const textColor = color || Colors.dark.text;

  return (
    <RNText
      style={[
        token,
        { color: textColor },
        weight ? { fontWeight: weight } : null,
        align ? { textAlign: align } : null,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
