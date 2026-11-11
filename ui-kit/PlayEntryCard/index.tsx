import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

import {
  palette,
  radius,
  spacing,
  surface,
  text,
  typography,
} from '../theme';
import { useLanguage } from '@/hooks/useLanguage';
import GameButton from '../GameButton';
import GameCard from '../GameCard';
import StarCoin from '../StarCoin';

export type PlayEntryCardProps = {
  /** Coins required to start a round */
  entryFee: number;
  /** Reward multiplier of the selected hero/run */
  multiplier: number;
  /** Player's current balance — decides the ready / not-enough state */
  balance: number;
  onPlay: () => void;
  /** Opens the top-up flow when the balance is short */
  onTopUp?: () => void;
  /** Render without the white card wrapper — the button sits directly on the
      world art and the entry info lives in a white pill (reference layout) */
  bare?: boolean;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
};

/**
 * The PLAY GAME action with its entry info line ("Entry 100 · Rewards ×1").
 * Feature preserved from the current app — not present in the mockups.
 */
export default function PlayEntryCard({
  entryFee,
  multiplier,
  balance,
  onPlay,
  onTopUp,
  bare = false,
  style,
  disabled = false,
  loading = false,
}: PlayEntryCardProps) {
  const { t } = useLanguage();
  const shortBy = entryFee - balance;
  const canPlay = shortBy <= 0;

  const content = (
    <>
      <GameButton
        title={loading ? t('preparing') : t('playGame')}
        icon={loading ? undefined : 'game-controller'}
        variant="secondary"
        size="lg"
        fullWidth
        disabled={!canPlay || disabled || loading}
        onPress={onPlay}
      />
      {canPlay ? (
        <View style={[styles.infoRow, bare && styles.infoChip]}>
          <Text style={styles.infoLabel}>{t('entry')}</Text>
          <StarCoin size={18} />
          <Text style={styles.infoValue}>{entryFee}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.infoLabel}>{t('rewards')}</Text>
          <View style={styles.multiplierPill}>
            <Text style={styles.multiplierText}>{multiplier}x</Text>
          </View>
        </View>
      ) : (
        <View style={[styles.infoRow, bare && styles.infoChip]}>
          <Text style={styles.needText}>
            {t('needMoreCoinsForEntry', { amount: shortBy })}
          </Text>
          <StarCoin size={18} />
          {onTopUp && (
            <Pressable accessibilityRole="button" onPress={onTopUp} style={styles.topUpButton} hitSlop={8}>
              <Text style={styles.topUpPlus}>+</Text>
            </Pressable>
          )}
        </View>
      )}
    </>
  );

  if (bare) {
    return <View style={StyleSheet.flatten([styles.bareWrap, style])}>{content}</View>;
  }

  return <GameCard style={StyleSheet.flatten([styles.card, style])}>{content}</GameCard>;
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  bareWrap: {
    gap: spacing.md,
    alignItems: 'center',
  },
  infoChip: {
    backgroundColor: surface.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 2,
  },
  infoLabel: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: text.secondary,
  },
  infoValue: {
    ...typography.body,
    fontFamily: typography.button.fontFamily,
    color: text.primary,
  },
  dot: {
    ...typography.body,
    color: text.muted,
    marginHorizontal: spacing.xs,
  },
  multiplierPill: {
    backgroundColor: palette.gold[100],
    borderWidth: 1.5,
    borderColor: palette.gold[500],
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 1,
  },
  multiplierText: {
    fontFamily: typography.button.fontFamily,
    fontSize: 13,
    color: palette.gold[600],
  },
  needText: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: palette.red[500],
  },
  topUpButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: palette.teal[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  topUpPlus: {
    fontFamily: typography.button.fontFamily,
    fontSize: 16,
    color: surface.white,
    lineHeight: 20,
  },
});
