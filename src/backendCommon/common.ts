// taken from backend project
export interface Move {
  from: Square;
  to: Square;
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

// end! taken from backend project