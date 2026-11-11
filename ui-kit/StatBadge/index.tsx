import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import {
  gradients,
  palette,
  radius,
  shadows,
  spacing,
  surface,
  text,
  typography,
} from '../theme';
import { useLanguage } from '@/hooks';
import StarCoin from '../StarCoin';

const formatNumber = (n: number) => n.toLocaleString('en-US');

// ---------------------------------------------------------------------------
// CoinChip — white pill · star-coin · balance · optional "+" top-up button
// ---------------------------------------------------------------------------

export type CoinChipProps = {
  value: number;
  onAdd?: () => void;
  style?: ViewStyle;
};

export function CoinChip({ value, onAdd, style }: CoinChipProps) {
  return (
    <View style={[styles.pill, style]}>
      <StarCoin size={24} />
      <Text style={styles.pillNumber}>{formatNumber(value)}</Text>
      {onAdd && (
        <Pressable accessibilityRole="button" onPress={onAdd} style={styles.addButton} hitSlop={8}>
          <Ionicons name="add" size={16} color={surface.white} />
        </Pressable>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// LivesChip — white pill with hearts
// ---------------------------------------------------------------------------

export type LivesChipProps = {
  current: number;
  max?: number;
  style?: ViewStyle;
};

export function LivesChip({ current, style }: LivesChipProps) {
  return (
    <View style={[styles.pill, style]}>
      <Ionicons
        name="heart"
        size={22}
        color={current > 0 ? palette.red[500] : text.muted}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// ScoreBadge — dark purple badge · trophy · score · "Best: X"
// ---------------------------------------------------------------------------

export type ScoreBadgeProps = {
  score: number;
  best?: number;
  style?: ViewStyle;
};

export function ScoreBadge({ score, best, style }: ScoreBadgeProps) {
  const { t } = useLanguage();
  return (
    <LinearGradient colors={[...gradients.hudBadge]} style={[styles.darkBadge, style]}>
      <StarCoin size={20} />
      <View style={styles.scoreColumn}>
        <Text style={styles.scoreNumber}>{formatNumber(score)}</Text>
        {best != null && <Text style={styles.scoreBest}>{t('best') || 'Best'}: {formatNumber(best)}</Text>}
      </View>
    </LinearGradient>
  );
}

// ---------------------------------------------------------------------------
// LevelPill — dark purple pill · star · "Level N" · inner gold progress
// ---------------------------------------------------------------------------

export type LevelPillProps = {
  level: number;
  /** 0 → 1 progress toward the next level */
  progress: number;
  label?: string;
  style?: ViewStyle;
};

export function LevelPill({ level, progress, label, style }: LevelPillProps) {
  const { t } = useLanguage();
  const displayLabel = label || t('level') || 'Level';
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    <LinearGradient colors={[...gradients.hudBadge]} style={[styles.levelPill, style]}>
      <Ionicons name="star" size={16} color={palette.gold[500]} />
      <Text style={styles.levelText}>
        {displayLabel} {level}
      </Text>
      <View style={styles.levelTrack}>
        <LinearGradient
          colors={[...gradients.goldFill]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.levelFill, { width: `${clamped * 100}%` }]}
        />
      </View>
    </LinearGradient>
  );
}

// ---------------------------------------------------------------------------
// CoinEarnedChip — white pill · star-coin · coins earned this round
// ---------------------------------------------------------------------------

export type CoinEarnedChipProps = {
  value: number;
  style?: ViewStyle;
};

export function CoinEarnedChip({ value, style }: CoinEarnedChipProps) {
  return (
    <View style={[styles.pill, style]}>
      <StarCoin size={22} />
      <Text style={styles.pillNumber}>{formatNumber(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: surface.white,
    borderRadius: radius.pill,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  pillNumber: {
    ...typography.hudNumber,
    color: text.primary,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: palette.teal[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartGap: {
    marginLeft: 2,
  },
  darkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  scoreColumn: {
    alignItems: 'flex-start',
  },
  scoreNumber: {
    ...typography.hudNumber,
    color: text.onDark,
    lineHeight: 20,
  },
  scoreBest: {
    fontFamily: typography.caption.fontFamily,
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  levelPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    ...shadows.card,
  },
  levelText: {
    fontFamily: typography.button.fontFamily,
    fontSize: 14,
    color: text.onDark,
  },
  levelTrack: {
    width: 64,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.purple[900],
    overflow: 'hidden',
  },
  levelFill: {
    height: '100%',
    borderRadius: 5,
  },
});
