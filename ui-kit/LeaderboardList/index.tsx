import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { palette, surface } from '../theme';
import { LeaderboardListProps } from './types';
import { styles } from './styles';
import { getRankBadgeColor } from './helper';

/**
 * Universal game leaderboard rankings table.
 */
export default function LeaderboardList({
  entries,
  style,
}: LeaderboardListProps) {
  const renderRank = (rank: number) => {
    const medalColor = getRankBadgeColor(rank);
    if (medalColor) {
      return (
        <View style={[styles.rankMedal, { backgroundColor: medalColor }]}>
          <Text style={styles.medalText}>{rank}</Text>
        </View>
      );
    }
    return (
      <View style={styles.rankNumBox}>
        <Text style={styles.rankNumText}>#{rank}</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {entries.map((entry) => (
        <View
          key={entry.playerId}
          style={[
            styles.row,
            entry.isCurrentPlayer && styles.selfRow,
          ]}
        >
          <View style={styles.leftCol}>
            {renderRank(entry.rank)}
            <View style={styles.avatar}>
              <Ionicons
                name={entry.avatarIcon ?? 'person'}
                size={18}
                color={entry.isCurrentPlayer ? surface.white : palette.purple[500]}
              />
            </View>
            <Text
              style={[
                styles.nameText,
                entry.isCurrentPlayer && styles.selfText,
              ]}
              numberOfLines={1}
            >
              {entry.name}
            </Text>
          </View>

          <Text
            style={[
              styles.scoreText,
              entry.isCurrentPlayer && styles.selfScore,
            ]}
          >
            {entry.score.toLocaleString()}
          </Text>
        </View>
      ))}
    </View>
  );
}

export * from './types';
export * from './helper';
