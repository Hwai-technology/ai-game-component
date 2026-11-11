import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { gradients, palette, shadows, surface } from '@/constants/theme/tokens';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export type IconBadgeFamily = 'purple' | 'teal' | 'orange' | 'gold' | 'pink';

export type IconBadgeProps = {
  icon: IoniconName;
  family?: IconBadgeFamily;
  size?: number;
  style?: ViewStyle;
};

const FAMILIES: Record<
  IconBadgeFamily,
  { gradient: readonly [string, string]; edge: string }
> = {
  purple: { gradient: gradients.purpleButton, edge: palette.purple[700] },
  teal: { gradient: gradients.tealButton, edge: palette.teal[700] },
  orange: { gradient: gradients.orangeButton, edge: palette.orange[600] },
  gold: { gradient: gradients.goldFill, edge: palette.gold[600] },
  pink: { gradient: [palette.pink[400], palette.pink[600]], edge: palette.pink[600] },
};

/**
 * Game-flavored icon tile: gradient squircle with a mini chunky bottom edge —
 * the buttons' DNA shrunk down for list rows (settings, gifts, options).
 */
export default function IconBadge({
  icon,
  family = 'purple',
  size = 42,
  style,
}: IconBadgeProps) {
  const cfg = FAMILIES[family];
  const radius = size * 0.32;

  return (
    <View
      style={[
        styles.shell,
        { borderRadius: radius, backgroundColor: cfg.edge },
        style,
      ]}
    >
      <LinearGradient
        colors={[...cfg.gradient]}
        style={[
          styles.face,
          { width: size, height: size, borderRadius: radius },
        ]}
      >
        <Ionicons name={icon} size={size * 0.5} color={surface.white} />
      </LinearGradient>
    </View>
  );
}

const EDGE = 2.5;

const styles = StyleSheet.create({
  shell: {
    ...shadows.card,
  },
  face: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: EDGE,
  },
});
