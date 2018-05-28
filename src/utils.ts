import { ChessPiece, Move } from "./backendCommon/common";

export const calculatePiecesFromMoves = (moves: Move[]) =>
  moves.reduce(
    (pieces, move) =>
      pieces
        .map(
          piece =>
            piece.at.rank === move.to.rank && piece.at.file === move.to.file
              ? { ...piece, isCaptured: true }
              : piece
        )
        .map(
          piece =>
            piece.at.rank === move.from.rank && piece.at.file === move.from.file
              ? { ...piece, at: { file: move.to.file, rank: move.to.rank } }
              : piece
        ),
    initialPieces
  );

const initialPieces = [
  {
    at: { file: "a", rank: 8 },
    isCaptured: false,
    value: ChessPiece.BlackRook
  },
  {
    at: { file: "b", rank: 8 },
    isCaptured: false,
    value: ChessPiece.BlackKnight
  },
  {
    at: { file: "c", rank: 8 },
    isCaptured: false,
    value: ChessPiece.BlackBishop
  },
  {
    at: { file: "d", rank: 8 },
    isCaptured: false,
    value: ChessPiece.BlackQueen
  },
  {
    at: { file: "e", rank: 8 },
    isCaptured: false,
    value: ChessPiece.BlackKing
  },
  {
    at: { file: "f", rank: 8 },
    isCaptured: false,
    value: ChessPiece.BlackBishop
  },
  {
    at: { file: "g", rank: 8 },
    isCaptured: false,
    value: ChessPiece.BlackKnight
  },
  {
    at: { file: "h", rank: 8 },
    isCaptured: false,
    value: ChessPiece.BlackRook
  },
  {
    at: { file: "a", rank: 7 },
    isCaptured: false,
    value: ChessPiece.BlackPawn
  },
  {
    at: { file: "b", rank: 7 },
    isCaptured: false,
    value: ChessPiece.BlackPawn
  },
  {
    at: { file: "c", rank: 7 },
    isCaptured: false,
    value: ChessPiece.BlackPawn
  },
  {
    at: { file: "d", rank: 7 },
    isCaptured: false,
    value: ChessPiece.BlackPawn
  },
  {
    at: { file: "e", rank: 7 },
    isCaptured: false,
    value: ChessPiece.BlackPawn
  },
  {
    at: { file: "f", rank: 7 },
    isCaptured: false,
    value: ChessPiece.BlackPawn
  },
  {
    at: { file: "g", rank: 7 },
    isCaptured: false,
    value: ChessPiece.BlackPawn
  },
  {
    at: { file: "h", rank: 7 },
    isCaptured: false,
    value: ChessPiece.BlackPawn
  },
  {
    at: { file: "a", rank: 2 },
    isCaptured: false,
    value: ChessPiece.WhitePawn
  },
  {
    at: { file: "b", rank: 2 },
    isCaptured: false,
    value: ChessPiece.WhitePawn
  },
  {
    at: { file: "c", rank: 2 },
    isCaptured: false,
    value: ChessPiece.WhitePawn
  },
  {
    at: { file: "d", rank: 2 },
    isCaptured: false,
    value: ChessPiece.WhitePawn
  },
  {
    at: { file: "e", rank: 2 },
    isCaptured: false,
    value: ChessPiece.WhitePawn
  },
  {
    at: { file: "f", rank: 2 },
    isCaptured: false,
    value: ChessPiece.WhitePawn
  },
  {
    at: { file: "g", rank: 2 },
    isCaptured: false,
    value: ChessPiece.WhitePawn
  },
  {
    at: { file: "h", rank: 2 },
    isCaptured: false,
    value: ChessPiece.WhitePawn
  },
  {
    at: { file: "a", rank: 1 },
    isCaptured: false,
    value: ChessPiece.WhiteRook
  },
  {
    at: { file: "b", rank: 1 },
    isCaptured: false,
    value: ChessPiece.WhiteKnight
  },
  {
    at: { file: "c", rank: 1 },
    isCaptured: false,
    value: ChessPiece.WhiteBishop
  },
  {
    at: { file: "d", rank: 1 },
    isCaptured: false,
    value: ChessPiece.WhiteQueen
  },
  {
    at: { file: "e", rank: 1 },
    isCaptured: false,
    value: ChessPiece.WhiteKing
  },
  {
    at: { file: "f", rank: 1 },
    isCaptured: false,
    value: ChessPiece.WhiteBishop
  },
  {
    at: { file: "g", rank: 1 },
    isCaptured: false,
    value: ChessPiece.WhiteKnight
  },
  {
    at: { file: "h", rank: 1 },
    isCaptured: false,
    value: ChessPiece.WhiteRook
  }
];
