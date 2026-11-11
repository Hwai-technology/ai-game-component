import { Ionicons } from '@expo/vector-icons';
import { ViewStyle } from 'react-native';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type InventoryItemSlot = {
  id: string;
  name: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  quantity?: number;
  rarity?: ItemRarity;
  isSelected?: boolean;
};

export type InventoryGridProps = {
  slots: (InventoryItemSlot | null)[];
  columns?: number;
  onSelectSlot?: (index: number, item: InventoryItemSlot | null) => void;
  style?: ViewStyle;
};

