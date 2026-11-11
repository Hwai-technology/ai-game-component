import { GameLoopEngine } from '../../../components/01-game-loop/src/index.js';
import { EndlessRunnerEngine, RunnerLane } from '../../../components/19-endless-runner/src/index.js';
import { CoinCollectibleSystem, CollectibleItem } from '../../../components/20-coin-collectible-system/src/index.js';
import { ObstacleGenerator } from '../../../components/21-obstacle-generator/src/index.js';
import { Collision2DEngine } from '../../../components/27-collision-2d/src/index.js';
import { ScoringEngine } from '../../../components/44-scoring-engine/src/index.js';
import { gleebooThemeTokens, createCartoonBoxStyle } from '../../../core/theme-adapter/src/index.js';

export interface RunnerGameConfig {
  initialSpeed?: number;
  maxSpeed?: number;
  acceleration?: number;
  targetFps?: number;
}

export class EndlessRunnerGame {
  public readonly loop: GameLoopEngine;
  public readonly runner: EndlessRunnerEngine;
  public readonly collectibles: CoinCollectibleSystem;
  public readonly obstacles: ObstacleGenerator;
  public readonly collision: Collision2DEngine;
  public readonly scoring: ScoringEngine;

  private _isGameOver: boolean = false;

  constructor(config: RunnerGameConfig = {}) {
    this.runner = new EndlessRunnerEngine({
      initialSpeed: config.initialSpeed ?? 200,
      maxSpeed: config.maxSpeed ?? 800,
      acceleration: config.acceleration ?? 5,
    });

    this.collectibles = new CoinCollectibleSystem({
      collectionRadius: 50,
    });

    this.obstacles = new ObstacleGenerator({
      spawnIntervalMeters: 50,
      lanesCount: 3,
      laneWidth: 100,
    });

    this.collision = new Collision2DEngine();

    this.scoring = new ScoringEngine({
      maxMultiplier: 8,
      comboTimeoutSeconds: 3.0,
    });

    this.loop = new GameLoopEngine({
      fps: config.targetFps ?? 60,
      fixedTimestep: true,
      autoStart: false,
    });
    this.loop.onUpdate((payload) => this.tick(payload.deltaTime));
  }

  public get isGameOver(): boolean {
    return this._isGameOver || this.runner.getState().isGameOver;
  }

  public get coinsCollected(): number {
    return this.collectibles.getTotalCount();
  }

  public get currentLane(): RunnerLane {
    return this.runner.getState().lane;
  }

  public start(): void {
    this._isGameOver = false;
    this.loop.start();
  }

  public stop(): void {
    this.loop.stop();
  }

  public moveLeft(): void {
    if (this._isGameOver) return;
    this.runner.performAction('lane_left');
  }

  public moveRight(): void {
    if (this._isGameOver) return;
    this.runner.performAction('lane_right');
  }

  public jump(): void {
    if (this._isGameOver) return;
    this.runner.performAction('jump');
  }

  public slide(): void {
    if (this._isGameOver) return;
    this.runner.performAction('slide');
  }

  private coinIdCounter = 0;

  public spawnCoin(lane: number, y: number, value: number = 1): CollectibleItem {
    this.coinIdCounter++;
    return this.collectibles.spawn({
      id: `coin-${this.coinIdCounter}`,
      type: 'coin',
      value,
      position: { x: lane * 100, y },
    });
  }

  public tick(dt: number): void {
    if (this.isGameOver) return;

    // 1. Advance runner kinematics
    this.runner.step(dt);
    const state = this.runner.getState();

    // 2. Score increases with distance
    this.scoring.addPoints(Math.floor(state.distance * dt));

    // 3. Update procedural obstacles
    this.obstacles.updateDistance(state.distance, 0);

    // 4. Update coins proximity check
    const playerX = state.lane * 100;
    const playerY = state.isJumping ? 100 : 0;
    const collected = this.collectibles.checkProximity({ x: playerX, y: playerY });
    for (const evt of collected) {
      this.scoring.addPoints(evt.valueAwarded * 50, 'coin');
    }

    // 5. Check collision with obstacles
    const playerBox = {
      x: playerX - 30,
      y: playerY,
      width: 60,
      height: state.isSliding ? 40 : 80,
    };

    for (const obs of this.obstacles.getActiveObstacles()) {
      if (Collision2DEngine.testRectRect(playerBox, obs.bounds)) {
        this._isGameOver = true;
        this.loop.stop();
        break;
      }
    }
  }

  public getRenderTheme() {
    return {
      tokens: gleebooThemeTokens,
      playerStyle: createCartoonBoxStyle('teal', 'sm'),
      laneStyle: createCartoonBoxStyle('purple', 'md'),
      coinStyle: createCartoonBoxStyle('gold', 'sm'),
      obstacleStyle: createCartoonBoxStyle('red', 'md'),
    };
  }
}
export type { CollectibleItem };
