import * as classNames from "classnames";
import * as React from "react";
import { PieceOnBoard } from "./GameRoom";

const getChessPieceIcon = (chessPieceNumber: number) => {
  switch (chessPieceNumber) {
    case 1:
      return "\u2659";
    case 2:
      return "\u2656";
    case 3:
      return "\u2658";
    case 4:
      return "\u2657";
    case 5:
      return "\u2655";
    case 6:
      return "\u2654";
    case 7:
      return "\u265F";
    case 8:
      return "\u265C";
    case 9:
      return "\u265E";
    case 10:
      return "\u265D";
    case 11:
      return "\u265B";
    case 12:
      return "\u265A";
    default:
      return "";
  }
};

interface IProps {
  chessPiece: PieceOnBoard;
}

const BoardPiece: React.StatelessComponent<IProps> = ({ chessPiece }) => (
  <div
    className={classNames(
      "chess-piece",
      `${chessPiece.at.file}${chessPiece.at.rank}`,
      {
        "chess-piece--captured": chessPiece.isCaptured
      }
    )}
  >
    {getChessPieceIcon(chessPiece.value)}
  </div>
);

export default BoardPiece;
