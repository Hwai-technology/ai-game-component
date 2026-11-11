import { Disposable } from '../../../../core/shared-types/src/index.js';
import {
  IDictionaryAdapter,
  WordGridPosition,
  WordPuzzleConfig,
  WordPuzzleState,
  WordSelectionResult,
} from '../types/index.js';

export class SetDictionaryAdapter implements IDictionaryAdapter {
  private readonly wordSet: Set<string>;

  constructor(words: string[]) {
    this.wordSet = new Set(words.map((w) => w.toUpperCase().trim()));
  }

  public isValidWord(word: string): boolean {
    return this.wordSet.has(word.toUpperCase().trim());
  }
}

export class WordPuzzleEngine implements Disposable {
  private readonly grid: string[][];
  private readonly rows: number;
  private readonly cols: number;
  private readonly dictionary: IDictionaryAdapter;
  private readonly minWordLength: number;
  private readonly allowDiagonal: boolean;

  private readonly foundWords = new Set<string>();
  private totalScore = 0;
  private _isDisposed = false;

  constructor(config: WordPuzzleConfig) {
    this.grid = config.grid.map((r) => r.map((c) => c.toUpperCase()));
    this.rows = this.grid.length;
    this.cols = this.grid[0]?.length ?? 0;
    this.dictionary = config.dictionary;
    this.minWordLength = config.minWordLength ?? 3;
    this.allowDiagonal = config.allowDiagonal ?? true;
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public getState(): WordPuzzleState {
    return {
      foundWords: Array.from(this.foundWords),
      totalScore: this.totalScore,
    };
  }

  public submitPath(path: WordGridPosition[]): WordSelectionResult {
    if (this._isDisposed || path.length === 0) {
      return { valid: false, word: '', score: 0, reason: 'INVALID_PATH' };
    }

    // 1. Validate contiguous path without reusing positions
    const visited = new Set<string>();
    let word = '';

    for (let i = 0; i < path.length; i++) {
      const pos = path[i]!;
      if (pos.row < 0 || pos.row >= this.rows || pos.col < 0 || pos.col >= this.cols) {
        return { valid: false, word: '', score: 0, reason: 'INVALID_PATH' };
      }

      const key = `${pos.row},${pos.col}`;
      if (visited.has(key)) {
        return { valid: false, word: '', score: 0, reason: 'INVALID_PATH' };
      }
      visited.add(key);

      if (i > 0) {
        const prev = path[i - 1]!;
        const dRow = Math.abs(pos.row - prev.row);
        const dCol = Math.abs(pos.col - prev.col);
        const isNeighbor = this.allowDiagonal
          ? dRow <= 1 && dCol <= 1 && (dRow !== 0 || dCol !== 0)
          : (dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1);

        if (!isNeighbor) {
          return { valid: false, word: '', score: 0, reason: 'INVALID_PATH' };
        }
      }

      word += this.grid[pos.row]![pos.col]!;
    }

    // 2. Validate length
    if (word.length < this.minWordLength) {
      return { valid: false, word, score: 0, reason: 'TOO_SHORT' };
    }

    // 3. Check already found
    if (this.foundWords.has(word)) {
      return { valid: false, word, score: 0, reason: 'ALREADY_FOUND' };
    }

    // 4. Validate against dictionary
    if (!this.dictionary.isValidWord(word)) {
      return { valid: false, word, score: 0, reason: 'NOT_IN_DICTIONARY' };
    }

    // Success! Calculate score
    const score = word.length * 10 + (word.length >= 5 ? 20 : 0);
    this.foundWords.add(word);
    this.totalScore += score;

    return { valid: true, word, score };
  }

  public dispose(): void {
    this._isDisposed = true;
    this.foundWords.clear();
  }
}

