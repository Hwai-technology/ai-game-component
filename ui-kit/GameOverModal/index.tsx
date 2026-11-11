import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { palette } from '../theme';
import GameButton from '../GameButton';
import GameModal from '../GameModal';
import { GameOverModalProps } from './types';
import { styles } from './styles';

/**
 * Game Over / Defeat dialog with revive options and retry actions.
 */
export default function GameOverModal({
  score,
  highScore,
  reviveCostGems,
  onRetry,
  onRevive,
  onHome,
  style,
}: GameOverModalProps) {
  return (
    <GameModal
      title="GAME OVER"
      style={style}
      footer={
        <View style={styles.footerCol}>
          {onRevive && (
            <GameButton
              title={reviveCostGems ? `REVIVE (${reviveCostGems} 💎)` : 'REVIVE'}
              variant="secondary"
              size="lg"
              icon="heart"
              fullWidth
              onPress={onRevive}
            />
          )}
          <GameButton
            title="TRY AGAIN"
            variant="primary"
            size="lg"
            icon="refresh"
            fullWidth
            onPress={onRetry}
          />
          {onHome && (
            <GameButton
              title="HOME"
              variant="ghost"
              size="sm"
              icon="home-outline"
              fullWidth
              onPress={onHome}
            />
          )}
        </View>
      }
    >
      <View style={styles.container}>
        <View style={styles.iconEmblem}>
          <Ionicons name="heart-dislike" size={48} color={palette.red[500]} />
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>FINAL SCORE</Text>
          <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>

          {highScore != null && (
            <View style={styles.bestRow}>
              <Text style={styles.bestLabel}>HIGH SCORE:</Text>
              <Text style={styles.bestValue}>{highScore.toLocaleString()}</Text>
            </View>
          )}
        </View>
      </View>
    </GameModal>
  );
}

export * from './types';
export * from './helper';
