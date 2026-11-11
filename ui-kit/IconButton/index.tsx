import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  chunky,
  motion,
  palette,
  radius,
  shadows,
  surface,
  text,
  typography,
} from '../theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export type IconButtonProps = {
  icon: IoniconName;
  onPress?: () => void;
  /** Red notification dot; pass a number to show a count inside it */
  badge?: boolean | number;
  size?: number;
  iconColor?: string;
  backgroundColor?: string;
  disabled?: boolean;
  style?: ViewStyle;
};

/** Round white icon button with a soft shadow and an optional red badge. */
export default function IconButton({
  icon,
  onPress,
  badge = false,
  size = 44,
  iconColor = palette.purple[500],
  backgroundColor = surface.white,
  disabled = false,
  style,
}: IconButtonProps) {
  const pressed = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * (1 - motion.pressScale) }],
  }));

  const showCount = typeof badge === 'number';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: chunky.pressDurationMs });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: chunky.pressDurationMs });
      }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={style}
    >
      <Animated.View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2, backgroundColor },
          disabled && styles.disabled,
          animStyle,
        ]}
      >
        <Ionicons name={icon} size={size * 0.5} color={disabled ? text.muted : iconColor} />
        {badge !== false && badge !== 0 && (
          <View style={[styles.badge, showCount && styles.badgeCount]}>
            {showCount && <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  disabled: {
    opacity: 0.5,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: radius.pill,
    backgroundColor: palette.red[500],
    borderWidth: 1.5,
    borderColor: surface.white,
  },
  badgeCount: {
    width: 18,
    height: 18,
    top: -2,
    right: -2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: typography.button.fontFamily,
    fontSize: 10,
    color: text.onDark,
  },
});
