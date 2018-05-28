import * as classNames from "classnames";
import * as React from "react";

import "./BoardPiece.css";
import { PieceOnBoard } from "../types";
import { getChessPieceIcon } from "./boardUtils";

interface Props {
  chessPiece: PieceOnBoard;
}

const BoardPiece: React.StatelessComponent<Props> = ({ chessPiece }) => (
  <img
    src={getChessPieceIcon(chessPiece.value)}
    className={classNames(
      "board-piece",
      `${chessPiece.at.file}${chessPiece.at.rank}`,
      {
        "board-piece--captured": chessPiece.isCaptured
      }
    )}
  />
);

export default BoardPiece;
