import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import { EquipmentItem, EquipmentSlotType, EquipmentState } from '../types/index.js';

export class EquipmentSystem implements Disposable {
  private readonly equipped: Partial<Record<EquipmentSlotType, EquipmentItem>> = {};
  private aggregatedModifiers: Record<string, number> = {};
  private _isDisposed = false;

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public equip(slot: EquipmentSlotType, item: EquipmentItem): EquipmentItem | null {
    if (this._isDisposed) return null;

    if (item.slotType !== slot) {
      throw new ValidationError(`Item '${item.name}' requires slot '${item.slotType}', cannot equip in '${slot}'`);
    }

    const previousItem = this.equipped[slot] ?? null;
    this.equipped[slot] = { ...item };
    this.recalculateModifiers();

    return previousItem; // Returns displaced item if any
  }

  public unequip(slot: EquipmentSlotType): EquipmentItem | null {
    if (this._isDisposed || !this.equipped[slot]) return null;

    const unequipped = this.equipped[slot]!;
    delete this.equipped[slot];
    this.recalculateModifiers();

    return unequipped;
  }

  public getEquipped(slot: EquipmentSlotType): EquipmentItem | undefined {
    return this.equipped[slot];
  }

  public getAggregatedModifiers(): Readonly<Record<string, number>> {
    return this.aggregatedModifiers;
  }

  public getState(): EquipmentState {
    return {
      equipped: { ...this.equipped },
      aggregatedModifiers: { ...this.aggregatedModifiers },
    };
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  private recalculateModifiers(): void {
    const agg: Record<string, number> = {};

    for (const item of Object.values(this.equipped)) {
      if (!item) continue;
      for (const [stat, bonus] of Object.entries(item.modifiers)) {
        agg[stat] = (agg[stat] ?? 0) + bonus;
      }
    }

    this.aggregatedModifiers = agg;
  }
}

