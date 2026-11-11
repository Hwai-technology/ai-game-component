import { ValidationError } from '../../../../core/error-system/src/index.js';
import { Disposable } from '../../../../core/shared-types/src/index.js';
import {
  BoardCoord,
  BoardGameState,
  BoardMove,
  BoardPiece,
  IBoardMovementRule,
  PlayerColor,
} from '../types/index.js';

export class OrthogonalMovementRule implements IBoardMovementRule {
  constructor(private readonly maxDistance = 7) {}

  public isLegalMove(
    board: (BoardPiece | null)[][],
    from: BoardCoord,
    to: BoardCoord,
    piece: BoardPiece
  ): boolean {
    const dRow = to.row - from.row;
    const dCol = to.col - from.col;

    // Must be straight horizontal or vertical
    if ((dRow !== 0 && dCol !== 0) || (dRow === 0 && dCol === 0)) return false;
    const dist = Math.abs(dRow) + Math.abs(dCol);
    if (dist > this.maxDistance) return false;

    // Check path obstruction
    const stepR = dRow === 0 ? 0 : dRow > 0 ? 1 : -1;
    const stepC = dCol === 0 ? 0 : dCol > 0 ? 1 : -1;
    let currR = from.row + stepR;
    let currC = from.col + stepC;

    while (currR !== to.row || currC !== to.col) {
      if (board[currR]?.[currC] !== null) return false; // blocked
      currR += stepR;
      currC += stepC;
    }

    // Target cell cannot contain own piece
    const destPiece = board[to.row]?.[to.col];
    if (destPiece && destPiece.color === piece.color) return false;

    return true;
  }

  public getLegalMoves(
    board: (BoardPiece | null)[][],
    from: BoardCoord,
    piece: BoardPiece
  ): BoardCoord[] {
    const moves: BoardCoord[] = [];
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < (board[0]?.length ?? 0); c++) {
        if (this.isLegalMove(board, from, { row: r, col: c }, piece)) {
          moves.push({ row: r, col: c });
        }
      }
    }
    return moves;
  }
}

export class BoardGameRulesEngine implements Disposable {
  public readonly rows: number;
  public readonly cols: number;
  private board: (BoardPiece | null)[][];
  private currentTurn: PlayerColor = 'white';
  private readonly moveHistory: BoardMove[] = [];
  private readonly rules = new Map<string, IBoardMovementRule>();
  private isGameOver = false;
  private winner?: PlayerColor | 'draw';
  private _isDisposed = false;

  constructor(rows = 8, cols = 8) {
    this.rows = rows;
    this.cols = cols;
    this.board = Array.from({ length: rows }, () => Array.from({ length: cols }, () => null));

    // Register standard orthogonal rule by default
    this.rules.set('orthogonal', new OrthogonalMovementRule());
  }

  public isDisposed(): boolean {
    return this._isDisposed;
  }

  public registerRule(pieceType: string, rule: IBoardMovementRule): void {
    this.rules.set(pieceType, rule);
  }

  public placePiece(coord: BoardCoord, piece: BoardPiece): void {
    if (coord.row < 0 || coord.row >= this.rows || coord.col < 0 || coord.col >= this.cols) {
      throw new ValidationError('Coordinate out of board bounds');
    }
    this.board[coord.row]![coord.col] = piece;
  }

  public getPiece(coord: BoardCoord): BoardPiece | null {
    return this.board[coord.row]?.[coord.col] ?? null;
  }

  public canMove(from: BoardCoord, to: BoardCoord): boolean {
    if (this._isDisposed || this.isGameOver) return false;

    const piece = this.getPiece(from);
    if (!piece) return false;
    if (piece.color !== this.currentTurn) return false;

    const rule = this.rules.get(piece.type);
    if (!rule) return false;

    return rule.isLegalMove(this.board, from, to, piece);
  }

  public move(from: BoardCoord, to: BoardCoord): BoardMove {
    if (this._isDisposed || this.isGameOver) {
      throw new ValidationError('Game is already over or disposed');
    }

    if (!this.canMove(from, to)) {
      throw new ValidationError(`Illegal move from (${from.row},${from.col}) to (${to.row},${to.col})`);
    }

    const piece = this.getPiece(from)!;
    const dest = this.getPiece(to);

    const boardMove: BoardMove = {
      from,
      to,
      piece: { ...piece },
      captured: dest ? { ...dest } : undefined,
    };

    // Apply move
    this.board[to.row]![to.col] = piece;
    this.board[from.row]![from.col] = null;
    this.moveHistory.push(boardMove);

    // Switch turn
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';

    return boardMove;
  }

  public setGameOver(winner: PlayerColor | 'draw'): void {
    this.isGameOver = true;
    this.winner = winner;
  }

  public getState(): BoardGameState {
    return {
      board: this.board.map((r) => r.map((c) => (c ? { ...c } : null))),
      currentTurn: this.currentTurn,
      moveHistory: [...this.moveHistory],
      isGameOver: this.isGameOver,
      winner: this.winner,
    };
  }

  public dispose(): void {
    this._isDisposed = true;
  }
}
