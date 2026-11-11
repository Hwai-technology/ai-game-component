import { StyleSheet } from 'react-native';
import {
  radius,
  shadows,
  spacing,
  surface,
  text,
  typography,
} from '../theme';

export const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: surface.cream,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.cardSoft,
  },
  badgeWrapper: {
    position: 'absolute',
    top: -6,
    right: -6,
    zIndex: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xs,
    ...shadows.cardSoft,
  },
  title: {
    fontFamily: typography.fontFamily.heavy,
    fontSize: typography.fontSize.sm,
    color: text.primary,
    textAlign: 'center',
  },
  description: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.xs,
    color: text.secondary,
    textAlign: 'center',
    minHeight: 28,
  },
  actionRow: {
    width: '100%',
    marginTop: spacing.xs,
  },
});

