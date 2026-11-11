/**
 * GameKit Design System - Typography Tokens
 */

export const fontFamily = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  heavy: 'System',
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

export const typography = {
  fontFamily,
  fontSize,
  button: {
    fontSize: 18,
    fontFamily: fontFamily.heavy,
  },
  buttonSmall: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
  caption: {
    fontSize: 12,
    fontFamily: fontFamily.medium,
  },
  title: {
    fontSize: 20,
    fontFamily: fontFamily.bold,
  },
  heading: {
    fontSize: 24,
    fontFamily: fontFamily.heavy,
  },
  body: {
    fontSize: 16,
    fontFamily: fontFamily.regular,
  },
  hudNumber: {
    fontSize: 22,
    fontFamily: fontFamily.heavy,
  },
} as const;
