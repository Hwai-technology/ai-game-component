import { ViewStyle } from 'react-native';

export type VictoryModalProps = {
  stars?: number; // 0 to 3
  score: number;
  highScore?: number;
  coinsEarned?: number;
  isNewHighScore?: boolean;
  onNextLevel?: () => void;
  onReplay?: () => void;
  onHome?: () => void;
  style?: ViewStyle;
};

