import { Disposable, Vector2D } from '../../../../core/shared-types/src/index.js';
import { BlastImpact, BombHazard, DetonationEvent } from '../types/index.js';

export interface HazardTarget {
  id: string;
  position: Vector2D;
}

export class BombHazardSystem implements Disposable {
  private readonly bombs = new Map<string, BombHazard>();
  private readonly listeners = new Set<(event: DetonationEvent) => void>();
  private _isDisposed = false;

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public placeBomb(
    id: string,
    position: Vector2D,
    blastRadius = 80,
    baseDamage = 100,
    fuseSeconds = 3.0
  ): BombHazard {
    const bomb: BombHazard = {
      id,
      position: { ...position },
      blastRadius,
      baseDamage,
      fuseSecondsRemaining: fuseSeconds,
      isDetonated: false,
    };
    this.bombs.set(id, bomb);
    return bomb;
  }

  public step(deltaSeconds: number, targets: HazardTarget[] = []): DetonationEvent[] {
    if (this._isDisposed) return [];

    const detonations: DetonationEvent[] = [];

    for (const [id, bomb] of Array.from(this.bombs.entries())) {
      if (bomb.isDetonated) continue;

      bomb.fuseSecondsRemaining -= deltaSeconds;
      if (bomb.fuseSecondsRemaining <= 0) {
        const event = this.detonate(id, targets);
        if (event) detonations.push(event);
      }
    }

    return detonations;
  }

  public detonate(id: string, targets: HazardTarget[] = []): DetonationEvent | null {
    const bomb = this.bombs.get(id);
    if (!bomb || bomb.isDetonated) return null;

    bomb.isDetonated = true;
    const impacts: BlastImpact[] = [];
    const radiusSq = bomb.blastRadius * bomb.blastRadius;

    for (const target of targets) {
      const dx = target.position.x - bomb.position.x;
      const dy = target.position.y - bomb.position.y;
      const distSq = dx * dx + dy * dy;

      if (distSq <= radiusSq) {
        const dist = Math.sqrt(distSq);
        // Linear damage falloff: 100% at center, down to 20% at perimeter
        const falloffFactor = Math.max(0.2, 1 - dist / bomb.blastRadius);
        const damageInflicted = Math.round(bomb.baseDamage * falloffFactor);

        impacts.push({
          targetId: target.id,
          damageInflicted,
          distance: dist,
        });
      }
    }

    const event: DetonationEvent = {
      bomb: { ...bomb },
      impacts,
    };

    // Remove bomb from active map
    this.bombs.delete(id);

    for (const listener of this.listeners) {
      listener(event);
    }

    return event;
  }

  public onDetonate(listener: (event: DetonationEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public dispose(): void {
    this._isDisposed = true;
    this.bombs.clear();
    this.listeners.clear();
  }
}
