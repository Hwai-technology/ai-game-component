import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import {
  palette,
  radius,
  shadows,
  spacing,
  surface,
  text,
  typography,
} from '../theme';

export type SegmentedTabsProps = {
  tabs: string[];
  activeIndex: number;
  onChange: (index: number) => void;
  style?: ViewStyle;
};

/** Pill tab switcher — the active segment is white and raised. */
export default function SegmentedTabs({ tabs, activeIndex, onChange, style }: SegmentedTabsProps) {
  return (
    <View style={[styles.track, style]}>
      {tabs.map((tab, i) => {
        const active = i === activeIndex;
        return (
          <Pressable
            key={tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              if (active) return;
              Haptics.selectionAsync().catch(() => {});
              onChange(i);
            }}
            style={[styles.segment, active && styles.segmentActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
              {tab}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: palette.purple[100],
    borderRadius: radius.pill,
    padding: spacing.xs,
    alignSelf: 'center',
  },
  segment: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: surface.white,
    ...shadows.card,
  },
  label: {
    fontFamily: typography.button.fontFamily,
    fontSize: 14,
    color: text.secondary,
  },
  labelActive: {
    color: palette.purple[500],
  },
});
