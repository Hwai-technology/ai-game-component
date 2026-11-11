export interface BoardGeneratorConfig<T = number> {
  rows: number;
  columns: number;
  seed?: number;
  tileFactory?: (row: number, col: number, rand: () => number) => T;
}

export interface GeneratedBoard<T = number> {
  rows: number;
  columns: number;
  grid: T[][];
  seed: number;
}

