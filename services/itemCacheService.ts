/**
 * Item cache service fallback for asset/item hydration
 */
export const ItemCacheService = {
  getItem: (_id: string) => null,
  setItem: (_id: string, _value: unknown) => {},
};

export default ItemCacheService;

