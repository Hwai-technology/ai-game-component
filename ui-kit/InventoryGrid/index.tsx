import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { palette } from '../theme';
import { InventoryGridProps } from './types';
import { styles } from './styles';
import { getRarityColor } from './helper';

/**
 * Universal RPG / Strategy inventory slot grid.
 */
export default function InventoryGrid({
  slots,
  onSelectSlot,
  style,
}: InventoryGridProps) {
  return (
    <View style={[styles.grid, style]}>
      {slots.map((slot, index) => {
        const rarityColor = getRarityColor(slot?.rarity);
        const isSelected = slot?.isSelected ?? false;

        return (
          <Pressable
            key={slot ? slot.id : `empty-${index}`}
            style={[
              styles.slot,
              { borderColor: isSelected ? palette.orange[500] : rarityColor },
              isSelected && styles.selectedSlot,
            ]}
            onPress={() => onSelectSlot?.(index, slot)}
          >
            {slot ? (
              <View style={styles.itemContainer}>
                <Ionicons
                  name={slot.iconName ?? 'cube-outline'}
                  size={28}
                  color={rarityColor}
                />
                {slot.quantity != null && slot.quantity > 1 && (
                  <View style={styles.quantityBadge}>
                    <Text style={styles.quantityText}>{slot.quantity}</Text>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.emptyContainer} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export * from './types';
export * from './helper';
