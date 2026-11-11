import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable, Serializable } from '../../../../core/shared-types/src/index.js';
import {
  InventoryConfig,
  InventoryItemDefinition,
  InventoryState,
  ItemStack,
} from '../types/index.js';

export class InventorySystem implements Disposable, Serializable<InventoryState> {
  public readonly maxSlots: number;
  private readonly slots: (ItemStack | null)[];
  private _isDisposed = false;

  constructor(config: InventoryConfig = {}) {
    this.maxSlots = config.maxSlots ?? 20;
    this.slots = Array.from({ length: this.maxSlots }, () => null);
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public addItem(item: InventoryItemDefinition, quantity = 1): number {
    if (this._isDisposed || quantity <= 0) return 0;

    let remainingToAdd = quantity;
    const maxStack = item.isStackable ? item.maxStack ?? 99 : 1;

    // 1. If stackable, try filling existing partial stacks
    if (item.isStackable) {
      for (let i = 0; i < this.maxSlots; i++) {
        const stack = this.slots[i];
        if (stack && stack.item.id === item.id && stack.quantity < maxStack) {
          const space = maxStack - stack.quantity;
          const toAdd = Math.min(space, remainingToAdd);
          stack.quantity += toAdd;
          remainingToAdd -= toAdd;
          if (remainingToAdd === 0) return quantity;
        }
      }
    }

    // 2. Put remainder into empty slots
    while (remainingToAdd > 0) {
      const emptySlotIdx = this.slots.findIndex((s) => s === null);
      if (emptySlotIdx === -1) break; // Inventory full!

      const toAdd = Math.min(maxStack, remainingToAdd);
      this.slots[emptySlotIdx] = {
        slotIndex: emptySlotIdx,
        item: { ...item },
        quantity: toAdd,
      };
      remainingToAdd -= toAdd;
    }

    return quantity - remainingToAdd; // Returns amount actually added
  }

  public removeItem(itemId: string, quantity = 1): number {
    if (this._isDisposed || quantity <= 0) return 0;

    let remainingToRemove = quantity;

    for (let i = this.maxSlots - 1; i >= 0; i--) {
      const stack = this.slots[i];
      if (stack && stack.item.id === itemId) {
        if (stack.quantity <= remainingToRemove) {
          remainingToRemove -= stack.quantity;
          this.slots[i] = null;
        } else {
          stack.quantity -= remainingToRemove;
          remainingToRemove = 0;
        }
        if (remainingToRemove === 0) break;
      }
    }

    return quantity - remainingToRemove;
  }

  public swapSlots(slotA: number, slotB: number): boolean {
    if (
      this._isDisposed ||
      slotA < 0 ||
      slotA >= this.maxSlots ||
      slotB < 0 ||
      slotB >= this.maxSlots
    ) {
      throw new ValidationError('Invalid slot indices');
    }

    const temp = this.slots[slotA] ?? null;
    this.slots[slotA] = this.slots[slotB] ?? null;
    this.slots[slotB] = temp;

    if (this.slots[slotA]) this.slots[slotA]!.slotIndex = slotA;
    if (this.slots[slotB]) this.slots[slotB]!.slotIndex = slotB;

    return true;
  }

  public getItemCount(itemId: string): number {
    let count = 0;
    for (const stack of this.slots) {
      if (stack && stack.item.id === itemId) {
        count += stack.quantity;
      }
    }
    return count;
  }

  public getState(): InventoryState {
    let total = 0;
    const copiedSlots = this.slots.map((s) => {
      if (!s) return null;
      total += s.quantity;
      return {
        slotIndex: s.slotIndex,
        item: { ...s.item },
        quantity: s.quantity,
      };
    });

    return {
      maxSlots: this.maxSlots,
      slots: copiedSlots,
      totalItemCount: total,
    };
  }

  public serialize(): InventoryState {
    return this.getState();
  }

  public deserialize(data: InventoryState): void {
    for (let i = 0; i < this.maxSlots; i++) {
      this.slots[i] = data.slots[i] ? { ...data.slots[i]! } : null;
    }
  }

  public dispose(): void {
    this._isDisposed = true;
  }
}
