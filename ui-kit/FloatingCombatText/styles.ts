import { StyleSheet } from 'react-native';
import {
  shadows,
  typography,
} from '../theme';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    ...shadows.cardSoft,
  },
  text: {
    fontFamily: typography.fontFamily.heavy,
    fontSize: typography.fontSize.lg,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

