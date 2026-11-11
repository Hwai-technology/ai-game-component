import { Disposable, Vector2D } from '../../../../core/shared-types/src/index.js';
import {
  CollectibleConfig,
  CollectibleItem,
  CollectionEvent,
  IHapticDriver,
} from '../types/index.js';

export class MockHapticDriver implements IHapticDriver {
  public triggerCount = 0;
  public impactAsync(): void {
    this.triggerCount++;
  }
}

export class CoinCollectibleSystem implements Disposable {
  private readonly items = new Map<string, CollectibleItem>();
  private readonly collectionRadiusSq: number;
  private readonly hapticDriver?: IHapticDriver;
  private readonly listeners = new Set<(event: CollectionEvent) => void>();

  private totalCollectedCount = 0;
  private totalValue = 0;
  private _isDisposed = false;

  constructor(config: CollectibleConfig = {}) {
    const radius = config.collectionRadius ?? 25;
    this.collectionRadiusSq = radius * radius;
    this.hapticDriver = config.hapticDriver;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public spawn(item: Omit<CollectibleItem, 'isCollected'>): CollectibleItem {
    const fullItem: CollectibleItem = { ...item, isCollected: false };
    this.items.set(item.id, fullItem);
    return fullItem;
  }

  public getActiveItems(): CollectibleItem[] {
    return Array.from(this.items.values()).filter((i) => !i.isCollected);
  }

  public checkProximity(playerPosition: Vector2D): CollectionEvent[] {
    if (this._isDisposed) return [];

    const collectedEvents: CollectionEvent[] = [];

    for (const item of this.items.values()) {
      if (item.isCollected) continue;

      const dx = playerPosition.x - item.position.x;
      const dy = playerPosition.y - item.position.y;
      const distSq = dx * dx + dy * dy;

      if (distSq <= this.collectionRadiusSq) {
        item.isCollected = true;
        this.totalCollectedCount++;
        this.totalValue += item.value;

        if (this.hapticDriver) {
          try {
            this.hapticDriver.impactAsync('light');
          } catch {
            // Ignore haptic failures
          }
        }

        const event: CollectionEvent = {
          item: { ...item },
          valueAwarded: item.value,
          totalCollectedCount: this.totalCollectedCount,
          totalValue: this.totalValue,
        };

        collectedEvents.push(event);

        for (const listener of this.listeners) {
          listener(event);
        }
      }
    }

    return collectedEvents;
  }

  public onCollect(listener: (event: CollectionEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public getTotalValue(): number {
    return this.totalValue;
  }

  public getTotalCount(): number {
    return this.totalCollectedCount;
  }

  public reset(): void {
    this.items.clear();
    this.totalCollectedCount = 0;
    this.totalValue = 0;
  }

  public dispose(): void {
    this._isDisposed = true;
    this.items.clear();
    this.listeners.clear();
  }
}

