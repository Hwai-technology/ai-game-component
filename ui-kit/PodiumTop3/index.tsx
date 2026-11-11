import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import {
  gradients,
  palette,
  radius,
  spacing,
  surface,
  text,
  typography,
} from '../theme';
import { useLanguage } from '@/hooks';
import StarCoin from '../StarCoin';

export type PodiumPlayer = {
  name: string;
  coins: number;
  /** Small grey line under the name (e.g. "ID: 704792") */
  subtitle?: string;
  /** Unlocked-characters count — second stat next to coins */
  characters?: number;
  /** Player's hero image; falls back to a tinted circle */
  avatar?: React.ReactNode;
  isYou?: boolean;
};

export type PodiumTop3Props = {
  /** Players ordered by rank: [first, second, third] */
  players: [PodiumPlayer, PodiumPlayer?, PodiumPlayer?];
  style?: ViewStyle;
};

const RANK = {
  1: { stand: 84, ring: palette.gold[500], gradient: gradients.goldFill },
  2: { stand: 62, ring: palette.lavenderGrey[400], gradient: [palette.lavenderGrey[200], palette.lavenderGrey[400]] as const },
  3: { stand: 50, ring: palette.orange[600], gradient: gradients.orangeButton },
} as const;

/**
 * Leaderboard top-3 podium — kept from the current app (more "game" than a
 * flat list), restyled with gold/silver/bronze stands and a crown on #1.
 */
export default function PodiumTop3({ players, style }: PodiumTop3Props) {
  const [first, second, third] = players;
  return (
    <View style={[styles.row, style]}>
      {second && <PodiumColumn player={second} rank={2} />}
      <PodiumColumn player={first} rank={1} />
      {third && <PodiumColumn player={third} rank={3} />}
    </View>
  );
}

function PodiumColumn({ player, rank }: { player: PodiumPlayer; rank: 1 | 2 | 3 }) {
  const cfg = RANK[rank];
  const { t, isRTL } = useLanguage();
  return (
    <View style={styles.column}>
      {rank === 1 && <Ionicons name="trophy" size={24} color={palette.gold[500]} style={styles.crown} />}
      <View style={[styles.avatarRing, { borderColor: cfg.ring }]}>
        {player.avatar ?? (
          <View style={styles.avatarFallback}>
            <Ionicons name="happy" size={26} color={palette.purple[300]} />
          </View>
        )}
      </View>
      <View style={[styles.nameRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Text numberOfLines={1} style={[styles.name, { textAlign: isRTL ? 'right' : 'left' }]}>
          {player.name}
        </Text>
        {player.isYou && (
          <View style={styles.youBadge}>
            <Text style={styles.youText}>{t('you') || 'YOU'}</Text>
          </View>
        )}
      </View>
      {player.subtitle != null && (
        <Text numberOfLines={1} style={[styles.subtitle, { textAlign: 'center' }]}>
          {player.subtitle}
        </Text>
      )}
      <View style={[styles.coinsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <StarCoin size={14} />
        <Text style={styles.coins}>{player.coins.toLocaleString('en-US')}</Text>
        {player.characters != null && (
          <>
            <Ionicons name="people" size={13} color={palette.teal[500]} />
            <Text style={[styles.coins, { color: palette.teal[500] }]}>{player.characters}</Text>
          </>
        )}
      </View>
      <LinearGradient colors={[...cfg.gradient]} style={[styles.stand, { height: cfg.stand }]}>
        <Text style={styles.standNumber}>{rank}</Text>
      </LinearGradient>
    </View>
  );
}

const AVATAR_SIZE = 62;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  column: {
    alignItems: 'center',
    width: 96,
    gap: spacing.xs,
  },
  crown: {
    marginBottom: -2,
  },
  avatarRing: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 12,
    borderWidth: 2.5,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 2,
  },
  avatarFallback: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: palette.purple[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    maxWidth: '100%',
  },
  name: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: text.primary,
    flexShrink: 1,
  },
  youBadge: {
    backgroundColor: palette.gold[500],
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 1,
  },
  youText: {
    fontFamily: typography.button.fontFamily,
    fontSize: 9,
    color: text.primary,
  },
  subtitle: {
    fontSize: 9,
    fontFamily: typography.caption.fontFamily,
    color: text.muted,
  },
  coinsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  coins: {
    ...typography.caption,
    fontFamily: typography.button.fontFamily,
    color: text.secondary,
  },
  stand: {
    alignSelf: 'stretch',
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  standNumber: {
    ...typography.title,
    color: surface.white,
  },
});
