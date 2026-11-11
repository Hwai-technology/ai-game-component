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
    width: '100%',
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: surface.cream,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    ...shadows.cardSoft,
  },
  selfRow: {
    backgroundColor: palette.purple[700],
    borderWidth: 2,
    borderColor: palette.gold[500],
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  rankMedal: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalText: {
    fontFamily: typography.fontFamily.heavy,
    fontSize: 12,
    color: surface.white,
  },
  rankNumBox: {
    width: 26,
    alignItems: 'center',
  },
  rankNumText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 12,
    color: text.secondary,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: surface.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: text.primary,
    flex: 1,
  },
  selfText: {
    color: surface.white,
  },
  scoreText: {
    fontFamily: typography.fontFamily.heavy,
    fontSize: typography.fontSize.sm,
    color: palette.orange[600],
  },
  selfScore: {
    color: palette.gold[300],
  },
});

