import { ViewStyle } from 'react-native';

export type JoystickPosition = {
  x: number;
  y: number;
};

export type VirtualJoystickProps = {
  size?: number;
  stickPosition?: JoystickPosition;
  disabled?: boolean;
  style?: ViewStyle;
};

