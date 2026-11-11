import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { surface } from '@/constants/theme/tokens';

export type ScreenBackgroundProps = {
  /** Optional background artwork illustration (e.g. bg-home / bg-game). If omitted, renders clean gradient only. */
  source?: any;
  /** Wash the illustration with translucent white so foreground UI stays readable */
  soft?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
};

/** Full-screen backdrop — clean gradient for Store/Leaderboard/Settings, artwork image only when source is explicitly passed. */
export default function ScreenBackground({
  source,
  soft = false,
  children,
  style,
}: ScreenBackgroundProps) {
  return (
    <View style={[styles.fill, style]}>
      {/* Primary Clean Gradient Background Base */}
      <LinearGradient colors={[surface.lavender, surface.white]} style={StyleSheet.absoluteFill} />

      {/* High-Performance Cached Artwork Image Layer (Only when source is explicitly provided) */}
      {source && (
        <Image
          source={source}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          cachePolicy="memory-disk"
          priority="high"
        />
      )}

      {/* Soft wash overlay if requested */}
      {soft && <View style={styles.softWash} />}

      {/* Children Content Layer */}
      <View style={styles.fill}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  softWash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});
