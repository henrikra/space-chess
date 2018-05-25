// taken from backend project
export interface Move {
  from: Square;
  to: Square;
  hasCaptureHappened: boolean;
}

export enum ChessPiece {
  None,
  WhitePawn,
  WhiteRook,
  WhiteKnight,
  WhiteBishop,
  WhiteQueen,
  WhiteKing,
  BlackPawn,
  BlackRook,
  BlackKnight,
  BlackBishop,
  BlackQueen,
  BlackKing
}

export interface Square {
  file: string;
  rank: number;
}

export interface RoomModel {
  isGameFull: boolean;
  moves: Move[];
  winnerColor?: string;
}

// end! taken from backend project
