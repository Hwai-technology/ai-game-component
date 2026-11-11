/**
 * Formats currency symbol and price string.
 */
export function formatShopPrice(price: number, currencyType: 'coins' | 'gems' = 'coins'): string {
  const icon = currencyType === 'coins' ? '🪙' : '💎';
  return `${price.toLocaleString()} ${icon}`;
}

