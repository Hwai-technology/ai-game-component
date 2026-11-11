export type EquipmentSlotType =
  | 'main_hand'
  | 'off_hand'
  | 'head'
  | 'chest'
  | 'feet'
  | 'ring';

export interface EquipmentItem {
  id: string;
  name: string;
  slotType: EquipmentSlotType;
  modifiers: Record<string, number>; // e.g. { attack: 15, defense: 5 }
  requiredLevel?: number;
}

export interface EquipmentState {
  equipped: Partial<Record<EquipmentSlotType, EquipmentItem>>;
  aggregatedModifiers: Record<string, number>;
}
