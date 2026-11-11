import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { palette } from '../theme';
import GameButton from '../GameButton';
import Ribbon from '../Ribbon';
import { ShopCardProps } from './types';
import { styles } from './styles';
import { formatShopPrice } from './helper';

/**
 * In-game virtual currency store card.
 */
export default function ShopCard({
  title,
  description,
  iconName = 'gift-outline',
  price,
  currencyType = 'coins',
  isOwned = false,
  isEquipped = false,
  badgeText,
  onBuy,
  onEquip,
  style,
}: ShopCardProps) {
  return (
    <View style={[styles.card, style]}>
      {badgeText && (
        <View style={styles.badgeWrapper}>
          <Ribbon text={badgeText} variant="orange" />
        </View>
      )}

      {/* Item Icon Preview */}
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={36} color={palette.purple[700]} />
      </View>

      {/* Title & Description */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {description && (
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      )}

      {/* Action / Price Button */}
      <View style={styles.actionRow}>
        {isEquipped ? (
          <GameButton title="EQUIPPED" variant="ghost" size="sm" disabled fullWidth />
        ) : isOwned ? (
          <GameButton
            title="EQUIP"
            variant="secondary"
            size="sm"
            fullWidth
            onPress={onEquip}
          />
        ) : (
          <GameButton
            title={formatShopPrice(price, currencyType)}
            variant="primary"
            size="sm"
            fullWidth
            onPress={onBuy}
          />
        )}
      </View>
    </View>
  );
}

export * from './types';
export * from './helper';
