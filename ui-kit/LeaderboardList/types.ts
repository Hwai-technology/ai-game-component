import { Ionicons } from '@expo/vector-icons';
import { ViewStyle } from 'react-native';

export type LeaderboardEntry = {
  rank: number;
  playerId: string;
  name: string;
  score: number;
  avatarIcon?: React.ComponentProps<typeof Ionicons>['name'];
  isCurrentPlayer?: boolean;
};

export type LeaderboardListProps = {
  entries: LeaderboardEntry[];
  style?: ViewStyle;
};

