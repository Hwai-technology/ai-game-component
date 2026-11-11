import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { palette, radius, shadows, spacing, surface } from '@/constants/theme/tokens';

export type GameCardVariant = 'plain' | 'cream' | 'outlined';

export type GameCardProps = ViewProps & {
  variant?: GameCardVariant;
  radiusSize?: 'lg' | 'xl';
  padded?: boolean;
};

/** Base surface for every card in the game UI. */
export default function GameCard({
  variant = 'plain',
  radiusSize = 'lg',
  padded = true,
  style,
  children,
  ...rest
}: GameCardProps) {
  return (
    <View
      style={[
        styles.base,
        { borderRadius: radius[radiusSize] },
        variant === 'cream' && styles.cream,
        variant === 'outlined' && styles.outlined,
        padded && styles.padded,
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: surface.white,
    ...shadows.card,
  },
  cream: {
    backgroundColor: surface.cream,
  },
  outlined: {
    borderWidth: 2,
    borderColor: palette.purple[100],
  },
  padded: {
    padding: spacing.lg,
  },
});
