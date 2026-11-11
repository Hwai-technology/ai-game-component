import { Dimensions2D } from '../../../../core/shared-types/src/index.js';

export interface TileLayer {
  name: string;
  data: number[][]; // 2D array of tile IDs
  isSolid?: boolean;
}

export interface TilemapConfig {
  tileWidth: number;
  tileHeight: number;
  layers: TileLayer[];
}

export interface TilemapState {
  columns: number;
  rows: number;
  tileDimensions: Dimensions2D;
  worldDimensions: Dimensions2D;
}
