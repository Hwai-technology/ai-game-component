export interface InventoryItemDefinition {
  id: string;
  name: string;
  isStackable: boolean;
  maxStack?: number;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  metadata?: Record<string, unknown>;
}

export interface ItemStack {
  slotIndex: number;
  item: InventoryItemDefinition;
  quantity: number;
}

export interface InventoryConfig {
  maxSlots?: number; // default 20
}

export interface InventoryState {
  maxSlots: number;
  slots: (ItemStack | null)[];
  totalItemCount: number;
}
