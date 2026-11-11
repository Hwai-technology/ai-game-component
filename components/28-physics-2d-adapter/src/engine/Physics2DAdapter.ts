import { Disposable, Vector2D } from '../../../../core/shared-types/src/index.js';
import { PhysicsWorldConfig, RigidBody2D } from '../types/index.js';

export class Physics2DAdapter implements Disposable {
  public gravity: Vector2D;
  private readonly airResistance: number;
  private readonly bodies = new Map<string, RigidBody2D>();
  private _isDisposed = false;

  constructor(config: PhysicsWorldConfig = {}) {
    this.gravity = config.gravity ?? { x: 0, y: 980 };
    this.airResistance = config.airResistance ?? 0.01;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public addBody(body: RigidBody2D): void {
    this.bodies.set(body.id, { ...body });
  }

  public getBody(id: string): RigidBody2D | undefined {
    return this.bodies.get(id);
  }

  public removeBody(id: string): boolean {
    return this.bodies.delete(id);
  }

  public applyForce(id: string, force: Vector2D): void {
    const body = this.bodies.get(id);
    if (!body || body.isStatic || body.mass <= 0) return;

    body.acceleration.x += force.x / body.mass;
    body.acceleration.y += force.y / body.mass;
  }

  public applyImpulse(id: string, impulse: Vector2D): void {
    const body = this.bodies.get(id);
    if (!body || body.isStatic || body.mass <= 0) return;

    body.velocity.x += impulse.x / body.mass;
    body.velocity.y += impulse.y / body.mass;
  }

  public step(deltaSeconds: number): void {
    if (this._isDisposed || deltaSeconds <= 0) return;

    for (const body of this.bodies.values()) {
      if (body.isStatic) continue;

      // 1. Apply gravity
      body.velocity.x += this.gravity.x * body.gravityScale * deltaSeconds;
      body.velocity.y += this.gravity.y * body.gravityScale * deltaSeconds;

      // 2. Apply acceleration
      body.velocity.x += body.acceleration.x * deltaSeconds;
      body.velocity.y += body.acceleration.y * deltaSeconds;

      // 3. Apply air damping
      const damping = Math.max(0, 1 - this.airResistance * deltaSeconds);
      body.velocity.x *= damping;
      body.velocity.y *= damping;

      // 4. Integrate position
      body.position.x += body.velocity.x * deltaSeconds;
      body.position.y += body.velocity.y * deltaSeconds;

      // Reset instantaneous acceleration
      body.acceleration.x = 0;
      body.acceleration.y = 0;
    }
  }

  public dispose(): void {
    this._isDisposed = true;
    this.bodies.clear();
  }
}

