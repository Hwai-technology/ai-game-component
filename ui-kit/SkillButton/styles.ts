import { StyleSheet } from 'react-native';
import {
  chunky,
  palette,
  radius,
  shadows,
  surface,
  typography,
} from '../theme';

export const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderColor: surface.white,
    borderBottomWidth: chunky.edge.md,
    borderBottomColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.cardSoft,
  },
  disabledButton: {
    opacity: 0.6,
  },
  cooldownOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(44, 32, 73, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cooldownText: {
    fontFamily: typography.fontFamily.heavy,
    fontSize: 12,
    color: palette.gold[300],
  },
  manaBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: palette.purple[700],
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: surface.white,
  },
  manaText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 9,
    color: surface.white,
  },
});

