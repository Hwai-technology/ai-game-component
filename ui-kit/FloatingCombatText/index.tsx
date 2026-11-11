import React from 'react';
import { Text } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { FloatingCombatTextProps } from './types';
import { styles } from './styles';
import { getCombatTextColor } from './helper';

/**
 * Animated floating popup text for hits, combos, and level up moments.
 */
export default function FloatingCombatText({
  text: label,
  type = 'damage',
  style,
}: FloatingCombatTextProps) {
  const textColor = getCombatTextColor(type);

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(400)}
      style={[styles.container, style]}
    >
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </Animated.View>
  );
}

export * from './types';
export * from './helper';
