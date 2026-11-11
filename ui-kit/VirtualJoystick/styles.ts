import { StyleSheet } from 'react-native';
import {
  chunky,
  palette,
  radius,
  shadows,
  surface,
} from '../theme';

export const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(237, 228, 249, 0.65)',
    borderWidth: 3,
    borderColor: palette.purple[300],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.cardSoft,
  },
  disabled: {
    opacity: 0.4,
  },
  knob: {
    backgroundColor: surface.white,
    borderWidth: 2,
    borderColor: palette.purple[500],
    borderBottomWidth: chunky.edge.md,
    borderBottomColor: palette.purple[700],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.cardSoft,
  },
  knobInner: {
    width: 14,
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: palette.purple[500],
  },
  arrowNorth: {
    position: 'absolute',
    top: 6,
  },
  arrowSouth: {
    position: 'absolute',
    bottom: 6,
  },
  arrowWest: {
    position: 'absolute',
    left: 6,
  },
  arrowEast: {
    position: 'absolute',
    right: 6,
  },
});

