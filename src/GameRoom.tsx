import axios from "axios";
import * as firebase from "firebase";
import "firebase/firestore";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import ChessPiece from "./ChessPiece";
import env from "./env";
import "./GameRoom.css";

firebase.initializeApp(env.firebase);

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

  public selectSquare = () => {
    axios
      .post(
        "https://us-central1-fire-chess-9825d.cloudfunctions.net/movePiece",
        { from: 100, to: 666, roomId: this.props.match.params.roomId }
      )
      .then((lol: any) => {
        console.log("hello");
        console.log(lol.data);
      })
      .catch(error => {
        alert(error.message);
      });
  };

  public render() {
    return (
      <div>
        <h1>{this.props.match.params.roomId}</h1>
        <div className="board">
          {this.state.board &&
            this.state.board.map((chessPiece, index) => (
              <ChessPiece
                key={index}
                chessPiece={chessPiece}
                index={index}
                onPress={this.selectSquare}
              />
            ))}
        </div>
      </div>
    );
  }
}
