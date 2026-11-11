import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { spacing, surface } from '@/constants/theme/tokens';

export type LoadingDotsProps = {
  count?: number;
  size?: number;
  color?: string;
  style?: ViewStyle;
};

/** Pulsing loading dots (the splash spinner). */
export default function LoadingDots({
  count = 3,
  size = 12,
  color = surface.white,
  style,
}: LoadingDotsProps) {
  return (
    <View style={[styles.row, style]}>
      {Array.from({ length: count }, (_, i) => (
        <Dot key={i} index={i} size={size} color={color} />
      ))}
    </View>
  );
}

function Dot({ index, size, color }: { index: number; size: number; color: string }) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withDelay(
      index * 180,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 360 }),
          withTiming(0, { duration: 360 }),
        ),
        -1,
      ),
    );
  }, [index, pulse]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.65,
    transform: [{ scale: 0.75 + pulse.value * 0.35 }],
  }));

  return (
    <Animated.View
      style={[
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        animStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
