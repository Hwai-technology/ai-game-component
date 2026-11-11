import { Disposable } from '../../../../core/shared-types/src/index.js';
import { DamageEvent, HealthConfig, HealthState } from '../types/index.js';

export class HealthDamageSystem implements Disposable {
  private currentHealth: number;
  private maxHealth: number;
  private shield = 0;
  private invulnerabilityTimer = 0;
  private readonly defaultIFrameTime: number;

  private readonly damageListeners = new Set<(event: DamageEvent) => void>();
  private readonly deathListeners = new Set<() => void>();
  private _isDisposed = false;

  constructor(config: HealthConfig) {
    this.maxHealth = Math.max(1, config.maxHealth);
    this.currentHealth = config.initialHealth !== undefined ? config.initialHealth : this.maxHealth;
    this.defaultIFrameTime = config.invulnerabilityDurationSeconds ?? 0.5;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public addShield(amount: number): void {
    if (this._isDisposed || amount <= 0) return;
    this.shield += amount;
  }

  public heal(amount: number): number {
    if (this._isDisposed || this.isDead() || amount <= 0) return 0;
    const prev = this.currentHealth;
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    return this.currentHealth - prev;
  }

  public takeDamage(rawDamage: number, defense = 0, ignoreIFrames = false): DamageEvent | null {
    if (this._isDisposed || this.isDead() || rawDamage <= 0) return null;

    if (!ignoreIFrames && this.invulnerabilityTimer > 0) {
      return null; // Invulnerable!
    }

    // Armor mitigation formula: net = raw * 100 / (100 + defense)
    const mitigationRatio = 100 / (100 + Math.max(0, defense));
    const mitigated = Math.max(1, Math.round(rawDamage * mitigationRatio));

    let absorbed = 0;
    let remainder = mitigated;

    // Apply shield first
    if (this.shield > 0) {
      absorbed = Math.min(this.shield, remainder);
      this.shield -= absorbed;
      remainder -= absorbed;
    }

    const healthLost = Math.min(this.currentHealth, remainder);
    this.currentHealth -= healthLost;

    // Trigger i-frames
    if (!ignoreIFrames) {
      this.invulnerabilityTimer = this.defaultIFrameTime;
    }

    const event: DamageEvent = {
      rawDamage,
      mitigatedDamage: mitigated,
      absorbedByShield: absorbed,
      actualHealthLost: healthLost,
      currentHealth: this.currentHealth,
      isDead: this.isDead(),
    };

    for (const listener of this.damageListeners) {
      listener(event);
    }

    if (this.isDead()) {
      for (const listener of this.deathListeners) {
        listener();
      }
    }

    return event;
  }

  public step(deltaSeconds: number): void {
    if (this._isDisposed || deltaSeconds <= 0) return;
    if (this.invulnerabilityTimer > 0) {
      this.invulnerabilityTimer = Math.max(0, this.invulnerabilityTimer - deltaSeconds);
    }
  }

  public isDead(): boolean {
    return this.currentHealth <= 0;
  }

  public getState(): HealthState {
    return {
      currentHealth: this.currentHealth,
      maxHealth: this.maxHealth,
      shield: this.shield,
      isInvulnerable: this.invulnerabilityTimer > 0,
      isDead: this.isDead(),
    };
  }

  public onDamage(listener: (event: DamageEvent) => void): () => void {
    this.damageListeners.add(listener);
    return () => this.damageListeners.delete(listener);
  }

  public onDeath(listener: () => void): () => void {
    this.deathListeners.add(listener);
    return () => this.deathListeners.delete(listener);
  }

  public dispose(): void {
    this._isDisposed = true;
    this.damageListeners.clear();
    this.deathListeners.clear();
  }
}
