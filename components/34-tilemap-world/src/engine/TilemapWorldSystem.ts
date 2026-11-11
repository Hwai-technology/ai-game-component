import { Disposable, Vector2D } from '../../../../core/shared-types/src/index.js';
import { TileLayer, TilemapConfig, TilemapState } from '../types/index.js';

export class TilemapWorldSystem implements Disposable {
  public readonly tileWidth: number;
  public readonly tileHeight: number;
  public readonly columns: number;
  public readonly rows: number;
  private readonly layers = new Map<string, TileLayer>();
  private _isDisposed = false;

  constructor(config: TilemapConfig) {
    this.tileWidth = config.tileWidth;
    this.tileHeight = config.tileHeight;

    const firstLayer = config.layers[0];
    this.rows = firstLayer?.data.length ?? 0;
    this.columns = firstLayer?.data[0]?.length ?? 0;

    for (const layer of config.layers) {
      this.layers.set(layer.name, { ...layer });
    }
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public worldToTile(worldPos: Vector2D): Vector2D {
    return {
      x: Math.floor(worldPos.x / this.tileWidth),
      y: Math.floor(worldPos.y / this.tileHeight),
    };
  }

  public tileToWorld(tileCoord: Vector2D): Vector2D {
    return {
      x: tileCoord.x * this.tileWidth,
      y: tileCoord.y * this.tileHeight,
    };
  }

  public getTileAt(layerName: string, tileX: number, tileY: number): number | null {
    const layer = this.layers.get(layerName);
    if (!layer || tileY < 0 || tileY >= this.rows || tileX < 0 || tileX >= this.columns) {
      return null;
    }
    return layer.data[tileY]?.[tileX] ?? null;
  }

  public isWorldPosSolid(worldPos: Vector2D): boolean {
    if (this._isDisposed) return false;

    const tileCoord = this.worldToTile(worldPos);
    if (tileCoord.x < 0 || tileCoord.x >= this.columns || tileCoord.y < 0 || tileCoord.y >= this.rows) {
      return true; // Treat world bounds as solid barrier
    }

    for (const layer of this.layers.values()) {
      if (layer.isSolid) {
        const tileId = layer.data[tileCoord.y]?.[tileCoord.x];
        if (tileId !== undefined && tileId > 0) {
          return true;
        }
      }
    }

    return false;
  }

  public getState(): TilemapState {
    return {
      columns: this.columns,
      rows: this.rows,
      tileDimensions: { width: this.tileWidth, height: this.tileHeight },
      worldDimensions: {
        width: this.columns * this.tileWidth,
        height: this.rows * this.tileHeight,
      },
    };
  }

  public dispose(): void {
    this._isDisposed = true;
    this.layers.clear();
  }
}
