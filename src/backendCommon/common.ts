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

const FileIndex = {
  a: 0,
  b: 1,
  c: 2,
  d: 3,
  e: 4,
  f: 5,
  g: 6,
  h: 7
};

export const initialBoard = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, 8, 9, 10, 11, 12, 10, 9, 8, -1,
  -1, 7, 7, 7, 7, 7, 7, 7, 7, -1,
  -1, 0, 0, 0, 0, 0, 0, 0, 0, -1,
  -1, 0, 0, 0, 0, 0, 0, 0, 0, -1,
  -1, 0, 0, 0, 0, 0, 0, 0, 0, -1,
  -1, 0, 0, 0, 0, 0, 0, 0, 0, -1,
  -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, // 80 - 89
  -1, 2, 3, 4, 5, 6, 4, 3, 2, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
];

const bottomLeftIndex = 91;
const lengthOfBoard = 10;
export const squareToIndexOnBoard = (square: Square) =>
  bottomLeftIndex - (square.rank - 1) * lengthOfBoard + FileIndex[square.file];

export const calculateNewBoard = (board: number[], moves: Move[]) => {
  return moves.reduce((acc, move) => {
    acc[squareToIndexOnBoard(move.to)] = acc[squareToIndexOnBoard(move.from)];
    acc[squareToIndexOnBoard(move.from)] = 0;
    return acc;
  }, [...board]);
}

// end! taken from backend project