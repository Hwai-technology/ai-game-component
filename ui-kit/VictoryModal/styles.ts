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
  starsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  starSide: {
    transform: [{ rotate: '-10deg' }],
  },
  starCenter: {
    marginBottom: spacing.xs,
  },
  starFilled: {
    opacity: 1,
  },
  starDim: {
    opacity: 0.35,
  },
  ribbon: {
    marginVertical: spacing.xs,
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
  scoreRow: {
    alignItems: 'center',
  },
  scoreLabel: {
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
  subRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    alignItems: 'center',
  },
  subLabel: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xs,
    color: text.secondary,
  },
  subValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: text.primary,
  },
  rewardContainer: {
    marginTop: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    width: '100%',
  },
  smallButton: {
    width: 60,
  },
  mainButton: {
    flex: 1,
  },
});

