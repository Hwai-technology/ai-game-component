import { ViewStyle } from 'react-native';

export type GameHUDProps = {
  score?: number;
  highScore?: number;
  lives?: number;
  coins?: number;
  level?: number | string;
  timeRemaining?: string | number;
  onPause?: () => void;
  onSettings?: () => void;
  style?: ViewStyle;
};

