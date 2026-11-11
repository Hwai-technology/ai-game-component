import { Dimensions2D, Disposable, Rectangle, Vector2D } from '../../../../core/shared-types/src/index.js';
import { CameraConfig, CameraState } from '../types/index.js';

export class CameraViewportController implements Disposable {
  private position: Vector2D = { x: 0, y: 0 };
  private viewport: Dimensions2D;
  private readonly worldBounds?: Rectangle;
  private readonly deadzone: Dimensions2D;
  private readonly lerpSpeed: number;
  private _isDisposed = false;

  constructor(config: CameraConfig) {
    this.viewport = { ...config.viewport };
    this.worldBounds = config.worldBounds ? { ...config.worldBounds } : undefined;
    this.deadzone = config.deadzone ?? { width: 40, height: 40 };
    this.lerpSpeed = config.lerpSpeed ?? 0.1;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getDeadzone(): Dimensions2D {
    return { ...this.deadzone };
  }

  public updateViewport(viewport: Dimensions2D): void {
    this.viewport = { ...viewport };
  }

  public followTarget(targetPos: Vector2D, immediate = false): void {
    if (this._isDisposed) return;

    // Desired camera position centers target in the viewport
    const desiredX = targetPos.x - this.viewport.width / 2;
    const desiredY = targetPos.y - this.viewport.height / 2;

    if (immediate) {
      this.position.x = desiredX;
      this.position.y = desiredY;
    } else {
      this.position.x += (desiredX - this.position.x) * this.lerpSpeed;
      this.position.y += (desiredY - this.position.y) * this.lerpSpeed;
    }

    this.clampToWorldBounds();
  }

  public worldToScreen(worldPoint: Vector2D): Vector2D {
    return {
      x: worldPoint.x - this.position.x,
      y: worldPoint.y - this.position.y,
    };
  }

  public screenToWorld(screenPoint: Vector2D): Vector2D {
    return {
      x: screenPoint.x + this.position.x,
      y: screenPoint.y + this.position.y,
    };
  }

  public getState(): CameraState {
    return {
      position: { ...this.position },
      center: {
        x: this.position.x + this.viewport.width / 2,
        y: this.position.y + this.viewport.height / 2,
      },
      viewport: { ...this.viewport },
    };
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  private clampToWorldBounds(): void {
    if (!this.worldBounds) return;

    const minX = this.worldBounds.x;
    const maxX = this.worldBounds.x + this.worldBounds.width - this.viewport.width;
    const minY = this.worldBounds.y;
    const maxY = this.worldBounds.y + this.worldBounds.height - this.viewport.height;

    if (maxX >= minX) {
      this.position.x = Math.max(minX, Math.min(this.position.x, maxX));
    } else {
      this.position.x = minX;
    }

    if (maxY >= minY) {
      this.position.y = Math.max(minY, Math.min(this.position.y, maxY));
    } else {
      this.position.y = minY;
    }
  }
}
