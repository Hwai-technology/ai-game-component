export type PlayerColor = 'white' | 'black';

export interface BoardPiece {
  id: string;
  type: string;
  color: PlayerColor;
}

export interface BoardCoord {
  row: number;
  col: number;
}

export interface BoardMove {
  from: BoardCoord;
  to: BoardCoord;
  piece: BoardPiece;
  captured?: BoardPiece;
}

export interface IBoardMovementRule {
  isLegalMove(
    board: (BoardPiece | null)[][],
    from: BoardCoord,
    to: BoardCoord,
    piece: BoardPiece
  ): boolean;
  getLegalMoves(
    board: (BoardPiece | null)[][],
    from: BoardCoord,
    piece: BoardPiece
  ): BoardCoord[];
}

export interface BoardGameState {
  board: (BoardPiece | null)[][];
  currentTurn: PlayerColor;
  moveHistory: BoardMove[];
  isGameOver: boolean;
  winner?: PlayerColor | 'draw';
}
