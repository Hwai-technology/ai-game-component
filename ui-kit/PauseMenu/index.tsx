import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { palette } from '../theme';
import GameButton from '../GameButton';
import GameModal from '../GameModal';
import Toggle from '../Toggle';
import { PauseMenuProps } from './types';
import { styles } from './styles';

/**
 * Universal In-Game Pause Dialog with animated resume, restart, and audio toggles.
 */
export default function PauseMenu({
  soundEnabled = true,
  musicEnabled = true,
  hapticsEnabled = true,
  onResume,
  onRestart,
  onQuit,
  onToggleSound,
  onToggleMusic,
  onToggleHaptics,
  style,
}: PauseMenuProps) {
  return (
    <GameModal
      title="GAME PAUSED"
      onClose={onResume}
      style={style}
      footer={
        <GameButton
          title="RESUME"
          variant="success"
          size="lg"
          icon="play"
          fullWidth
          onPress={onResume}
        />
      }
    >
      <View style={styles.content}>
        {/* Audio & Haptic Controls */}
        <View style={styles.settingsBox}>
          {onToggleSound && (
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelGroup}>
                <Ionicons name="volume-high" size={20} color={palette.purple[700]} />
                <Text style={styles.toggleText}>Sound Effects</Text>
              </View>
              <Toggle value={soundEnabled} onValueChange={onToggleSound} />
            </View>
          )}

          {onToggleMusic && (
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelGroup}>
                <Ionicons name="musical-notes" size={20} color={palette.purple[700]} />
                <Text style={styles.toggleText}>Music</Text>
              </View>
              <Toggle value={musicEnabled} onValueChange={onToggleMusic} />
            </View>
          )}

          {onToggleHaptics && (
            <View style={styles.toggleRow}>
              <View style={styles.toggleLabelGroup}>
                <Ionicons name="phone-portrait-outline" size={20} color={palette.purple[700]} />
                <Text style={styles.toggleText}>Vibration</Text>
              </View>
              <Toggle value={hapticsEnabled} onValueChange={onToggleHaptics} />
            </View>
          )}
        </View>

        {/* Secondary Action Buttons */}
        <View style={styles.buttonStack}>
          {onRestart && (
            <GameButton
              title="RESTART"
              variant="secondary"
              size="md"
              icon="refresh"
              fullWidth
              onPress={onRestart}
            />
          )}
          {onQuit && (
            <GameButton
              title="MAIN MENU"
              variant="ghost"
              size="sm"
              icon="home-outline"
              fullWidth
              onPress={onQuit}
            />
          )}
        </View>
      </View>
    </GameModal>
  );
}

export * from './types';
export * from './helper';
