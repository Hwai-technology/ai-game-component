import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { palette, radius, shadows, spacing, text, typography } from '../theme';

export type RibbonVariant = 'free' | 'new' | 'owned' | 'gold' | 'purple' | 'primary' | 'secondary' | 'orange';

export type RibbonProps = {
  label?: string;
  text?: string;
  variant?: RibbonVariant;
  style?: ViewStyle;
};

const VARIANT_COLOR: Record<RibbonVariant, string> = {
  free: palette.teal[500],
  new: palette.pink[400],
  owned: palette.gold[500],
  gold: palette.gold[500],
  purple: palette.purple[500],
  primary: palette.teal[500],
  secondary: palette.purple[500],
  orange: palette.orange[500],
};

/** Small pill tag ("FREE" / "NEW" / "Owned") pinned on a card corner. */
export default function Ribbon({ label, text: textProp, variant = 'free', style }: RibbonProps) {
  const content = label ?? textProp ?? '';
  return (
    <View style={[styles.ribbon, { backgroundColor: VARIANT_COLOR[variant] }, style]}>
      <Text style={styles.label}>{content.toUpperCase()}</Text>
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
    fontWeight: '800',
  },
});
