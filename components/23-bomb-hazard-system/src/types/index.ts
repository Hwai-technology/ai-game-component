import { Vector2D } from '../../../../core/shared-types/src/index.js';

export interface BombHazard {
  id: string;
  position: Vector2D;
  blastRadius: number;
  baseDamage: number;
  fuseSecondsRemaining: number;
  isDetonated: boolean;
}

export interface BlastImpact {
  targetId: string;
  damageInflicted: number;
  distance: number;
}

export interface DetonationEvent {
  bomb: BombHazard;
  impacts: BlastImpact[];
}

