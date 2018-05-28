import { ChessPiece, Square } from "./backendCommon/common";

export interface GlobalState {
  state: {
    userId?: string
  }
}

export interface PieceOnBoard {
  value: ChessPiece;
  at: Square;
  isCaptured: boolean;
}