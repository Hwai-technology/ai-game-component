import { Disposable } from '../../../../core/shared-types/src/index.js';
import { PathfindingConfig, PathfindingResult, PathNode } from '../types/index.js';

interface AStarInternalNode {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent?: AStarInternalNode;
}

export class PathfindingEngine implements Disposable {
  private readonly allowDiagonal: boolean;
  private readonly heuristicType: 'manhattan' | 'euclidean';
  private _isDisposed = false;

  constructor(config: PathfindingConfig = {}) {
    this.allowDiagonal = config.allowDiagonal ?? false;
    this.heuristicType = config.heuristic ?? 'manhattan';
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Finds the optimal shortest path across a grid.
   * @param grid 2D array where 0 = walkable, 1+ = wall/obstacle or higher terrain cost. -1 = completely blocked.
   */
  public findPath(grid: number[][], start: PathNode, goal: PathNode): PathfindingResult {
    if (this._isDisposed || grid.length === 0 || grid[0]?.length === 0) {
      return { found: false, path: [], cost: 0 };
    }

    const rows = grid.length;
    const cols = grid[0]!.length;

    // Check bounds and walkable start/goal
    if (
      start.x < 0 ||
      start.x >= cols ||
      start.y < 0 ||
      start.y >= rows ||
      goal.x < 0 ||
      goal.x >= cols ||
      goal.y < 0 ||
      goal.y >= rows
    ) {
      return { found: false, path: [], cost: 0 };
    }

    if (grid[start.y]![start.x] === -1 || grid[goal.y]![goal.x] === -1) {
      return { found: false, path: [], cost: 0 };
    }

    if (start.x === goal.x && start.y === goal.y) {
      return { found: true, path: [{ ...start }], cost: 0 };
    }

    const openList: AStarInternalNode[] = [];
    const openSet = new Map<string, AStarInternalNode>();
    const closedSet = new Set<string>();

    const startNode: AStarInternalNode = {
      x: start.x,
      y: start.y,
      g: 0,
      h: this.heuristic(start, goal),
      f: this.heuristic(start, goal),
    };

    openList.push(startNode);
    openSet.set(`${start.x},${start.y}`, startNode);

    const neighborsOffsets = this.allowDiagonal
      ? [
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
          { x: -1, y: -1 },
          { x: 1, y: -1 },
          { x: -1, y: 1 },
          { x: 1, y: 1 },
        ]
      : [
          { x: 0, y: -1 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: -1, y: 0 },
        ];

    while (openList.length > 0) {
      // Find node with lowest f
      let lowestIdx = 0;
      for (let i = 1; i < openList.length; i++) {
        if (openList[i]!.f < openList[lowestIdx]!.f) {
          lowestIdx = i;
        }
      }

      const current = openList.splice(lowestIdx, 1)[0]!;
      const currentKey = `${current.x},${current.y}`;
      openSet.delete(currentKey);
      closedSet.add(currentKey);

      // Check if reached goal
      if (current.x === goal.x && current.y === goal.y) {
        return {
          found: true,
          path: this.reconstructPath(current),
          cost: current.g,
        };
      }

      // Explore neighbors
      for (const offset of neighborsOffsets) {
        const nx = current.x + offset.x;
        const ny = current.y + offset.y;

        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        const tileCost = grid[ny]![nx]!;
        if (tileCost === -1) continue; // Impassable

        const nKey = `${nx},${ny}`;
        if (closedSet.has(nKey)) continue;

        const isDiag = offset.x !== 0 && offset.y !== 0;
        const stepCost = (isDiag ? 1.414 : 1.0) * (tileCost === 0 ? 1 : tileCost);
        const tentativeG = current.g + stepCost;

        let neighbor = openSet.get(nKey);
        if (!neighbor) {
          neighbor = {
            x: nx,
            y: ny,
            g: tentativeG,
            h: this.heuristic({ x: nx, y: ny }, goal),
            f: tentativeG + this.heuristic({ x: nx, y: ny }, goal),
            parent: current,
          };
          openList.push(neighbor);
          openSet.set(nKey, neighbor);
        } else if (tentativeG < neighbor.g) {
          neighbor.g = tentativeG;
          neighbor.f = tentativeG + neighbor.h;
          neighbor.parent = current;
        }
      }
    }

    return { found: false, path: [], cost: 0 };
  }

  public dispose(): void {
    this._isDisposed = true;
  }

  private heuristic(a: PathNode, b: PathNode): number {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    return this.heuristicType === 'euclidean'
      ? Math.sqrt(dx * dx + dy * dy)
      : dx + dy;
  }

  private reconstructPath(endNode: AStarInternalNode): PathNode[] {
    const path: PathNode[] = [];
    let curr: AStarInternalNode | undefined = endNode;
    while (curr) {
      path.unshift({ x: curr.x, y: curr.y });
      curr = curr.parent;
    }
    return path;
  }
}

