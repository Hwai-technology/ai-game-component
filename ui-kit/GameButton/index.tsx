import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {
  chunky,
  disabledTint,
  gradients,
  palette,
  radius,
  shadows,
  spacing,
  surface,
  text,
  typography,
} from '@/constants/theme/tokens';

import { useLanguage } from '@/hooks/useLanguage';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export type GameButtonVariant = 'primary' | 'secondary' | 'success' | 'ghost';
export type GameButtonSize = 'lg' | 'md' | 'sm';

export type GameButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: GameButtonVariant;
  size?: GameButtonSize;
  /** Second line under the title — lg size only */
  subtitle?: string;
  icon?: IoniconName;
  /** Trailing chevron (the "OPEN GIFT ›" pill) */
  arrow?: boolean;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  haptics?: boolean;
  style?: ViewStyle;
};

const VARIANTS: Record<
  GameButtonVariant,
  {
    gradient: readonly [string, string];
    edge: string;
    label: string;
    shadowColor: string;
    disabledFill: string;
    disabledLabel: string;
    faceBorder?: string;
  }
> = {
  primary: {
    gradient: gradients.purpleButton,
    edge: palette.purple[700],
    label: text.onDark,
    shadowColor: palette.purple[500],
    disabledFill: disabledTint.purple,
    disabledLabel: 'rgba(255,255,255,0.85)',
  },
  secondary: {
    gradient: gradients.orangeButton,
    edge: palette.orange[600],
    label: text.onDark,
    shadowColor: palette.orange[500],
    disabledFill: disabledTint.orange,
    disabledLabel: 'rgba(255,255,255,0.95)',
  },
  success: {
    gradient: gradients.tealButton,
    edge: palette.teal[700],
    label: text.onDark,
    shadowColor: palette.teal[500],
    disabledFill: disabledTint.teal,
    disabledLabel: 'rgba(255,255,255,0.9)',
  },
  ghost: {
    gradient: [surface.white, surface.white],
    edge: palette.lavenderGrey[200],
    label: palette.purple[500],
    shadowColor: palette.lavenderGrey[400],
    disabledFill: surface.white,
    disabledLabel: disabledTint.ghostText,
    faceBorder: palette.purple[100],
  },
};

const SIZES: Record<
  GameButtonSize,
  { height: number; edge: number; radius: number; paddingH: number; font: number; icon: number }
> = {
  lg: { height: 64, edge: chunky.edge.lg, radius: radius.lg, paddingH: spacing.xl, font: typography.button.fontSize, icon: 26 },
  md: { height: 52, edge: chunky.edge.md, radius: radius.lg, paddingH: spacing.xl, font: typography.button.fontSize, icon: 22 },
  sm: { height: 38, edge: chunky.edge.sm, radius: radius.pill, paddingH: spacing.lg, font: typography.buttonSmall.fontSize, icon: 16 },
};

/**
 * The Chunky-3D game button: gradient face sitting on a solid darker bottom
 * edge; pressing sinks the face into the edge (the game's core tactile feel).
 */
export default function GameButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  subtitle,
  icon,
  arrow = false,
  disabled = false,
  loading = false,
  fullWidth = false,
  haptics = true,
  style,
}: GameButtonProps) {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';
  const cfg = VARIANTS[variant];
  const dims = SIZES[size];
  const pressed = useSharedValue(0);

  const faceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressed.value * chunky.pressTravel }],
  }));

  const handlePressIn = () => {
    pressed.value = withTiming(1, { duration: chunky.pressDurationMs });
    if (haptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };
  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: chunky.pressDurationMs });
  };

  const labelColor = disabled ? cfg.disabledLabel : cfg.label;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[fullWidth && styles.fullWidth, style]}
    >
      <View style={{ height: dims.height + (disabled ? 0 : dims.edge) }}>
        {!disabled && (
          <View
            style={[
              styles.edgeLayer,
              {
                height: dims.height,
                borderRadius: dims.radius,
                backgroundColor: cfg.edge,
              },
              shadows.button(cfg.shadowColor),
            ]}
          />
        )}
        <Animated.View style={!disabled && faceStyle}>
          <LinearGradient
            colors={disabled ? [cfg.disabledFill, cfg.disabledFill] : [...cfg.gradient]}
            style={[
              styles.face,
              {
                flexDirection: isRTL ? 'row-reverse' : 'row',
                height: dims.height,
                borderRadius: dims.radius,
                paddingHorizontal: dims.paddingH,
              },
              cfg.faceBorder && !disabled && { borderWidth: 2, borderColor: cfg.faceBorder },
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color={labelColor} />
            ) : (
              icon && <Ionicons name={icon} size={dims.icon} color={labelColor} style={styles.icon} />
            )}
            <View style={styles.labels}>
              <Text
                numberOfLines={1}
                style={[styles.title, { fontSize: dims.font, color: labelColor }]}
              >
                {isRTL ? title : title.toUpperCase()}
              </Text>
              {subtitle != null && size === 'lg' && (
                <Text numberOfLines={1} style={[styles.subtitle, { color: labelColor }]}>
                  {subtitle}
                </Text>
              )}
            </View>
            {arrow && (
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={dims.icon} color={labelColor} style={styles.arrow} />
            )}
          </LinearGradient>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fullWidth: {
    alignSelf: 'stretch',
  },
  edgeLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  face: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  icon: {},
  labels: {
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.button.fontFamily,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 12,
    opacity: 0.85,
    marginTop: -2,
  },
  arrow: {},
});
