import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { palette } from '../theme';
import IconButton from '../IconButton';
import { CoinChip, LivesChip, ScoreBadge } from '../StatBadge';
import { GameHUDProps } from './types';
import { styles } from './styles';
import { formatTimerValue } from './helper';

/**
 * Universal Game HUD docked at the top of gameplay screens.
 * Suitable for Runners, Puzzles, Match-3, Platformers, and Arcade games.
 */
export default function GameHUD({
  score,
  lives,
  coins,
  level,
  timeRemaining,
  onPause,
  onSettings,
  style,
}: GameHUDProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Left section: Lives and Level */}
      <View style={styles.leftRow}>
        {lives != null && <LivesChip count={lives} />}
        {level != null && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelLabel}>LVL</Text>
            <Text style={styles.levelValue}>{level}</Text>
          </View>
        )}
      </View>

      {/* Center section: Score or Timer */}
      <View style={styles.centerCol}>
        {score != null && <ScoreBadge score={score} />}
        {timeRemaining != null && (
          <View style={styles.timerBadge}>
            <Ionicons name="time-outline" size={14} color={palette.orange[500]} />
            <Text style={styles.timerText}>{formatTimerValue(timeRemaining)}</Text>
          </View>
        )}
      </View>

      {/* Right section: Coins and Action buttons */}
      <View style={styles.rightRow}>
        {coins != null && <CoinChip value={coins} />}
        {onSettings && (
          <IconButton
            icon="settings-outline"
            size={38}
            onPress={onSettings}
            iconColor={palette.purple[700]}
          />
        )}
        {onPause && (
          <IconButton
            icon="pause"
            size={38}
            onPress={onPause}
            iconColor={palette.purple[700]}
          />
        )}
      </View>
    </View>
  );
}

export * from './types';
export * from './helper';
