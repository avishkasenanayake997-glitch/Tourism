// ==============================================================================
// Lankora: Luxury Design System & Aesthetic Tokens
// Inspired by Sri Lanka's emerald tea hills, Indian ocean horizons, and ancient citadels
// ==============================================================================

export const Colors = {
  // Brand Heritage Palettes
  gold: {
    primary: '#F5B041',
    light: '#FCD34D',
    deep: '#D97706',
    glow: 'rgba(245, 176, 65, 0.25)',
  },
  emerald: {
    deepest: '#050D0A',
    dark: '#0A1A14',
    primary: '#059669',
    vibrant: '#10B981',
    mint: '#34D399',
    accent: '#6EE7B7',
    glow: 'rgba(52, 211, 153, 0.22)',
  },
  ocean: {
    darkest: '#030E14',
    deep: '#072430',
    primary: '#0284C7',
    cyan: '#38BDF8',
    glow: 'rgba(56, 189, 248, 0.2)',
  },
  terracotta: {
    primary: '#FF6B4A',
    light: '#FB923C',
    deep: '#C85235',
    subtle: 'rgba(255, 107, 74, 0.15)',
  },
  sand: {
    lightest: '#FAF8F5',
    soft: '#F4ECE1',
    warm: '#E2D5C3',
    muted: '#B8A58D',
  },

  // Dark Luxury Palette (Primary Visual Identity)
  dark: {
    background: '#070A09',
    surface: '#0E1512',
    surfaceElevated: '#15201C',
    surfaceHighlight: '#1E2C26',
    surfacePill: 'rgba(255, 255, 255, 0.06)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.14)',
    borderGlow: 'rgba(52, 211, 153, 0.3)',

    text: '#FFFFFF',
    textSecondary: '#E2E8E5',
    textMuted: '#94A39D',
    textSubtle: '#64746E',

    accent: '#F5B041', // Royal Ceylon Gold
    accentGreen: '#34D399', // Brilliant Emerald
    accentOcean: '#38BDF8', // Cyan Shoreline
    accentCoral: '#FF6B4A', // Mirissa Sunset

    overlay: 'rgba(7, 10, 9, 0.65)',
    overlayHeavy: 'rgba(7, 10, 9, 0.92)',
    glass: 'rgba(14, 21, 18, 0.78)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',

    star: '#F5B041',
    danger: '#EF4444',
    success: '#10B981',
    backgroundElement: '#15201C',
    backgroundSelected: '#1E2C26',
  },

  // Light Theme (Editorial High-Key)
  light: {
    background: '#F8FAF9',
    surface: '#FFFFFF',
    surfaceElevated: '#F0F4F2',
    surfaceHighlight: '#E4ECE8',
    surfacePill: 'rgba(0, 0, 0, 0.04)',
    border: '#E2E8E4',
    borderLight: '#EDF2EE',
    borderGlow: 'rgba(5, 150, 105, 0.3)',

    text: '#0C1411',
    textSecondary: '#24332D',
    textMuted: '#64756E',
    textSubtle: '#8E9E98',

    accent: '#D97706',
    accentGreen: '#059669',
    accentOcean: '#0284C7',
    accentCoral: '#EA580C',

    overlay: 'rgba(255, 255, 255, 0.8)',
    overlayHeavy: 'rgba(255, 255, 255, 0.95)',
    glass: 'rgba(255, 255, 255, 0.85)',
    glassBorder: 'rgba(0, 0, 0, 0.06)',

    star: '#D97706',
    danger: '#DC2626',
    success: '#059669',
    backgroundElement: '#F0F4F2',
    backgroundSelected: '#E4ECE8',
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
  xl: 22,
  xxl: 28,
  full: 9999,
};

export const Typography = {
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800' as const,
    letterSpacing: -0.8,
  },
  h1: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '400' as const,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
  },
  badge: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 8,
  },
  emeraldGlow: {
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  goldGlow: {
    shadowColor: '#F5B041',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  }
};
