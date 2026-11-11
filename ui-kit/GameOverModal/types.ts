import { ViewStyle } from 'react-native';

export type GameOverModalProps = {
  score: number;
  highScore?: number;
  revivesLeft?: number;
  reviveCostGems?: number;
  onRetry: () => void;
  onRevive?: () => void;
  onHome?: () => void;
  style?: ViewStyle;
};

