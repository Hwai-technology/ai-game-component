import { StyleSheet } from 'react-native';
import {
  chunky,
  radius,
  shadows,
  spacing,
  surface,
  text,
  typography,
} from '../theme';

export const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  slot: {
    width: 64,
    height: 64,
    backgroundColor: surface.cream,
    borderRadius: radius.md,
    borderWidth: 2,
    borderBottomWidth: chunky.edge.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.cardSoft,
  },
  selectedSlot: {
    borderWidth: 3,
    borderBottomWidth: chunky.edge.md,
    backgroundColor: surface.white,
    transform: [{ scale: 1.05 }],
  },
  itemContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    width: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  quantityBadge: {
    position: 'absolute',
    bottom: 2,
    right: 4,
    backgroundColor: surface.white,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    ...shadows.cardSoft,
  },
  quantityText: {
    fontFamily: typography.fontFamily.heavy,
    fontSize: 10,
    color: text.primary,
  },
});

