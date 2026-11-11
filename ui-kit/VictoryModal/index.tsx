import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { palette } from '../theme';
import GameButton from '../GameButton';
import GameModal from '../GameModal';
import Ribbon from '../Ribbon';
import { CoinEarnedChip } from '../StatBadge';
import { VictoryModalProps } from './types';
import { styles } from './styles';
import { clampStars, getVictoryMessage } from './helper';

/**
 * Celebration modal shown upon completing a level or winning a match.
 * Includes star rating, score counters, rewards, and action buttons.
 */
export default function VictoryModal({
  stars = 3,
  score,
  highScore,
  coinsEarned = 0,
  isNewHighScore = false,
  onNextLevel,
  onReplay,
  onHome,
  style,
}: VictoryModalProps) {
  const activeStars = clampStars(stars);
  const celebrationTitle = getVictoryMessage(activeStars);

  return (
    <GameModal
      title={celebrationTitle}
      style={style}
      footer={
        <View style={styles.footerRow}>
          {onReplay && (
            <GameButton
              title=""
              icon="refresh"
              variant="secondary"
              size="lg"
              onPress={onReplay}
              style={styles.smallButton}
            />
          )}
          {onNextLevel && (
            <GameButton
              title="NEXT LEVEL"
              variant="success"
              size="lg"
              arrow
              onPress={onNextLevel}
              style={styles.mainButton}
            />
          )}
        </View>
      }
    >
      <View style={styles.container}>
        {/* Animated 3-Star Rating */}
        <View style={styles.starsRow}>
          <View style={[styles.starSide, activeStars >= 1 ? styles.starFilled : styles.starDim]}>
            <Ionicons name="star" size={42} color={activeStars >= 1 ? palette.gold[500] : palette.purple[300]} />
          </View>
          <View style={[styles.starCenter, activeStars >= 2 ? styles.starFilled : styles.starDim]}>
            <Ionicons name="star" size={54} color={activeStars >= 2 ? palette.gold[500] : palette.purple[300]} />
          </View>
          <View style={[styles.starSide, activeStars >= 3 ? styles.starFilled : styles.starDim]}>
            <Ionicons name="star" size={42} color={activeStars >= 3 ? palette.gold[500] : palette.purple[300]} />
          </View>
        </View>

        {isNewHighScore && (
          <Ribbon text="NEW HIGH SCORE!" variant="gold" style={styles.ribbon} />
        )}

        {/* Score & Rewards Panel */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={styles.scoreValue}>{score.toLocaleString()}</Text>
          </View>

          {highScore != null && (
            <View style={styles.subRow}>
              <Text style={styles.subLabel}>BEST</Text>
              <Text style={styles.subValue}>{highScore.toLocaleString()}</Text>
            </View>
          )}

          {coinsEarned > 0 && (
            <View style={styles.rewardContainer}>
              <CoinEarnedChip value={coinsEarned} />
            </View>
          )}
        </View>
      </View>
    </GameModal>
  );
}

export * from './types';
export * from './helper';
