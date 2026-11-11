import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  gradients,
  palette,
  radius,
  shadows,
  spacing,
  surface,
  text,
  typography,
} from '../theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export type GameTabItem = {
  key: string;
  icon: IoniconName;
  label: string;
};

export type GameTabBarProps = {
  /** Regular tabs in display order; the center FAB is injected in the middle */
  items: GameTabItem[];
  /** The raised center action (Scan) */
  center: GameTabItem;
  activeKey: string;
  onPress: (key: string) => void;
  style?: ViewStyle;
};

/** Floating white tab bar with a raised orange center FAB. */
export default function GameTabBar({ items, center, activeKey, onPress, style }: GameTabBarProps) {
  const insets = useSafeAreaInsets();
  const half = Math.ceil(items.length / 2);
  const left = items.slice(0, half);
  const right = items.slice(half);

  const handlePress = (key: string) => {
    if (key !== activeKey) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress(key);
  };

  return (
    <View
      style={[styles.bar, { paddingBottom: Math.max(insets.bottom, spacing.md) }, style]}
    >
      {left.map((item) => (
        <Tab key={item.key} item={item} active={item.key === activeKey} onPress={handlePress} />
      ))}
      <CenterFab item={center} active={center.key === activeKey} onPress={handlePress} />
      {right.map((item) => (
        <Tab key={item.key} item={item} active={item.key === activeKey} onPress={handlePress} />
      ))}
    </View>
  );
}

function Tab({
  item,
  active,
  onPress,
}: {
  item: GameTabItem;
  active: boolean;
  onPress: (key: string) => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={() => onPress(item.key)}
      style={styles.tab}
    >
      <Ionicons
        name={item.icon}
        size={24}
        color={active ? palette.teal[500] : text.muted}
      />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {item.label.toUpperCase()}
      </Text>
      {active && <View style={styles.activeDot} />}
    </Pressable>
  );
}

function CenterFab({
  item,
  active,
  onPress,
}: {
  item: GameTabItem;
  active: boolean;
  onPress: (key: string) => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={() => onPress(item.key)}
      style={styles.fabSlot}
    >
      <View style={styles.fabRing}>
        <LinearGradient colors={[...gradients.orangeButton]} style={styles.fab}>
          <Ionicons name={item.icon} size={28} color={surface.white} />
        </LinearGradient>
      </View>
      <Text style={styles.fabLabel}>{item.label.toUpperCase()}</Text>
    </Pressable>
  );
}

const FAB_SIZE = 58;

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: surface.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.sm,
    ...shadows.fab,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tabLabel: {
    fontFamily: typography.button.fontFamily,
    fontSize: 10,
    letterSpacing: 0.4,
    color: text.muted,
  },
  tabLabelActive: {
    color: palette.teal[500],
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.teal[500],
  },
  fabSlot: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  fabRing: {
    marginTop: -(FAB_SIZE / 2 + spacing.md),
    padding: 4,
    borderRadius: radius.pill,
    backgroundColor: surface.white,
    ...shadows.fab,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabLabel: {
    fontFamily: typography.button.fontFamily,
    fontSize: 10,
    letterSpacing: 0.4,
    color: palette.orange[500],
  },
});
