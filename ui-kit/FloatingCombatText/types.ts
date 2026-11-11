import { ViewStyle } from 'react-native';

export type CombatTextType = 'damage' | 'heal' | 'critical' | 'combo' | 'levelup';

export type FloatingCombatTextProps = {
  text: string;
  type?: CombatTextType;
  style?: ViewStyle;
};

