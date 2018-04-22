import * as firebase from "firebase";
import "firebase/firestore";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import env from "./env";
import "./GameRoom.css";

firebase.initializeApp(env.firebase);

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
      return '';
  }
};

interface IRoomResponse {
  board: number[];
}

interface IState {
  board?: number[];
}

interface IProps extends RouteComponentProps<{ roomId: string }> {}

export default class GameRoom extends React.Component<IProps, IState> {
  public state: IState = {};

  public componentDidMount() {
    firebase
      .firestore()
      .collection("rooms")
      .doc(this.props.match.params.roomId)
      .onSnapshot(doc => {
        const game = doc.data() as IRoomResponse;
        this.setState({ board: game.board });
      });
  }

  public render() {
    return (
      <div>
        <h1>{this.props.match.params.roomId}</h1>
        <div className="board">
          {this.state.board &&
            this.state.board.map((chessPiece, index) => (
              <div key={index} className="chess-piece">
                {getChessPieceIcon(chessPiece)}
              </div>
            ))}
        </div>
      </div>
    );
  }
}
