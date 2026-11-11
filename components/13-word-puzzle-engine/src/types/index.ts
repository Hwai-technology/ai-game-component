export interface WordGridPosition {
  row: number;
  col: number;
}

export interface IDictionaryAdapter {
  isValidWord(word: string): boolean;
  isValidPrefix?(prefix: string): boolean;
}

export interface WordPuzzleConfig {
  grid: string[][]; // 2D array of uppercase characters
  dictionary: IDictionaryAdapter;
  minWordLength?: number;
  allowDiagonal?: boolean;
}

export interface WordSelectionResult {
  valid: boolean;
  word: string;
  score: number;
  reason?: 'TOO_SHORT' | 'NOT_IN_DICTIONARY' | 'ALREADY_FOUND' | 'INVALID_PATH';
}

export interface WordPuzzleState {
  foundWords: string[];
  totalScore: number;
}

