import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import {
  palette,
  radius,
  spacing,
  surface,
  text,
  typography,
} from '../theme';
import { useLanguage } from '@/hooks';
import GameCard from '../GameCard';
import StarCoin from '../StarCoin';

export type ProfileStatsCardProps = {
  name: string;
  playerId: string | number;
  coins: number;
  charactersUnlocked: number;
  /** Player's selected hero image (replaces the old initial-letter avatar) */
  avatar?: React.ReactNode;
  style?: ViewStyle;
};

/** Profile summary card: hero avatar, name, ID, and the two key stats. */
export default function ProfileStatsCard({
  name,
  playerId,
  coins,
  charactersUnlocked,
  avatar,
  style,
}: ProfileStatsCardProps) {
  const { t } = useLanguage();
  return (
    <GameCard radiusSize="xl" style={StyleSheet.flatten([styles.card, style])}>
      <View style={styles.avatarRing}>
        {avatar ?? (
          <View style={styles.avatarFallback}>
            <Ionicons name="happy" size={34} color={palette.purple[300]} />
          </View>
        )}
      </View>
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
      <Text style={styles.playerId} numberOfLines={1} ellipsizeMode="tail">ID: {playerId}</Text>
      <View style={styles.statsRow}>
        <View style={[styles.statTile, { backgroundColor: palette.gold[100] }]}>
          <StarCoin size={20} />
          <Text style={styles.statValue}>{coins.toLocaleString('en-US')}</Text>
          <Text style={styles.statLabel}>{t('coinsLabel') || 'Star-Coins'}</Text>
        </View>
        <View style={[styles.statTile, { backgroundColor: palette.purple[100] }]}>
          <Ionicons name="people" size={20} color={palette.purple[500]} />
          <Text style={styles.statValue}>{charactersUnlocked}</Text>
          <Text style={styles.statLabel}>{t('charactersUnlockedLabel') || 'Characters'}</Text>
        </View>
      </View>
    </GameCard>
  );
}

const AVATAR_SIZE = 76;

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: palette.teal[300],
    backgroundColor: surface.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarFallback: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: palette.purple[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.heading,
    fontFamily: typography.title.fontFamily,
    color: text.primary,
    marginTop: spacing.sm,
  },
  playerId: {
    ...typography.caption,
    color: text.secondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
  statTile: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    ...typography.hudNumber,
    color: text.primary,
  },
  statLabel: {
    ...typography.caption,
    fontSize: 11,
    color: text.secondary,
  },
});
