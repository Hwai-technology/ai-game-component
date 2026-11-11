import { ViewStyle } from 'react-native';

export type PauseMenuProps = {
  visible?: boolean;
  soundEnabled?: boolean;
  musicEnabled?: boolean;
  hapticsEnabled?: boolean;
  onResume: () => void;
  onRestart?: () => void;
  onQuit?: () => void;
  onToggleSound?: (val: boolean) => void;
  onToggleMusic?: (val: boolean) => void;
  onToggleHaptics?: (val: boolean) => void;
  style?: ViewStyle;
};

