import { Ionicons } from '@expo/vector-icons';
import { ViewStyle } from 'react-native';

export type SkillButtonProps = {
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  cooldownSeconds?: number;
  cooldownTotal?: number;
  manaCost?: number;
  disabled?: boolean;
  size?: number;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
};

