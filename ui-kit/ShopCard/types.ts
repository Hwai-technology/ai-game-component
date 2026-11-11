import { Ionicons } from '@expo/vector-icons';
import { ViewStyle } from 'react-native';

export type ShopCardProps = {
  title: string;
  description?: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  price: number;
  currencyType?: 'coins' | 'gems';
  isOwned?: boolean;
  isEquipped?: boolean;
  badgeText?: string;
  onBuy?: () => void;
  onEquip?: () => void;
  style?: ViewStyle;
};

