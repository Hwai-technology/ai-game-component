import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  chunky,
  motion,
  palette,
  surface,
} from '../theme';
import { SkillButtonProps } from './types';
import { styles } from './styles';
import { formatCooldownDisplay } from './helper';

/**
 * Circular RPG ability button with cooldown radial mask and mana cost pill.
 */
export default function SkillButton({
  iconName,
  cooldownSeconds = 0,
  manaCost,
  disabled = false,
  size = 60,
  color = palette.teal[500],
  onPress,
  style,
}: SkillButtonProps) {
  const pressed = useSharedValue(0);
  const isOnCooldown = cooldownSeconds > 0;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * (1 - motion.pressScale) }],
  }));

  const handlePressIn = () => {
    if (disabled || isOnCooldown) return;
    pressed.value = withTiming(1, { duration: chunky.pressDurationMs });
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: chunky.pressDurationMs });
  };

  return (
    <Animated.View style={[animStyle, style]}>
      <Pressable
        style={[
          styles.button,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          (disabled || isOnCooldown) && styles.disabledButton,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={!disabled && !isOnCooldown ? onPress : undefined}
      >
        <Ionicons name={iconName} size={size * 0.45} color={surface.white} />

        {/* Cooldown Overlay */}
        {isOnCooldown && (
          <View style={[styles.cooldownOverlay, { borderRadius: size / 2 }]}>
            <Text style={styles.cooldownText}>
              {formatCooldownDisplay(cooldownSeconds)}
            </Text>
          </View>
        )}

        {/* Mana Cost Badge */}
        {manaCost != null && !isOnCooldown && (
          <View style={styles.manaBadge}>
            <Text style={styles.manaText}>{manaCost}</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export * from './types';
export * from './helper';
