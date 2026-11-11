export interface PathNode {
  x: number;
  y: number;
}

export interface PathfindingConfig {
  allowDiagonal?: boolean;
  heuristic?: 'manhattan' | 'euclidean';
}

export interface PathfindingResult {
  found: boolean;
  path: PathNode[];
  cost: number;
}
