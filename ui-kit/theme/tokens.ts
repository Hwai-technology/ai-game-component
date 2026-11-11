/**
 * GameKit Design System - Master Theme Tokens Aggregator
 *
 * Separates design tokens into modular, independently maintainable files:
 * - colors.ts (palette, surface, text, gradients, disabledTint)
 * - typography.ts (fontFamily, fontSize, button)
 * - spacing.ts (spacing, radius)
 * - shadows.ts (chunky, shadows)
 * - motion.ts (motion, animation parameters)
 */

import { palette, surface, text, gradients, disabledTint } from './colors';
import { typography } from './typography';
import { spacing, radius } from './spacing';
import { chunky, shadows } from './shadows';
import { motion } from './motion';

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './motion';

export type ThemePalette = typeof palette;
export type ThemeSurface = typeof surface;
export type ThemeText = typeof text;
export type ThemeGradients = typeof gradients;
export type ThemeDisabledTint = typeof disabledTint;
export type ThemeTypography = typeof typography;
export type ThemeSpacing = typeof spacing;
export type ThemeRadius = typeof radius;
export type ThemeChunky = typeof chunky;
export type ThemeShadows = typeof shadows;
export type ThemeMotion = typeof motion;

export interface ThemeTokensContract {
  palette: ThemePalette;
  surface: ThemeSurface;
  text: ThemeText;
  gradients: ThemeGradients;
  disabledTint: ThemeDisabledTint;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  radius: ThemeRadius;
  chunky: ThemeChunky;
  shadows: ThemeShadows;
  motion: ThemeMotion;
}

export const themeTokens: ThemeTokensContract = {
  palette,
  surface,
  text,
  gradients,
  disabledTint,
  typography,
  spacing,
  radius,
  chunky,
  shadows,
  motion,
};

export default themeTokens;
