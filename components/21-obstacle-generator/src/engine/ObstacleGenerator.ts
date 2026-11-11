import { Disposable } from '../../../../core/shared-types/src/index.js';
import { GameObstacle, ObstacleGeneratorConfig, ObstacleType } from '../types/index.js';

export class ObstacleGenerator implements Disposable {
  private readonly obstacles = new Map<string, GameObstacle>();
  private readonly spawnIntervalMeters: number;
  private readonly lanesCount: number;
  private readonly laneWidth: number;

  private lastSpawnDistance = 0;
  private counter = 0;
  private _isDisposed = false;

  constructor(config: ObstacleGeneratorConfig = {}) {
    this.spawnIntervalMeters = config.spawnIntervalMeters ?? 50;
    this.lanesCount = config.lanesCount ?? 3;
    this.laneWidth = config.laneWidth ?? 100;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public updateDistance(currentDistance: number, viewportY: number): GameObstacle[] {
    if (this._isDisposed) return [];

    const newSpawns: GameObstacle[] = [];

    // Check if distance passed next threshold
    if (currentDistance - this.lastSpawnDistance >= this.spawnIntervalMeters) {
      this.lastSpawnDistance = currentDistance;
      const obstacle = this.createObstacle(viewportY);
      newSpawns.push(obstacle);
    }

    return newSpawns;
  }

  public getActiveObstacles(): GameObstacle[] {
    return Array.from(this.obstacles.values()).filter((o) => o.isActive);
  }

  public removeOffscreen(minY: number): void {
    for (const [id, obs] of this.obstacles.entries()) {
      if (obs.bounds.y < minY) {
        obs.isActive = false;
        this.obstacles.delete(id);
      }
    }
  }

  public reset(): void {
    this.obstacles.clear();
    this.lastSpawnDistance = 0;
  }

  public dispose(): void {
    this._isDisposed = true;
    this.obstacles.clear();
  }

  private createObstacle(spawnY: number): GameObstacle {
    this.counter++;
    const lane = Math.floor(Math.random() * this.lanesCount);
    const types: ObstacleType[] = ['low_barrier', 'high_barrier', 'lane_blocker'];
    const type = types[Math.floor(Math.random() * types.length)]!;

    const obstacle: GameObstacle = {
      id: `obs_${this.counter}`,
      type,
      lane,
      bounds: {
        x: lane * this.laneWidth,
        y: spawnY,
        width: this.laneWidth * 0.8,
        height: type === 'low_barrier' ? 30 : 60,
      },
      isActive: true,
    };

    this.obstacles.set(obstacle.id, obstacle);
    return obstacle;
  }
}
