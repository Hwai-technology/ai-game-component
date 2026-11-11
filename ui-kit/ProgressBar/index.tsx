import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { gradients, palette, radius, spacing, surface, text } from '@/constants/theme/tokens';

// ---------------------------------------------------------------------------
// LevelProgressBar — dark track with a gold gradient fill (game HUD)
// ---------------------------------------------------------------------------

export type LevelProgressBarProps = {
  /** 0 → 1 */
  progress: number;
  height?: number;
  style?: ViewStyle;
};

export function LevelProgressBar({ progress, height = 14, style }: LevelProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <LinearGradient
        colors={[...gradients.goldFill]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fill, { width: `${clamped * 100}%`, borderRadius: height / 2 }]}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// StepProgress — dots connected by lines, ending in an optional reward icon
// (the "Next Scan Reward" card)
// ---------------------------------------------------------------------------

export type StepState = 'done' | 'active' | 'upcoming';

export type StepProgressProps = {
  steps: StepState[];
  /** Reward icon capping the row (defaults to a gift) */
  rewardIcon?: React.ComponentProps<typeof Ionicons>['name'];
  style?: ViewStyle;
};

export function StepProgress({ steps, rewardIcon = 'gift', style }: StepProgressProps) {
  return (
    <View style={[styles.stepsRow, style]}>
      {steps.map((state, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <View
              style={[
                styles.connector,
                { backgroundColor: state === 'upcoming' ? palette.purple[100] : palette.teal[500] },
              ]}
            />
          )}
          <StepDot state={state} />
        </React.Fragment>
      ))}
      <View style={[styles.connector, { backgroundColor: palette.purple[100] }]} />
      <View style={styles.rewardCircle}>
        <Ionicons name={rewardIcon} size={14} color={palette.purple[500]} />
      </View>
    </View>
  );
}

function StepDot({ state }: { state: StepState }) {
  if (state === 'done') {
    return (
      <View style={[styles.dot, styles.dotDone]}>
        <Ionicons name="checkmark" size={12} color={surface.white} />
      </View>
    );
  }
  if (state === 'active') {
    return (
      <View style={[styles.dot, styles.dotActive]}>
        <View style={styles.dotActiveCore} />
      </View>
    );
  }
  return <View style={[styles.dot, styles.dotUpcoming]} />;
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: palette.purple[900],
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  fill: {
    height: '100%',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connector: {
    flex: 1,
    height: 3,
    borderRadius: radius.pill,
    marginHorizontal: spacing.xs / 2,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotDone: {
    backgroundColor: palette.teal[500],
  },
  dotActive: {
    backgroundColor: surface.white,
    borderWidth: 2,
    borderColor: palette.teal[500],
  },
  dotActiveCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.teal[500],
  },
  dotUpcoming: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: text.muted,
    opacity: 0.5,
  },
  rewardCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: palette.purple[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
