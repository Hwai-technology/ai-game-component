import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { palette, radius, shadows, spacing, text, typography } from '@/constants/theme/tokens';

export type RibbonVariant = 'free' | 'new' | 'owned';

export type RibbonProps = {
  label: string;
  variant?: RibbonVariant;
  style?: ViewStyle;
};

const VARIANT_COLOR: Record<RibbonVariant, string> = {
  free: palette.teal[500],
  new: palette.pink[400],
  owned: palette.gold[500],
};

/** Small pill tag ("FREE" / "NEW" / "Owned") pinned on a card corner. */
export default function Ribbon({ label, variant = 'free', style }: RibbonProps) {
  return (
    <View style={[styles.ribbon, { backgroundColor: VARIANT_COLOR[variant] }, style]}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ribbon: {
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    ...shadows.card,
  },
  label: {
    fontFamily: typography.button.fontFamily,
    fontSize: 11,
    letterSpacing: 0.5,
    color: text.onDark,
  },
});
