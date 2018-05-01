import * as firebase from "firebase";
import "firebase/firestore";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import api from "./api";
import { calculateNewBoard, initialBoard, Move } from "./backendCommon/common";
import ChessPiece from "./ChessPiece";
import env from "./env";
import "./GameRoom.css";

firebase.initializeApp(env.firebase);

interface IRoomResponse {
  board: number[];
  moves: Move[];
}

interface IState {
  isWhiteTurn: boolean;
  board?: number[];
}

interface IProps extends RouteComponentProps<{ roomId: string }> {}

export default class GameRoom extends React.Component<IProps, IState> {
  public state: IState = { isWhiteTurn: true };

  public componentDidMount() {
    firebase
      .firestore()
      .collection("rooms")
      .doc(this.props.match.params.roomId)
      .onSnapshot(doc => {
        const game = doc.data() as IRoomResponse;
        const newBoard = calculateNewBoard(initialBoard, game.moves);

        this.setState({
          board: newBoard.filter(piece => piece !== -1),
          isWhiteTurn: game.moves.length % 2 === 0
        });
      });
  }

  public selectSquare = () => {
    api.movePiece(this.props.match.params.roomId)
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
        <p>{this.state.isWhiteTurn ? 'White\'s turn' : 'Black\'s turn'}</p>
      </div>
    );
  }
}
