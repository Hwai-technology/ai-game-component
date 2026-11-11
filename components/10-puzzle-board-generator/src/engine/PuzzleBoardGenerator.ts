import { BoardGeneratorConfig, GeneratedBoard } from '../types/index.js';

export class PuzzleBoardGenerator<T = number> {
  public static createPrng(seed: number): () => number {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  public generate(config: BoardGeneratorConfig<T>): GeneratedBoard<T> {
    const seed = config.seed ?? Math.floor(Math.random() * 1000000);
    const rand = PuzzleBoardGenerator.createPrng(seed);
    const grid: T[][] = [];

    const factory =
      config.tileFactory ??
      (((_r: number, _c: number, prng: () => number) => Math.floor(prng() * 10)) as unknown as (
        r: number,
        c: number,
        prng: () => number
      ) => T);

    for (let r = 0; r < config.rows; r++) {
      const row: T[] = [];
      for (let c = 0; c < config.columns; c++) {
        row.push(factory(r, c, rand));
      }
      grid.push(row);
    }

    return {
      rows: config.rows,
      columns: config.columns,
      grid,
      seed,
    };
  }
}
