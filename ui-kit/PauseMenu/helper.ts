/**
 * Computes audio state summary string for debugging or telemetry.
 */
export function getAudioSummary(soundEnabled: boolean, musicEnabled: boolean): string {
  if (soundEnabled && musicEnabled) return 'All Audio ON';
  if (!soundEnabled && !musicEnabled) return 'Muted';
  if (soundEnabled) return 'SFX Only';
  return 'Music Only';
}

