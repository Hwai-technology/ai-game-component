import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/constants/theme/tokens';
import IconButton, { IconButtonProps } from '../IconButton';
import { CoinChip } from '../StatBadge';

export type AppHeaderAction = Pick<IconButtonProps, 'icon' | 'onPress' | 'badge'>;

export type AppHeaderProps = {
  coins: number;
  onAddCoins?: () => void;
  /** Right-side round icon buttons, rendered in order (gifts, bell, settings...) */
  actions?: AppHeaderAction[];
  style?: ViewStyle;
};

/** Main-screen header: coin balance left, action icon buttons right. */
export default function AppHeader({ coins, onAddCoins, actions = [], style }: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.row, { paddingTop: insets.top + spacing.sm }, style]}>
      <CoinChip value={coins} onAdd={onAddCoins} />
      <View style={styles.actions}>
        {actions.map((action, i) => (
          <IconButton key={`${action.icon}-${i}`} {...action} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
