import { StyleSheet } from 'react-native';
import {
  palette,
  radius,
  shadows,
  spacing,
  surface,
  text,
  typography,
} from '../theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  iconEmblem: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: surface.cream,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.cardSoft,
  },
  scoreCard: {
    width: '100%',
    backgroundColor: surface.cream,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
    ...shadows.cardSoft,
  },
  scoreTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xs,
    color: palette.purple[500],
    letterSpacing: 1.5,
  },
  scoreValue: {
    fontFamily: typography.fontFamily.heavy,
    fontSize: typography.fontSize.xxl,
    color: text.primary,
  },
  bestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  bestLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xs,
    color: text.secondary,
  },
  bestValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: palette.orange[600],
  },
  footerCol: {
    width: '100%',
    gap: spacing.sm,
  },
});
