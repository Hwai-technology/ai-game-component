import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { palette } from '../theme';
import { VirtualJoystickProps } from './types';
import { styles } from './styles';
import { clampJoystickOffset } from './helper';

/**
 * On-screen virtual joystick base & knob for mobile arcade & action games.
 */
export default function VirtualJoystick({
  size = 120,
  stickPosition = { x: 0, y: 0 },
  disabled = false,
  style,
}: VirtualJoystickProps) {
  const baseRadius = size / 2;
  const knobSize = size * 0.45;
  const clamped = clampJoystickOffset(stickPosition, baseRadius - knobSize / 2);

  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: baseRadius,
        },
        disabled && styles.disabled,
        style,
      ]}
    >
      {/* Direction indicators */}
      <View style={styles.arrowNorth}>
        <Ionicons name="caret-up" size={12} color={palette.purple[300]} />
      </View>
      <View style={styles.arrowSouth}>
        <Ionicons name="caret-down" size={12} color={palette.purple[300]} />
      </View>
      <View style={styles.arrowWest}>
        <Ionicons name="caret-back" size={12} color={palette.purple[300]} />
      </View>
      <View style={styles.arrowEast}>
        <Ionicons name="caret-forward" size={12} color={palette.purple[300]} />
      </View>

      {/* Center Thumbstick Knob */}
      <View
        style={[
          styles.knob,
          {
            width: knobSize,
            height: knobSize,
            borderRadius: knobSize / 2,
            transform: [
              { translateX: clamped.x },
              { translateY: clamped.y },
            ],
          },
        ]}
      >
        <View style={styles.knobInner} />
      </View>
    </View>
  );
}

export * from './types';
export * from './helper';
