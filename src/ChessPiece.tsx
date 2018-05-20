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
  index: number;
  isActive: boolean;
  isDark: boolean;
  onPress(index: number): void;
}

// const getRank = (index: number) => {
//   if (index < 8) {
//     return "8";
//   } else if (index < 16) {
//     return "7";
//   } else if (index < 24) {
//     return "6";
//   } else if (index < 32) {
//     return "5";
//   } else if (index < 40) {
//     return "4";
//   } else if (index < 48) {
//     return "3";
//   } else if (index < 56) {
//     return "2";
//   }
//   return "1";
// };

// const getFile = (index: number) => {
//   if (index % 8 === 0) {
//     return "a";
//   } else if (index % 8 === 1) {
//     return "b";
//   } else if (index % 8 === 2) {
//     return "c";
//   } else if (index % 8 === 3) {
//     return "d";
//   } else if (index % 8 === 4) {
//     return "e";
//   } else if (index % 8 === 5) {
//     return "f";
//   } else if (index % 8 === 6) {
//     return "g";
//   }
//   return "h";
// };

// const getFileAndrank = (index: number) => {
//   return getFile(index) + getRank(index);
// };

export default class ChessPiece extends React.Component<IProps> {
  public selectSquare = () => {
    this.props.onPress(this.props.index);
  };

  public render() {
    return (
      <>
        {/* <div
          className={classNames("square", {
            "square--dark": this.props.isDark
          })}
            onClick={this.selectSquare}
        /> */}
        <div
          className={classNames(
            "chess-piece",
            `${this.props.chessPiece.at.file}${this.props.chessPiece.at.rank}`,
            {
              // "chess-piece--active": this.props.isActive
              "chess-piece--captured": this.props.chessPiece.isCaptured
            }
          )}
        >
          {getChessPieceIcon(this.props.chessPiece.value)}
        </div>
      </>
    );
  }
}
