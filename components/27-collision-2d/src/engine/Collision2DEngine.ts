import { Circle, Disposable, Rectangle, Vector2D } from '../../../../core/shared-types/src/index.js';
import { Collider, CollisionPair } from '../types/index.js';

export class Collision2DEngine implements Disposable {
  private readonly colliders = new Map<string, Collider>();
  private readonly spatialGrid = new Map<string, Set<string>>();
  private readonly cellSize: number;
  private _isDisposed = false;

  constructor(cellSize = 128) {
    this.cellSize = cellSize;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public addCollider(collider: Collider): void {
    this.colliders.set(collider.id, collider);
  }

  public removeCollider(id: string): void {
    this.colliders.delete(id);
  }

  public static testPointInRect(point: Vector2D, rect: Rectangle): boolean {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    );
  }

  public static testPointInCircle(point: Vector2D, circle: Circle): boolean {
    const dx = point.x - circle.x;
    const dy = point.y - circle.y;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  public static testRectRect(a: Rectangle, b: Rectangle): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  public static testCircleCircle(a: Circle, b: Circle): boolean {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const radiusSum = a.radius + b.radius;
    return dx * dx + dy * dy <= radiusSum * radiusSum;
  }

  public static testRectCircle(rect: Rectangle, circle: Circle): boolean {
    // Find closest point on rect to circle center
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    const dx = circle.x - closestX;
    const dy = circle.y - closestY;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  }

  public static testCollision(c1: Collider, c2: Collider): boolean {
    // Layer/mask bit check
    if (c1.layer !== undefined && c2.mask !== undefined && (c1.layer & c2.mask) === 0) {
      return false;
    }
    if (c2.layer !== undefined && c1.mask !== undefined && (c2.layer & c1.mask) === 0) {
      return false;
    }

    if (c1.shape.type === 'box' && c2.shape.type === 'box') {
      return Collision2DEngine.testRectRect(c1.shape.bounds, c2.shape.bounds);
    }
    if (c1.shape.type === 'circle' && c2.shape.type === 'circle') {
      return Collision2DEngine.testCircleCircle(c1.shape.bounds, c2.shape.bounds);
    }
    if (c1.shape.type === 'box' && c2.shape.type === 'circle') {
      return Collision2DEngine.testRectCircle(c1.shape.bounds, c2.shape.bounds);
    }
    if (c1.shape.type === 'circle' && c2.shape.type === 'box') {
      return Collision2DEngine.testRectCircle(c2.shape.bounds, c1.shape.bounds);
    }

    return false;
  }

  public detectCollisions(): CollisionPair[] {
    if (this._isDisposed) return [];

    this.rebuildSpatialGrid();
    const pairs: CollisionPair[] = [];
    const checked = new Set<string>();

    for (const cellBucket of this.spatialGrid.values()) {
      const items = Array.from(cellBucket);
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          const idA = items[i]!;
          const idB = items[j]!;
          const key = idA < idB ? `${idA}|${idB}` : `${idB}|${idA}`;

          if (checked.has(key)) continue;
          checked.add(key);

          const cA = this.colliders.get(idA)!;
          const cB = this.colliders.get(idB)!;

          if (Collision2DEngine.testCollision(cA, cB)) {
            pairs.push({ a: cA, b: cB });
          }
        }
      }
    }

    return pairs;
  }

  public dispose(): void {
    this._isDisposed = true;
    this.colliders.clear();
    this.spatialGrid.clear();
  }

  private rebuildSpatialGrid(): void {
    this.spatialGrid.clear();

    for (const [id, collider] of this.colliders.entries()) {
      let minX: number;
      let maxX: number;
      let minY: number;
      let maxY: number;

      if (collider.shape.type === 'box') {
        minX = collider.shape.bounds.x;
        maxX = collider.shape.bounds.x + collider.shape.bounds.width;
        minY = collider.shape.bounds.y;
        maxY = collider.shape.bounds.y + collider.shape.bounds.height;
      } else {
        minX = collider.shape.bounds.x - collider.shape.bounds.radius;
        maxX = collider.shape.bounds.x + collider.shape.bounds.radius;
        minY = collider.shape.bounds.y - collider.shape.bounds.radius;
        maxY = collider.shape.bounds.y + collider.shape.bounds.radius;
      }

      const startCellX = Math.floor(minX / this.cellSize);
      const endCellX = Math.floor(maxX / this.cellSize);
      const startCellY = Math.floor(minY / this.cellSize);
      const endCellY = Math.floor(maxY / this.cellSize);

      for (let cx = startCellX; cx <= endCellX; cx++) {
        for (let cy = startCellY; cy <= endCellY; cy++) {
          const cellKey = `${cx},${cy}`;
          if (!this.spatialGrid.has(cellKey)) {
            this.spatialGrid.set(cellKey, new Set());
          }
          this.spatialGrid.get(cellKey)!.add(id);
        }
      }
    }
  }
}
