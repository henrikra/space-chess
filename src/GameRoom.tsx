import * as firebase from "firebase";
import "firebase/firestore";
import * as React from "react";
import { RouteComponentProps } from "react-router";

import api from "./api";
import { calculateNewBoard, initialBoard, Move } from "./backendCommon/common";
import ChessPiece from "./ChessPiece";
import env from "./env";
import "./GameRoom.css";
import withAuthentication, {
  WithAuthenticationProps
} from "./hocs/withAuthentication";

firebase.initializeApp(env.firebase);

const firestore = firebase.firestore();
firestore.settings({ timestampsInSnapshots: true });

interface IRoomResponse {
  board: number[];
  moves: Move[];
}

interface IState {
  isWhiteTurn: boolean;
  board?: number[];
}

interface IProps
  extends RouteComponentProps<{ roomId: string }>,
    WithAuthenticationProps {}

class GameRoom extends React.Component<IProps, IState> {
  public roomListenerUnsubscribe: firebase.Unsubscribe;
  public state: IState = { isWhiteTurn: true };

  public componentDidMount() {
    this.roomListenerUnsubscribe = firestore
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

  public componentWillUnmount() {
    this.roomListenerUnsubscribe();
  }

  public selectSquare = () => {
    api
      .movePiece(this.props.match.params.roomId)
      .then((lol: any) => {
        console.log("hello");
        console.log(lol.data);
      })
      .catch(error => {
        alert(error.message);
      });
  };

  public joinGame = async () => {
    try {
      await api.joinGame(this.props.match.params.roomId, this.props.userId)
    } catch (error) {
      alert(error.response.data.error)
    }
  }

  public render() {
    return (
      <div>
        <h1>{this.props.match.params.roomId}</h1>
        <button onClick={this.joinGame}>Join the game</button>
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
        <p>{this.state.isWhiteTurn ? "White's turn" : "Black's turn"}</p>
      </div>
    );
  }
}

export default withAuthentication(GameRoom);
