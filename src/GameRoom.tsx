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
  moves: Move[];
}

interface IState {
  board?: number[];
}

interface IProps extends RouteComponentProps<{ roomId: string }> {}


// taken from backend project
interface Move {
  from: Square;
  to: Square;
}

interface Square {
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

const initialBoard = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, 8, 9, 10, 12, 11, 10, 9, 8, -1,
  -1, 7, 7, 7, 7, 7, 7, 7, 7, -1,
  -1, 0, 0, 0, 0, 0, 0, 0, 0, -1,
  -1, 0, 0, 0, 0, 0, 0, 0, 0, -1,
  -1, 0, 0, 0, 0, 0, 0, 0, 0, -1,
  -1, 0, 0, 0, 0, 0, 0, 0, 0, -1,
  -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, // 80 - 89
  -1, 2, 3, 4, 6, 5, 4, 3, 2, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
];

const bottomLeftIndex = 91;
const lengthOfBoard = 10;
export const squareToIndexOnBoard = (square: Square) =>
  bottomLeftIndex - (square.rank - 1) * lengthOfBoard + FileIndex[square.file];

const calculateNewBoard = (board: number[], moves: Move[]) => {
  return moves.reduce((acc, move) => {
    acc[squareToIndexOnBoard(move.to)] = acc[squareToIndexOnBoard(move.from)];
    acc[squareToIndexOnBoard(move.from)] = 0;
    return acc;
  }, [...board]);
}

// end! taken from backend project

export default class GameRoom extends React.Component<IProps, IState> {
  public state: IState = {};

  public componentDidMount() {
    firebase
      .firestore()
      .collection("rooms")
      .doc(this.props.match.params.roomId)
      .onSnapshot(doc => {
        const game = doc.data() as IRoomResponse;
        const newBoard = calculateNewBoard(initialBoard, game.moves)

        this.setState({ board: newBoard.filter(piece => piece !== -1) });
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
