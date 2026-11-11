import { Image } from 'expo-image';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import ItemCacheService from '@/services/itemCacheService';

export type StarCoinProps = {
  /** Diameter in px */
  size?: number;
  style?: ViewStyle;
};

export default function StarCoin({ size = 22, style }: StarCoinProps) {
  const coinSource = ItemCacheService.getItemImageSource('coin');
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Image
        source={coinSource}
        style={{ width: size, height: size }}
        contentFit="contain"
        onError={(err) => {
          console.error('❌ [Backend Coin Image Error] Failed loading coin image:', err?.error || err);
        }}
      />
    </View>
  );
}
