import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { palette, radius, surface, text } from '../theme';

const TRACK_WIDTH = 54;
const TRACK_HEIGHT = 32;
const KNOB_SIZE = 26;
const KNOB_TRAVEL = TRACK_WIDTH - KNOB_SIZE - 6;

export type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
};

/** Thick game-style switch — on = teal, off = grey. */
export default function Toggle({ value, onValueChange, disabled = false, style }: ToggleProps) {
  const anim = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    anim.value = withTiming(value ? 1 : 0, { duration: 160 });
  }, [value, anim]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(anim.value, [0, 1], [text.muted, palette.teal[500]]),
  }));

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: anim.value * KNOB_TRAVEL }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onValueChange(!value);
      }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[disabled && styles.disabled, style]}
    >
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.knob, knobStyle]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: radius.pill,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: surface.white,
    shadowColor: text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
