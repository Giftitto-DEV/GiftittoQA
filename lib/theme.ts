import { colors } from './colors';

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
  xxxxxl: 48,
};

export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  xxxl: 24,
  full: 9999,
};

export const typography = {
  displayLarge: {
    fontSize: 40,
    fontWeight: '800' as const,
    lineHeight: '48px',
    letterSpacing: '-0.5px',
  },
  display: {
    fontSize: 36,
    fontWeight: '800' as const,
    lineHeight: '44px',
    letterSpacing: '-0.5px',
  },
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: '40px',
    letterSpacing: '-0.5px',
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: '36px',
    letterSpacing: '-0.25px',
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: '32px',
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: '28px',
  },
  h5: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: '26px',
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: '28px',
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: '24px',
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: '22px',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: '20px',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: '16px',
    letterSpacing: '0.25px',
  },
  captionSmall: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: '14px',
    letterSpacing: '0.5px',
  },
  overline: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: '16px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: '24px',
    letterSpacing: '0.25px',
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: '20px',
    letterSpacing: '0.25px',
  },
  buttonLarge: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: '28px',
    letterSpacing: '0.25px',
  },
};

export const shadows = {
  xs: '0 1px 1px rgba(0, 0, 0, 0.03)',
  sm: '0 2px 3px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.08)',
  lg: '0 8px 12px rgba(0, 0, 0, 0.12)',
  xl: '0 12px 16px rgba(0, 0, 0, 0.15)',
  xxl: '0 20px 24px rgba(0, 0, 0, 0.2)',
  colored: `0 4px 8px rgba(217, 21, 61, 0.2)`,
  coloredLarge: `0 8px 16px rgba(217, 21, 61, 0.25)`,
};

export const animations = {
  timing: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
};

export const iconSizes = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const responsiveTypography = {
  getResponsiveSize: (baseSize: number, screenWidth: number): number => {
    if (screenWidth < 375) return Math.round(baseSize * 0.85);
    if (screenWidth < 480) return baseSize;
    if (screenWidth < 768) return Math.round(baseSize * 1.05);
    if (screenWidth < 1024) return Math.round(baseSize * 1.1);
    return Math.round(baseSize * 1.15);
  },
};

export const circleContainerSizes = {
  xs: { width: 28, height: 28, borderRadius: 14 },
  sm: { width: 36, height: 36, borderRadius: 18 },
  md: { width: 44, height: 44, borderRadius: 22 },
  lg: { width: 48, height: 48, borderRadius: 24 },
  xl: { width: 64, height: 64, borderRadius: 32 },
  xxl: { width: 96, height: 96, borderRadius: 48 },
};

export const layout = {
  maxWidth: 1280,
  navHeight: 64,
  navHeightMobile: 56,
  sidebarWidth: 260,
  contentPadding: 24,
  contentPaddingMobile: 16,
};

export const transitions = {
  default: 'all 0.2s ease',
  fast: 'all 0.15s ease',
  slow: 'all 0.3s ease',
};

export { colors };
