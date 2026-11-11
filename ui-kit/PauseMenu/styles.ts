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
  content: {
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  settingsBox: {
    backgroundColor: surface.cream,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.cardSoft,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  toggleLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  toggleText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: text.primary,
  },
  buttonStack: {
    gap: spacing.sm,
  },
});

