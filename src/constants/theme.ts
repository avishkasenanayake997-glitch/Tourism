// ==============================================================================
// Lankora: Design System Tokens & Theme
// Inspired by Sri Lanka's emerald tea hills, Indian ocean horizons, and ancient rock citadels
// ==============================================================================

export const Colors = {
  // Brand Palettes
  ocean: {
    darkest: '#061C22',
    deep: '#0A2E36',
    primary: '#0F4C5C',
    medium: '#1B6B7F',
    light: '#328FA6',
    soft: '#E6F3F7',
  },
  emerald: {
    deepest: '#091A14',
    dark: '#112C22',
    primary: '#1D4A3A',
    vibrant: '#2A6F57',
    mint: '#4EAB8B',
    accent: '#72D7B2',
  },
  sand: {
    lightest: '#FAF7F2',
    soft: '#F3ECE1',
    warm: '#E6DAC7',
    muted: '#C9B69B',
    deep: '#8C7758',
  },
  terracotta: {
    primary: '#E76F51',
    light: '#F4A261',
    deep: '#C85235',
    subtle: '#38221D',
  },

  // Dark Luxury Theme (Primary visual mode)
  dark: {
    background: '#0B110F',
    surface: '#121A17',
    surfaceElevated: '#182420',
    surfaceHighlight: '#20312B',
    border: '#22332D',
    borderLight: '#2C423A',
    
    text: '#F5F8F6',
    textSecondary: '#D1DDD8',
    textMuted: '#899E97',
    textSubtle: '#596F68',

    accent: '#E76F51', // Terracotta warm sunset
    accentGreen: '#4EAB8B', // Forest emerald
    accentOcean: '#269AB2', // Deep coastal cyan

    overlay: 'rgba(11, 17, 15, 0.72)',
    overlayHeavy: 'rgba(11, 17, 15, 0.92)',
    glass: 'rgba(24, 36, 32, 0.75)',

    star: '#FBBF24',
    danger: '#EF4444',
    success: '#10B981',
    backgroundElement: '#182420',
    backgroundSelected: '#20312B',
  },

  // Light Theme (Optional companion)
  light: {
    background: '#F9FBF9',
    surface: '#FFFFFF',
    surfaceElevated: '#F3F6F4',
    surfaceHighlight: '#E8EFEA',
    border: '#E0E7E3',
    borderLight: '#ECEFEA',

    text: '#111A17',
    textSecondary: '#33443E',
    textMuted: '#687B74',
    textSubtle: '#96A8A1',

    accent: '#E76F51',
    accentGreen: '#1D4A3A',
    accentOcean: '#0F4C5C',

    overlay: 'rgba(255, 255, 255, 0.8)',
    overlayHeavy: 'rgba(255, 255, 255, 0.95)',
    glass: 'rgba(255, 255, 255, 0.85)',

    star: '#F59E0B',
    danger: '#DC2626',
    success: '#059669',
    backgroundElement: '#ECEFEA',
    backgroundSelected: '#E0E7E3',
  }
};

export type ThemeColor = keyof typeof Colors.dark;

export const Fonts = {
  sans: 'System',
  mono: 'Courier'
};

export const MaxContentWidth = 1200;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '700' as const,
    letterSpacing: -0.6,
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  h4: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  badge: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '600' as const,
    letterSpacing: 0.4,
    textTransform: 'uppercase' as const,
  }
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  glowGreen: {
    shadowColor: '#4EAB8B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  glowTerracotta: {
    shadowColor: '#E76F51',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  }
};
