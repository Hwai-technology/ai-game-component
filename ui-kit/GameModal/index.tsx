import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import {
  gradients,
  palette,
  radius,
  shadows,
  spacing,
  text,
  typography,
} from '@/constants/theme/tokens';
import IconButton from '../IconButton';
import { CoinChip } from '../StatBadge';

export type GameModalProps = {
  title: string;
  children: React.ReactNode;
  /** Coin balance chip in the top-left corner */
  coins?: number;
  onClose?: () => void;
  /** Footer slot — typically a success GameButton */
  footer?: React.ReactNode;
  style?: ViewStyle;
  disableEntering?: boolean;
};

/**
 * The deep-purple night panel used for rewards and gift flows.
 * Works inline inside a route (lucky-gift) or wrapped in an RN <Modal>.
 */
export default function GameModal({
  title,
  children,
  coins,
  onClose,
  footer,
  style,
  disableEntering = false,
}: GameModalProps) {
  const panelContent = (
    <LinearGradient colors={[...gradients.rewardModal]} style={styles.panel}>
      <Sparkles />
      <View style={styles.topRow}>
        {coins != null ? <CoinChip value={coins} /> : <View />}
        {onClose && (
          <IconButton icon="close" size={36} onPress={onClose} iconColor={palette.purple[500]} />
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.content}>{children}</View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </LinearGradient>
  );

  if (disableEntering) {
    return <View style={[styles.wrapper, style]}>{panelContent}</View>;
  }

  return (
    <Animated.View entering={ZoomIn.springify().damping(14)} style={[styles.wrapper, style]}>
      {panelContent}
    </Animated.View>
  );
}

/** Tiny star specks scattered over the panel (asset `sparkles` replaces this in Phase 3). */
function Sparkles() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {SPARKLE_SPOTS.map(({ top, left, size }, i) => (
        <View
          key={i}
          style={[
            styles.sparkle,
            { top: `${top}%`, left: `${left}%`, width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ))}
    </View>
  );
}

const SPARKLE_SPOTS = [
  { top: 12, left: 12, size: 5 },
  { top: 8, left: 78, size: 4 },
  { top: 30, left: 90, size: 3 },
  { top: 45, left: 6, size: 4 },
  { top: 70, left: 88, size: 5 },
  { top: 85, left: 14, size: 3 },
  { top: 22, left: 45, size: 3 },
];

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.xl,
    ...shadows.button(palette.purple[900]),
  },
  panel: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    color: text.onDark,
    textAlign: 'center',
    ...shadows.text,
    marginBottom: spacing.lg,
  },
  content: {
    alignItems: 'center',
    gap: spacing.md,
  },
  footer: {
    marginTop: spacing.xl,
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
});
